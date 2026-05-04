import { Graph } from '@antv/x6'
import { useEffect, useRef } from 'react'
import { agentFlowMousewheel } from '../../agent-flow/graphOptions'

/** 教程 01：仅 Graph + 内置 rect */
export function Lesson01MinimalGraph() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const graph = new Graph({
      container: el,
      autoResize: true,
      grid: true,
      mousewheel: agentFlowMousewheel,
    })

    graph.addNode({
      shape: 'rect',
      x: 120,
      y: 100,
      width: 200,
      height: 64,
      attrs: {
        body: { stroke: '#5F95FF', strokeWidth: 1, rx: 8, ry: 8, fill: '#fff' },
        label: { fill: '#141414', fontSize: 15, fontWeight: 600 },
      },
      label: 'Hello X6',
    })

    return () => graph.dispose()
  }, [])

  return <div ref={ref} className="tutorial-single-canvas" />
}
