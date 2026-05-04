import { Graph } from '@antv/x6'
import { useEffect, useRef } from 'react'

/**
 * 最小可运行示例：挂载 Graph、添加节点与边。
 * 后续教程可在此组件旁新增章节组件或抽离 hooks。
 */
export function DemoGraph() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const graph = new Graph({
      container: el,
      // 随容器尺寸变化重算宽高（需父级有明确高度，见 App.css 中 .demo-graph-canvas）
      autoResize: true,
      background: { color: '#f5f5f5' },
      // true 为默认点阵；也可传入 { type: 'dot', args: {...} } 等细调
      grid: true,
      // 拖动画布空白处平移视口；与节点 translating 是两套能力
      panning: false,
      translating: {
        // 节点拖拽限制在画布可视区域内（内部等价 getGraphArea()）
        restrict: true,
      },
      mousewheel: {
        enabled: true,
        // 须按住 Ctrl（Win/Linux）或 ⌘（mac）再滚轮才缩放，避免误触
        modifiers: ['ctrl', 'meta'],
      },
    })

    const source = graph.addNode({
      x: 80,
      y: 80,
      width: 100,
      height: 48,
      label: '节点 A',
    })

    const target = graph.addNode({
      x: 280,
      y: 200,
      width: 100,
      height: 48,
      label: '节点 B',
    })

    graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#5F95FF',
          strokeWidth: 2,
          targetMarker: {
            name: 'classic',
            size: 8,
          },
        },
      },
    })

    return () => {
      // 卸载时移除监听与 DOM，避免 StrictMode 双调用或路由切换泄漏
      graph.dispose()
    }
  }, [])

  return <div ref={wrapRef} className="demo-graph-canvas" />
}
