/**
 * 阶段 6 — 工厂函数：用同一套 data / ports 创建「画布节点」
 * 模具内预览节点用 agent-stencil-card；拖入画布后由 node:added 换成 agent-react-card。
 */
import type { Graph, Node } from '@antv/x6'
import { CARD_HEIGHT, CARD_WIDTH } from './constants'
import { fourWayPorts } from './ports'
import type { AgentCardConfig, FlowData } from './types'

const themeMap = {
  blue: { rectFill: '#F0F5FF', textFill: '#1D39C4' },
  green: { rectFill: '#E6FFFB', textFill: '#08979C' },
  orange: { rectFill: '#FFF7E6', textFill: '#FA8C16' },
  red: { rectFill: '#FFF1F0', textFill: '#CF1322' },
} as const

export function createAgentCard(graph: Graph, cfg: AgentCardConfig): Node {
  return graph.createNode({
    shape: 'agent-react-card',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    data: cfg,
    ports: fourWayPorts,
  })
}

export function createFlowCard(graph: Graph, kind: 'start' | 'end', data: FlowData): Node {
  return graph.createNode({
    shape: kind === 'start' ? 'agent-start-card' : 'agent-end-card',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    data,
    ports: fourWayPorts,
  })
}

export function createAgentStencilCard(graph: Graph, cfg: AgentCardConfig): Node {
  const theme = cfg.theme ?? 'blue'
  const colors = themeMap[theme]
  return graph.createNode({
    shape: 'agent-stencil-card',
    attrs: {
      iconRect: { fill: colors.rectFill },
      iconLabel: { text: cfg.iconText, fill: colors.textFill },
      title: { text: cfg.title },
      desc: { text: cfg.desc },
    },
    data: { type: cfg.key },
    ports: fourWayPorts,
  })
}
