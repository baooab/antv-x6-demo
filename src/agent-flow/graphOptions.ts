/**
 * 主画布连线与磁吸高亮配置，供完整应用与各教程课共用。
 */
import type { Edge, Graph } from '@antv/x6'

/** 滚轮缩放：须按住 Ctrl（Windows）或 ⌘ Command（macOS） */
export const agentFlowMousewheel = {
  enabled: true,
  minScale: 0.5,
  maxScale: 3,
  modifiers: ['ctrl', 'meta'] as ('ctrl' | 'meta')[],
}

/**
 * 主画布视口：禁止空白处拖拽平移、滚轮需修饰键才缩放、节点移不出画布区域。
 * X6 默认 panning.enabled 为 true，不关闭时空白区域可左键拖动画布。
 */
export const agentFlowViewport = {
  panning: false,
  translating: { restrict: true },
  mousewheel: agentFlowMousewheel,
}

/** 左侧 Stencil 各分组内的小图：关闭空白处拖移，避免误拖整块模具列表。 */
export const agentStencilGraphOptions = {
  panning: false as const,
}

/**
 * Stencil 顶部检索：`search` 为 true 时仅打开输入框；传入字段映射则按路径子串匹配（不区分大小写）。
 * 与 `createAgentStencilCard` / `agent-stencil-card` 的 attrs、data 一致。
 */
export const agentStencilSearch = {
  'agent-stencil-card': [
    'attrs/title/text',
    'attrs/desc/text',
    'attrs/iconLabel/text',
    'data/type',
  ],
}

/** 与 `agentStencilSearch` 搭配传入 `new Stencil({ ... })` */
export const agentStencilSearchUi = {
  search: agentStencilSearch,
  placeholder: '搜索节点…',
  notFoundText: '无匹配项',
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
