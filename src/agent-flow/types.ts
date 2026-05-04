/**
 * 阶段 1 — 数据模型
 * 节点外观与业务元数据都挂在 `node.data` 上，React 组件通过 `node.getData()` 读取。
 */
export type AgentCardConfig = {
  key: string
  iconText: string
  title: string
  desc: string
  theme?: 'blue' | 'green' | 'orange' | 'red'
  inputPlaceholder?: string
}

export type FlowData = {
  title: string
  badge?: string
}

export type AgentConfigs = Record<string, AgentCardConfig>
