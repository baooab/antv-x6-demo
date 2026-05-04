import { Graph } from '@antv/x6'
import { useEffect, useRef } from 'react'
import { bindAgentFlowInteractions } from '../../agent-flow/graphInteractions'
import { createAgentCard } from '../../agent-flow/factory'
import {
  agentFlowHighlighting,
  agentFlowViewport,
  createAgentFlowConnecting,
} from '../../agent-flow/graphOptions'
import { registerAgentEdgeShape, registerAgentReactCardShape } from '../../agent-flow/registerShapes'

const sampleA = {
  key: 'a',
  iconText: 'A',
  title: '上游',
  desc: '悬停显示四向连接桩',
  theme: 'green' as const,
}
const sampleB = {
  key: 'b',
  iconText: 'B',
  title: '下游',
  desc: '从桩拖出边连到另一节点',
  theme: 'orange' as const,
}

/** 教程 04：端口显隐 + 边工具 + 与第三课相同的 React 节点 */
export function Lesson04PortInteraction() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    registerAgentEdgeShape()
    registerAgentReactCardShape()

    const graph: Graph = new Graph({
      container: el,
      autoResize: true,
      grid: true,
      ...agentFlowViewport,
      connecting: createAgentFlowConnecting(() => graph),
      highlighting: agentFlowHighlighting,
    })

    const unbind = bindAgentFlowInteractions(graph)

    graph.addNode(createAgentCard(graph, sampleA).position(80, 100))
    graph.addNode(createAgentCard(graph, sampleB).position(360, 100))

    return () => {
      unbind()
      graph.dispose()
    }
  }, [])

  return <div ref={ref} className="tutorial-single-canvas" />
}
