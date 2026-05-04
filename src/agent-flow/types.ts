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
  /** 与 inputPlaceholder 配套：输入内容写回 `node.data`，便于监听 model 与持久化 */
  inputDraft?: string
  /** 可选：由同伴节点 data 变更时写入的一行提示（如教程第 09 课交叉监听演示） */
  peerEcho?: string
}

export type FlowData = {
  title: string
  badge?: string
}

export type AgentConfigs = Record<string, AgentCardConfig>
