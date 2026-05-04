import { Graph, Snapline } from '@antv/x6'
import { useEffect, useRef } from 'react'
import { bindAgentFlowInteractions } from '../../agent-flow/graphInteractions'
import { createAgentCard } from '../../agent-flow/factory'
import {
  agentFlowHighlighting,
  agentFlowViewport,
  createAgentFlowConnecting,
} from '../../agent-flow/graphOptions'
import { registerAgentEdgeShape, registerAgentReactCardShape } from '../../agent-flow/registerShapes'

/** 教程 05：在 04 基础上增加 Snapline，拖动节点时可对齐 */
export function Lesson05Snapline() {
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

    graph.use(new Snapline())

    const unbind = bindAgentFlowInteractions(graph)

    graph.addNode(
      createAgentCard(graph, {
        key: 'x',
        iconText: '1',
        title: '对齐参考',
        desc: '拖动我与另一张卡片靠近',
        theme: 'blue',
      }).position(100, 110),
    )
    graph.addNode(
      createAgentCard(graph, {
        key: 'y',
        iconText: '2',
        title: '对齐参考',
        desc: '出现青色对齐线即 Snapline 生效',
        theme: 'blue',
      }).position(380, 110),
    )

    return () => {
      unbind()
      graph.dispose()
    }
  }, [])

  return <div ref={ref} className="tutorial-single-canvas" />
}
