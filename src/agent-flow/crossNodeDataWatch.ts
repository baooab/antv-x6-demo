/**
 * 跨节点 data 感知：任意节点 `node.setData` 触发 `cell:change:data` 后，
 * 可按策略向「同伴」节点写入摘要（如 UI 上的 peerEcho），与节点个数、是否仅两枚无关。
 */
import type { Cell, Graph, Node } from '@antv/x6'

export type CrossNodeDataWatchOptions = {
  /**
   * 合并进同伴 `node.data` 的字段名，须与业务类型（如 AgentCardConfig）一致。
   * @default 'peerEcho'
   */
  echoField?: string
  /**
   * 当 `source` 的 data 变化时，需要收到通知的节点。默认：图中除 source 外的**所有**节点。
   */
  getPeers?: (source: Node, graph: Graph) => Node[]
  /**
   * 根据变更源生成写入 `echoField` 的完整文案（可含业务 key、草稿摘要等）。
   */
  formatEcho: (args: {
    source: Node
    sourceData: Record<string, unknown>
    graph: Graph
  }) => string
  /**
   * `formatEcho` 结果超过该长度时截断（避免图中节点过多时 toJSON 过大）
   * @default 200
   */
  maxEchoLength?: number
}

export type CrossNodeDataWatchController = {
  dispose: () => void
  /** 正在批量 `setData` 回写同伴时为 true，可用于日志去重或 UI */
  isPeerBatch: () => boolean
}

/**
 * 监听 `cell:change:data`：在「非同伴回写」造成的变更上，向 `getPeers` 返回的节点合并 `echoField`。
 * 内部 `batch` 防止回写同伴时再次进入逻辑形成环路。
 */
export function bindCrossNodeDataWatch(
  graph: Graph,
  options: CrossNodeDataWatchOptions,
): CrossNodeDataWatchController {
  const echoField = options.echoField ?? 'peerEcho'
  const maxLen = options.maxEchoLength ?? 200
  let batch = false

  const defaultGetPeers = (source: Node, g: Graph) =>
    g.getNodes().filter((n) => n.id !== source.id)

  const onCellChangeData = ({ cell }: { cell: Cell }) => {
    if (!cell.isNode()) return
    if (batch) return

    const source = cell as Node
    const raw = source.getData()
    const sourceData =
      raw != null && typeof raw === 'object'
        ? (raw as Record<string, unknown>)
        : ({} as Record<string, unknown>)

    const peers = (options.getPeers ?? defaultGetPeers)(source, graph)
    if (peers.length === 0) return

    let echoBody = options.formatEcho({ source, sourceData, graph })
    if (echoBody.length > maxLen) {
      echoBody = `${echoBody.slice(0, maxLen)}…`
    }

    batch = true
    try {
      for (const peer of peers) {
        if (!peer.isNode() || peer.id === source.id) continue
        const prevRaw = peer.getData()
        const prev =
          prevRaw != null && typeof prevRaw === 'object'
            ? { ...(prevRaw as Record<string, unknown>) }
            : {}
        prev[echoField] = echoBody
        peer.setData(prev as object)
      }
    } finally {
      batch = false
    }
  }

  graph.on('cell:change:data', onCellChangeData)
  return {
    dispose: () => graph.off('cell:change:data', onCellChangeData),
    isPeerBatch: () => batch,
  }
}
