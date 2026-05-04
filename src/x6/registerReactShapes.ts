/**
 * 注册自定义 React 节点（仅外观与 data 同步，不含连接桩 / 磁吸连线）。
 */
import '@antv/x6-react-shape'
import { register } from '@antv/x6-react-shape'
import { PipelineFunctionNode } from '../components/react-nodes/PipelineFunctionNode'
import { PipelineInputNode } from '../components/react-nodes/PipelineInputNode'
import { PipelineOutputNode } from '../components/react-nodes/PipelineOutputNode'

let registered = false

export function ensureReactShapesRegistered(): void {
  if (registered) return
  registered = true

  register({
    shape: 'pipeline-input',
    component: PipelineInputNode,
    effect: ['data'],
    width: 220,
    height: 136,
    attrs: {
      body: {
        stroke: '#34d399',
        strokeWidth: 1.5,
        rx: 8,
        ry: 8,
        fill: '#ffffff',
      },
    },
  })

  register({
    shape: 'pipeline-function',
    component: PipelineFunctionNode,
    effect: ['data'],
    width: 280,
    height: 172,
    attrs: {
      body: {
        stroke: '#3b82f6',
        strokeWidth: 1.5,
        rx: 8,
        ry: 8,
        fill: '#ffffff',
      },
    },
  })

  register({
    shape: 'pipeline-output',
    component: PipelineOutputNode,
    effect: ['data'],
    width: 228,
    height: 220,
    attrs: {
      body: {
        stroke: '#f59e0b',
        strokeWidth: 1.5,
        rx: 8,
        ry: 8,
        fill: '#ffffff',
      },
    },
  })
}
