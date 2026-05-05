import { Graph, Snapline, Stencil } from '@antv/x6'
import { useEffect, useRef } from 'react'
import { bindAgentFlowInteractions } from '../../agent-flow/graphInteractions'
import { createAgentStencilCard } from '../../agent-flow/factory'
import {
  agentFlowHighlighting,
  agentFlowViewport,
  agentStencilGraphOptions,
  agentStencilSearchUi,
  createAgentFlowConnecting,
} from '../../agent-flow/graphOptions'
import { registerAgentEdgeShape, registerStencilPreviewNode } from '../../agent-flow/registerShapes'
import type { AgentCardConfig } from '../../agent-flow/types'
import { AgentFlowLayout } from '../../agent-flow/AgentFlowLayout'

const kb: AgentCardConfig = {
  key: 'kb',
  iconText: 'KB',
  title: '知识库',
  desc: '检索向量库',
  theme: 'blue',
}
const db: AgentCardConfig = {
  key: 'db',
  iconText: 'DB',
  title: '数据库',
  desc: '查询业务库',
  theme: 'orange',
}

/** 教程 06：Stencil 模具；落地节点仍为 agent-stencil-card（未替换） */
export function Lesson06Stencil() {
  const stencilRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const graphEl = graphRef.current
    const stencilEl = stencilRef.current
    if (!graphEl || !stencilEl) return

    registerAgentEdgeShape()
    registerStencilPreviewNode()

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
      title: '模具（预览节点）',
      target: graph,
      stencilGraphWidth: 240,
      stencilGraphHeight: 400,
      stencilGraphOptions: agentStencilGraphOptions,
      ...agentStencilSearchUi,
      collapsable: true,
      groups: [
        { title: '数据类', name: 'data', graphHeight: 220, layoutOptions: { rowHeight: 88 } },
      ],
      layoutOptions: { columns: 1, columnWidth: 230, rowHeight: 88, dx: 8 },
    })
    stencilEl.appendChild(stencil.container as HTMLElement)

    stencil.load(
      [createAgentStencilCard(graph, kb), createAgentStencilCard(graph, db)],
      'data',
    )

    return () => {
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
