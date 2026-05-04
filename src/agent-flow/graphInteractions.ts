/**
 * 阶段 5 — 交互：端口显隐、边悬停工具、连线前后更新端口颜色
 * 这些逻辑全部挂在主 Graph 实例的事件上，与 UI 框架无关。
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

function setPortDot(node: Node, portId: string, visible: boolean, color?: string) {
  setPortVisible(node, portId, visible)
  if (color) setPortColor(node, portId, color)
}

function withNodePort(
  graph: Graph,
  cellId?: string | null,
  portId?: string | null,
  fn?: (node: Node, portId: string) => void,
) {
  if (!cellId || !portId || !fn) return
  const cell = graph.getCellById(cellId)
  if (cell && cell.isNode()) fn(cell as Node, portId)
}

function showNodePorts(graph: Graph, node: Node, show: boolean) {
  const ps = node.getPorts()
  for (let i = 0; i < ps.length; i += 1) {
    const id = ps[i].id as string
    if (show) {
      setPortVisible(node, id, true)
    } else {
      const connected = isPortConnected(graph, node, id)
      setPortVisible(node, id, connected)
      setPortColor(node, id, connected ? COLOR_PORT_BLUE : COLOR_PORT_GRAY)
    }
  }
}

export function bindAgentFlowInteractions(graph: Graph): () => void {
  const onNodeEnter = ({ node }: { node: Node }) => {
    showNodePorts(graph, node, true)
  }
  const onNodeLeave = ({ node }: { node: Node }) => {
    showNodePorts(graph, node, false)
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
    setPortDot(currentCell, currentPort, true, COLOR_PORT_BLUE)
  }
  const onEdgeAdded = ({ edge }: { edge: Edge }) => {
    withNodePort(graph, edge.getSourceCellId(), edge.getSourcePortId(), (node, port) =>
      setPortDot(node, port, true, COLOR_PORT_BLUE),
    )
    withNodePort(graph, edge.getTargetCellId(), edge.getTargetPortId(), (node, port) =>
      setPortDot(node, port, true, COLOR_PORT_BLUE),
    )
  }
  const onEdgeRemoved = ({ edge }: { edge: Edge }) => {
    withNodePort(graph, edge.getSourceCellId(), edge.getSourcePortId(), (node, port) => {
      const stillConnected = isPortConnected(graph, node, port)
      if (!stillConnected) setPortDot(node, port, false, COLOR_PORT_GRAY)
    })
    withNodePort(graph, edge.getTargetCellId(), edge.getTargetPortId(), (node, port) => {
      const stillConnected = isPortConnected(graph, node, port)
      if (!stillConnected) setPortDot(node, port, false, COLOR_PORT_GRAY)
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
