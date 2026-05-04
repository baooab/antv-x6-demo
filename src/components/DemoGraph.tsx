import { Graph } from '@antv/x6'
import { useEffect, useRef } from 'react'
import { ensureReactShapesRegistered } from '../x6/registerReactShapes'

/**
 * 演示：输入 / 函数 / 输出三类 React 节点与静态连线（无连接桩、不开启用户拉线）。
 */
export function DemoGraph() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    ensureReactShapesRegistered()

    const graph = new Graph({
      container: el,
      autoResize: true,
      background: { color: '#f5f5f5' },
      grid: true,
      panning: false,
      translating: {
        restrict: true,
      },
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
    })

    const input = graph.addNode({
      shape: 'pipeline-input',
      x: 36,
      y: 108,
      data: {
        title: '查询输入',
        params: [
          { key: 'q', value: '全文检索' },
          { key: 'topK', value: '20' },
        ],
      },
    })

    const fn = graph.addNode({
      shape: 'pipeline-function',
      x: 300,
      y: 72,
      data: {
        title: '检索流水线',
        description: '消费上游参数，执行召回、打分与截断，再交给输出侧消费。',
        steps: ['解析参数 q / topK', '向量召回与粗排', '相关性精排并截取 topK'],
      },
    })

    const output = graph.addNode({
      shape: 'pipeline-output',
      x: 612,
      y: 68,
      data: {
        title: '结果落地',
        params: [
          {
            key: 'documents',
            process: '丢弃 score 低于 0.5 的条目；保留标题与摘要字段。',
          },
          {
            key: 'metrics',
            process: '聚合为表格：请求量、平均耗时、错误率。',
          },
        ],
      },
    })

    graph.addEdge({
      source: input,
      target: fn,
      attrs: {
        line: {
          stroke: '#10b981',
          strokeWidth: 2,
          targetMarker: { name: 'classic', size: 8 },
        },
      },
    })

    graph.addEdge({
      source: fn,
      target: output,
      attrs: {
        line: {
          stroke: '#3b82f6',
          strokeWidth: 2,
          targetMarker: { name: 'classic', size: 8 },
        },
      },
    })

    return () => {
      graph.dispose()
    }
  }, [])

  return <div ref={wrapRef} className="demo-graph-canvas" />
}
