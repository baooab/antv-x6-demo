/**
 * 主画布连线与磁吸高亮配置，供完整应用与各教程课共用。
 */
import type { Edge, Graph } from '@antv/x6'

export const agentFlowMousewheel = {
  enabled: true,
  minScale: 0.5,
  maxScale: 3,
}

/**
 * 传入 `() => graph` 而非 `graph` 本身，避免 `const graph = new Graph({ connecting: ... })`
 * 在入参求值阶段读取尚未完成初始化的 `graph`（TDZ）。
 */
export function createAgentFlowConnecting(getGraph: () => Graph) {
  return {
    connector: { name: 'smooth' as const },
    connectionPoint: 'anchor' as const,
    allowBlank: false,
    snap: { radius: 20 },
    allowEdge: false,
    allowLoop: false,
    highlight: true,
    createEdge(): Edge {
      return getGraph().createEdge({ shape: 'agent-edge' })
    },
    validateConnection({ targetMagnet }: { targetMagnet?: Element | null }) {
      return !!targetMagnet
    },
  }
}

export const agentFlowHighlighting = {
  magnetAdsorbed: {
    name: 'stroke' as const,
    args: {
      attrs: {
        fill: '#5F95FF',
        stroke: '#5F95FF',
      },
    },
  },
}
