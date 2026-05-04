/**
 * 阶段 7 — 组装：Graph + Stencil + 异步数据
 * 学习顺序建议：先读本文件如何「搭架子」，再按 import 反查各模块。
 */
import { Graph, type Node, Snapline, Stencil } from '@antv/x6'
import { useEffect, useRef } from 'react'
import { bindAgentFlowInteractions } from './graphInteractions'
import { createAgentCard, createAgentStencilCard } from './factory'
import {
  agentFlowHighlighting,
  agentFlowViewport,
  createAgentFlowConnecting,
} from './graphOptions'
import { ensureAgentFlowShapesRegistered } from './registerShapes'
import type { AgentConfigs } from './types'
import { AgentFlowLayout } from './AgentFlowLayout'

function getConfig(configs: AgentConfigs, type: string) {
  return configs[type] ?? null
}

export function AgentFlowView() {
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

    const stencil = new Stencil({
      title: '智能体流程编排',
      target: graph,
      stencilGraphWidth: 240,
      stencilGraphHeight: 480,
      stencilGraphOptions: { panning: true },
      collapsable: true,
      groups: [
        {
          title: '业务逻辑',
          name: 'biz',
          graphHeight: 380,
          layoutOptions: { rowHeight: 88 },
        },
        {
          title: '知识库&数据',
          name: 'data',
          graphHeight: 300,
          layoutOptions: { rowHeight: 88 },
        },
      ],
      layoutOptions: { columns: 1, columnWidth: 230, rowHeight: 88, dx: 8 },
    })
    stencilEl.appendChild(stencil.container as HTMLElement)

    const unbindInteractions = bindAgentFlowInteractions(graph)

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
        [
          createAgentStencilCard(graph, must('llm')),
          createAgentStencilCard(graph, must('code')),
          createAgentStencilCard(graph, must('branch')),
          createAgentStencilCard(graph, must('loop')),
        ],
        'biz',
      )
      stencil.load(
        [
          createAgentStencilCard(graph, must('kb')),
          createAgentStencilCard(graph, must('mcp')),
          createAgentStencilCard(graph, must('db')),
        ],
        'data',
      )

      // const start = graph.addNode(
      //   createFlowCard(graph, 'start', { title: '开始', badge: '触发器' }).position(60, 60),
      // )
      // const llm = graph.addNode(
      //   createAgentCard(graph, must('llm')).position(220, 220),
      // )
      // const end = graph.addNode(
      //   createFlowCard(graph, 'end', { title: '结束', badge: '输出器' }).position(360, 380),
      // )

      // graph.addEdge({
      //   shape: 'agent-edge',
      //   source: { cell: start.id, port: 'bottom' },
      //   target: { cell: llm.id, port: 'top' },
      // })
      // graph.addEdge({
      //   shape: 'agent-edge',
      //   source: { cell: llm.id, port: 'bottom' },
      //   target: { cell: end.id, port: 'top' },
      // })
    }

    run().catch((err) => {
      console.error(err)
    })

    return () => {
      cancelled = true
      graph.off('node:added', onNodeAdded)
      unbindInteractions()
      stencil.dispose()
      graph.dispose()
    }
  }, [])

  return <AgentFlowLayout stencilRef={stencilRef} graphRef={graphRef} />
}
