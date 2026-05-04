/**
 * 阶段 5 — 交互：端口显隐、边悬停工具、连线前后更新端口颜色
 * 端口仅在悬停节点时显示；已连线端口用蓝色标记，未连线为灰色（悬停时可见）。
 */
import type { Edge, Graph, Node } from '@antv/x6'
import { COLOR_PORT_BLUE, COLOR_PORT_GRAY } from './constants'

function isPortConnected(graph: Graph, node: Node, portId: string): boolean {
  const edges = graph.getConnectedEdges(node)
  return edges.some(
    (e) =>
      (e.getSourceCellId() === node.id && e.getSourcePortId() === portId) ||
      (e.getTargetCellId() === node.id && e.getTargetPortId() === portId),
  )
}

function setPortVisible(node: Node, portId: string, visible: boolean) {
  node.setPortProp(portId, 'attrs/circle/style/visibility', visible ? 'visible' : 'hidden')
}

function setPortColor(node: Node, portId: string, color: string) {
  node.setPortProp(portId, 'attrs/circle/fill', color)
  node.setPortProp(portId, 'attrs/circle/stroke', color)
}

/** 根据悬停状态显示/隐藏全部端口，并按连线状态着色 */
function applyNodePortHoverState(graph: Graph, node: Node, hover: boolean) {
  const ps = node.getPorts()
  for (let i = 0; i < ps.length; i += 1) {
    const id = ps[i].id as string
    const connected = isPortConnected(graph, node, id)
    setPortVisible(node, id, hover)
    setPortColor(node, id, connected ? COLOR_PORT_BLUE : COLOR_PORT_GRAY)
  }
}

export function bindAgentFlowInteractions(graph: Graph): () => void {
  let hoveredNodeId: string | null = null

  const onNodeEnter = ({ node }: { node: Node }) => {
    hoveredNodeId = node.id
    applyNodePortHoverState(graph, node, true)
  }
  const onNodeLeave = ({ node }: { node: Node }) => {
    hoveredNodeId = null
    applyNodePortHoverState(graph, node, false)
  }
  const onEdgeEnter = ({ edge }: { edge: Edge }) => {
    edge.addTools({ name: 'button-remove', args: { distance: -40 } })
  }
  const onEdgeLeave = ({ edge }: { edge: Edge }) => {
    edge.removeTools()
  }
  const onEdgeConnected = ({
    currentCell,
    currentPort,
  }: {
    currentCell: Node
    currentPort?: string
  }) => {
    if (!currentPort) return
    applyNodePortHoverState(graph, currentCell, currentCell.id === hoveredNodeId)
  }
  const onEdgeAdded = ({ edge }: { edge: Edge }) => {
    const touch = (cellId?: string | null) => {
      if (!cellId) return
      const cell = graph.getCellById(cellId)
      if (!cell?.isNode()) return
      applyNodePortHoverState(graph, cell as Node, cellId === hoveredNodeId)
    }
    touch(edge.getSourceCellId())
    touch(edge.getTargetCellId())
  }
  const onEdgeRemoved = ({ edge }: { edge: Edge }) => {
    const ids = new Set<string>()
    const s = edge.getSourceCellId()
    const t = edge.getTargetCellId()
    if (s) ids.add(s)
    if (t) ids.add(t)
    ids.forEach((id) => {
      const cell = graph.getCellById(id)
      if (!cell?.isNode()) return
      applyNodePortHoverState(graph, cell as Node, id === hoveredNodeId)
    })
  }

  graph.on('node:mouseenter', onNodeEnter)
  graph.on('node:mouseleave', onNodeLeave)
  graph.on('edge:mouseenter', onEdgeEnter)
  graph.on('edge:mouseleave', onEdgeLeave)
  graph.on('edge:connected', onEdgeConnected)
  graph.on('edge:added', onEdgeAdded)
  graph.on('edge:removed', onEdgeRemoved)

  return () => {
    graph.off('node:mouseenter', onNodeEnter)
    graph.off('node:mouseleave', onNodeLeave)
    graph.off('edge:mouseenter', onEdgeEnter)
    graph.off('edge:mouseleave', onEdgeLeave)
    graph.off('edge:connected', onEdgeConnected)
    graph.off('edge:added', onEdgeAdded)
    graph.off('edge:removed', onEdgeRemoved)
  }
}
