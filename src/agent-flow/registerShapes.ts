/**
 * 阶段 3 — 注册自定义「边」与「节点」
 * 可按课次增量注册；`ensureAgentFlowShapesRegistered` 仍会一次性注册全部。
 */
import '@antv/x6-react-shape'
import { Graph } from '@antv/x6'
import { register } from '@antv/x6-react-shape'
import { CARD_HEIGHT, CARD_WIDTH, COLOR_PORT_BLUE } from './constants'
import { AgentReactCard } from './nodes/AgentReactCard'
import { FlowCard } from './nodes/FlowCard'
import { fourWayPorts } from './ports'

const reg = {
  edge: false,
  agentReact: false,
  flowCards: false,
  stencilCard: false,
}

export function registerAgentEdgeShape(): void {
  if (reg.edge) return
  reg.edge = true
  Graph.registerEdge(
    'agent-edge',
    {
      inherit: 'edge',
      attrs: {
        line: { stroke: COLOR_PORT_BLUE, strokeWidth: 2, targetMarker: 'block' },
      },
    },
    true,
  )
}

export function registerAgentReactCardShape(): void {
  if (reg.agentReact) return
  reg.agentReact = true
  register({
    shape: 'agent-react-card',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    effect: ['data'],
    component: AgentReactCard,
  })
}

export function registerFlowCardShapes(): void {
  if (reg.flowCards) return
  reg.flowCards = true
  const registerFlowShape = (shape: string) => {
    register({
      shape,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      effect: ['data'],
      component: FlowCard,
    })
  }
  registerFlowShape('agent-start-card')
  registerFlowShape('agent-end-card')
}

export function registerStencilPreviewNode(): void {
  if (reg.stencilCard) return
  reg.stencilCard = true
  Graph.registerNode(
    'agent-stencil-card',
    {
      inherit: 'rect',
      width: 220,
      height: 66,
      markup: [
        { tagName: 'rect', selector: 'body' },
        { tagName: 'rect', selector: 'iconRect' },
        { tagName: 'text', selector: 'iconLabel' },
        { tagName: 'text', selector: 'title' },
        { tagName: 'text', selector: 'desc' },
      ],
      attrs: {
        body: { stroke: '#5F95FF', strokeWidth: 1, fill: '#fff', rx: 8, ry: 8 },
        iconRect: {
          width: 32,
          height: 32,
          rx: 8,
          ry: 8,
          refX: 12,
          refY: 20,
          fill: '#F0F5FF',
        },
        iconLabel: {
          refX: 28,
          refY: 36,
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          fontSize: 12,
          fontWeight: 600,
          fill: '#1D39C4',
        },
        title: {
          refX: 60,
          refY: 26,
          textAnchor: 'start',
          textVerticalAnchor: 'middle',
          fontSize: 14,
          fontWeight: 600,
          fill: '#141414',
          textWrap: { width: 170, height: 20, ellipsis: '…' },
        },
        desc: {
          refX: 60,
          refY: 46,
          textAnchor: 'start',
          textVerticalAnchor: 'middle',
          fontSize: 12,
          fill: 'rgba(0,0,0,0.65)',
          textWrap: { width: 170, height: 32, ellipsis: '…' },
        },
      },
      ports: fourWayPorts,
    },
    true,
  )
}

/** 注册教程与完整应用所需的全部形状（幂等）。 */
export function ensureAgentFlowShapesRegistered(): void {
  registerAgentEdgeShape()
  registerAgentReactCardShape()
  registerFlowCardShapes()
  registerStencilPreviewNode()
}
