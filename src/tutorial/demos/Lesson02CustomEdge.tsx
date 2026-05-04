import { Graph } from '@antv/x6'
import { useEffect, useRef } from 'react'
import { fourWayPorts } from '../../agent-flow/ports'
import { registerAgentEdgeShape } from '../../agent-flow/registerShapes'
import {
  agentFlowHighlighting,
  agentFlowMousewheel,
  createAgentFlowConnecting,
} from '../../agent-flow/graphOptions'

/** 教程 02：自定义边 + 两枚带桩 rect，可连线 */
export function Lesson02CustomEdge() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    registerAgentEdgeShape()

    const graph: Graph = new Graph({
      container: el,
      autoResize: true,
      grid: true,
      mousewheel: agentFlowMousewheel,
      connecting: createAgentFlowConnecting(() => graph),
      highlighting: agentFlowHighlighting,
    })

    graph.addNode({
      shape: 'rect',
      x: 80,
      y: 120,
      width: 112,
      height: 48,
      label: '节点 A',
      ports: fourWayPorts,
    })
    graph.addNode({
      shape: 'rect',
      x: 360,
      y: 120,
      width: 112,
      height: 48,
      label: '节点 B',
      ports: fourWayPorts,
    })

    return () => graph.dispose()
  }, [])

  return <div ref={ref} className="tutorial-single-canvas" />
}
