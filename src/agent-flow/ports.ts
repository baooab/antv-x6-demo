/**
 * 阶段 2 — 连接桩（Port）
 * 四向圆点：默认隐藏，仅悬停节点时显示；已连线端口在悬停时显示为蓝色。magnet: true 允许从此处拖出边。
 */
import { COLOR_PORT_GRAY, PORT_DOT_RADIUS } from './constants'

const basePortAttrs = {
  r: PORT_DOT_RADIUS,
  magnet: true,
  stroke: COLOR_PORT_GRAY,
  strokeWidth: 1,
  fill: COLOR_PORT_GRAY,
  style: { visibility: 'hidden' as const },
}

const createPortGroup = (position: 'top' | 'right' | 'bottom' | 'left') => ({
  position,
  attrs: { circle: { ...basePortAttrs } },
})

export const fourWayPorts = {
  groups: {
    top: createPortGroup('top'),
    right: createPortGroup('right'),
    bottom: createPortGroup('bottom'),
    left: createPortGroup('left'),
  },
  items: [
    { id: 'top', group: 'top' },
    { id: 'right', group: 'right' },
    { id: 'bottom', group: 'bottom' },
    { id: 'left', group: 'left' },
  ],
}
