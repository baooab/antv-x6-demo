import { Graph, type Node, Snapline, Stencil } from '@antv/x6'
import { useEffect, useRef } from 'react'
import { bindAgentFlowInteractions } from '../../agent-flow/graphInteractions'
import { createAgentCard, createAgentStencilCard } from '../../agent-flow/factory'
import {
  agentFlowHighlighting,
  agentFlowViewport,
  agentStencilGraphOptions,
  agentStencilSearchUi,
  createAgentFlowConnecting,
} from '../../agent-flow/graphOptions'
import { ensureAgentFlowShapesRegistered } from '../../agent-flow/registerShapes'
import type { AgentConfigs } from '../../agent-flow/types'
import { AgentFlowLayout } from '../../agent-flow/AgentFlowLayout'

function getConfig(configs: AgentConfigs, type: string) {
  return configs[type] ?? null
}

/** 教程 07：从模具拖入后替换为 React 节点（初始画布为空） */
export function Lesson07DropReplace() {
  const stencilRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const graphEl = graphRef.current
    const stencilEl = stencilRef.current
    if (!graphEl || !stencilEl) return

    ensureAgentFlowShapesRegistered()

    const graph: Graph = new Graph({
      container: graphEl,
      autoResize: true,
      grid: true,
      ...agentFlowViewport,
      connecting: createAgentFlowConnecting(() => graph),
      highlighting: agentFlowHighlighting,
    })

    graph.use(new Snapline())
    const unbind = bindAgentFlowInteractions(graph)

    const stencil = new Stencil({
      title: '拖入画布 → 变为 React 卡片',
      target: graph,
      stencilGraphWidth: 240,
      stencilGraphHeight: 480,
      stencilGraphOptions: agentStencilGraphOptions,
      ...agentStencilSearchUi,
      collapsable: true,
      groups: [
        {
          title: '业务逻辑',
          name: 'biz',
          graphHeight: 200,
          layoutOptions: { rowHeight: 88 },
        },
        {
          title: '数据',
          name: 'data',
          graphHeight: 200,
          layoutOptions: { rowHeight: 88 },
        },
      ],
      layoutOptions: { columns: 1, columnWidth: 230, rowHeight: 88, dx: 8 },
    })
    stencilEl.appendChild(stencil.container as HTMLElement)

    let cancelled = false
    let configs: AgentConfigs = {}

    const onNodeAdded = ({ node }: { node: Node }) => {
      const data = node.getData() as { type?: string } | undefined
      const type = data?.type
      if (type && node.shape !== 'agent-react-card') {
        const cfg = getConfig(configs, type)
        if (cfg) {
          const { x, y } = node.position()
          const newNode = createAgentCard(graph, cfg).position(x, y)
          node.remove()
          graph.addNode(newNode)
        }
      }
    }
    graph.on('node:added', onNodeAdded)

    const run = async () => {
      const res = await fetch('/data/agent-flow.json')
      if (!res.ok) throw new Error(`加载配置失败: ${res.status}`)
      const data = (await res.json()) as AgentConfigs
      if (cancelled) return
      configs = data

      const must = (key: string) => {
        const c = getConfig(configs, key)
        if (!c) throw new Error(`配置缺少 key: ${key}`)
        return c
      }

      stencil.load(
        [createAgentStencilCard(graph, must('llm')), createAgentStencilCard(graph, must('code'))],
        'biz',
      )
      stencil.load(
        [createAgentStencilCard(graph, must('kb')), createAgentStencilCard(graph, must('db'))],
        'data',
      )
    }

    run().catch(console.error)

    return () => {
      cancelled = true
      graph.off('node:added', onNodeAdded)
      unbind()
      stencil.dispose()
      graph.dispose()
    }
  }, [])

  return (
    <AgentFlowLayout
      stencilRef={stencilRef}
      graphRef={graphRef}
      className="tutorial-demo-inner"
    />
  )
}
