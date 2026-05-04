import { Graph } from '@antv/x6'
import { useEffect, useRef } from 'react'
import { createAgentCard } from '../../agent-flow/factory'
import { agentFlowViewport } from '../../agent-flow/graphOptions'
import { registerAgentEdgeShape, registerAgentReactCardShape } from '../../agent-flow/registerShapes'

/** 教程 03：只展示 React 卡片，不开启连线，避免与「认形状」混在一起 */
export function Lesson03ReactNode() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    registerAgentEdgeShape()
    registerAgentReactCardShape()

    const graph = new Graph({
      container: el,
      autoResize: true,
      grid: true,
      ...agentFlowViewport,
    })

    graph.addNode(
      createAgentCard(graph, {
        key: 'demo',
        iconText: 'AI',
        title: '演示节点',
        desc: '本课只关注 React 如何接到 X6 节点上',
        theme: 'blue',
      }).position(140, 120),
    )

    return () => graph.dispose()
  }, [])

  return <div ref={ref} className="tutorial-single-canvas" />
}
