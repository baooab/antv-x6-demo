/**
 * 教程 09：监听 Graph / Cell 模型事件；侧栏实时预览 graph.toJSON() 与事件日志。
 *
 * X6 v3 使用 `cell:change:<key>` / `edge:change:<key>`（如 position、data），
 * 不存在 `cell:changed` 这一总线事件名。
 */
import { Graph, type Cell } from '@antv/x6'
import { useCallback, useEffect, useRef, useState } from 'react'
import { bindCrossNodeDataWatch } from '../../agent-flow/crossNodeDataWatch'
import { createAgentCard } from '../../agent-flow/factory'
import { bindAgentFlowInteractions } from '../../agent-flow/graphInteractions'
import {
  agentFlowHighlighting,
  agentFlowViewport,
  createAgentFlowConnecting,
} from '../../agent-flow/graphOptions'
import { ensureAgentFlowShapesRegistered } from '../../agent-flow/registerShapes'
import type { AgentCardConfig } from '../../agent-flow/types'
import styles from './Lesson09GraphWatch.module.css'

const MAX_LINES = 150
/** 合并高频 cell:change:position，避免 toJSON 字符串每秒刷新过多次 */
const SNAPSHOT_DEBOUNCE_MS = 120

function truncatePeerText(s: string, max: number) {
  if (s.length <= max) return s
  return `${s.slice(0, max)}…`
}

export function Lesson09GraphWatch() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<string[]>([])
  const [counts, setCounts] = useState({ nodes: 0, edges: 0 })
  const [jsonText, setJsonText] = useState('{}')

  const append = useCallback((msg: string) => {
    const t = new Date().toLocaleTimeString(undefined, { hour12: false })
    setLines((prev) => [...prev.slice(-(MAX_LINES - 1)), `[${t}] ${msg}`])
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    ensureAgentFlowShapesRegistered()

    const graph: Graph = new Graph({
      container: canvas,
      autoResize: true,
      grid: true,
      ...agentFlowViewport,
      connecting: createAgentFlowConnecting(() => graph),
      highlighting: agentFlowHighlighting,
    })

    const unbindUi = bindAgentFlowInteractions(graph)

    graph.addNode(
      createAgentCard(graph, {
        key: 'watch-a',
        iconText: 'A',
        title: '节点 A',
        desc: '',
        theme: 'green',
        inputPlaceholder: '输入会触发 cell:change:data',
      }).position(40, 72),
    )
    graph.addNode(
      createAgentCard(graph, {
        key: 'watch-b',
        iconText: 'B',
        title: '节点 B',
        desc: '',
        theme: 'orange',
        inputPlaceholder: '同上，写入 node.data',
      }).position(300, 72),
    )
    graph.addNode(
      createAgentCard(graph, {
        key: 'watch-c',
        iconText: 'C',
        title: '节点 C',
        desc: '任意节点改 inputDraft，其余节点都会收到 peerEcho',
        theme: 'blue',
        inputPlaceholder: '三方演示：非一对一写死',
      }).position(170, 220),
    )

    /** 任意节点 data 变更 → 向图中其余节点合并 peerEcho；同伴回写由模块内 batch 短路 */
    const crossWatch = bindCrossNodeDataWatch(graph, {
      formatEcho: ({ source, sourceData }) => {
        const d = sourceData as AgentCardConfig
        const tag = d.key ?? source.id.slice(0, 8)
        const draft = truncatePeerText(d.inputDraft ?? '', 40)
        return `← ${tag} · ${draft}`
      },
    })

    const refreshCounts = () => {
      setCounts({
        nodes: graph.getNodes().length,
        edges: graph.getEdges().length,
      })
    }

    let snapshotTimer: ReturnType<typeof setTimeout> | null = null
    const pushSnapshot = () => {
      try {
        setJsonText(JSON.stringify(graph.toJSON(), null, 2))
      } catch (e) {
        setJsonText(`// toJSON 异常\n${String(e)}`)
      }
    }

    const scheduleSnapshot = () => {
      if (snapshotTimer != null) clearTimeout(snapshotTimer)
      snapshotTimer = setTimeout(() => {
        snapshotTimer = null
        pushSnapshot()
      }, SNAPSHOT_DEBOUNCE_MS)
    }

    /** position 日志节流（快照仍走 scheduleSnapshot） */
    let lastPosLogAt = 0
    const POSITION_LOG_MS = 180

    const onCellAdded = ({ cell }: { cell: Cell }) => {
      const kind = cell.isNode() ? 'node' : 'edge'
      append(`cell:added ${kind} id=${cell.id}`)
      refreshCounts()
      scheduleSnapshot()
    }

    const onCellRemoved = ({ cell }: { cell: Cell }) => {
      append(`cell:removed id=${cell.id}`)
      refreshCounts()
      scheduleSnapshot()
    }

    const onCellChangePosition = (args: { cell: Cell }) => {
      const { cell } = args
      scheduleSnapshot()
      const now = Date.now()
      if (now - lastPosLogAt < POSITION_LOG_MS) return
      lastPosLogAt = now
      const p = cell.isNode() ? cell.getPosition() : null
      append(
        `cell:change:position id=${cell.id}${p ? ` → (${Math.round(p.x)}, ${Math.round(p.y)})` : ''}`,
      )
    }

    const onCellChangeData = (args: { cell: Cell }) => {
      const { cell } = args
      scheduleSnapshot()
      if (crossWatch.isPeerBatch()) {
        append(`cell:change:data（同伴回写）id=${cell.id}`)
        return
      }
      try {
        const raw = cell.getData()
        const s = JSON.stringify(raw)
        append(`cell:change:data id=${cell.id} ${s.length > 160 ? `${s.slice(0, 160)}…` : s}`)
      } catch {
        append(`cell:change:data id=${cell.id}`)
      }
    }

    const onCellChangeParent = (args: { cell: Cell }) => {
      scheduleSnapshot()
      append(`cell:change:parent id=${args.cell.id}`)
    }

    const onCellChangeZIndex = (args: { cell: Cell }) => {
      scheduleSnapshot()
      append(`cell:change:zIndex id=${args.cell.id}`)
    }

    /** 仅刷新 toJSON（attrs 变更极频繁，不打文字日志） */
    const onCellChangeAttrs = () => {
      scheduleSnapshot()
    }

    const onEdgeChangeSource = ({ edge }: { edge: Cell }) => {
      scheduleSnapshot()
      append(`edge:change:source id=${edge.id}`)
    }

    const onEdgeChangeTarget = ({ edge }: { edge: Cell }) => {
      scheduleSnapshot()
      append(`edge:change:target id=${edge.id}`)
    }

    graph.on('cell:added', onCellAdded)
    graph.on('cell:removed', onCellRemoved)

    graph.on('cell:change:position', onCellChangePosition)
    graph.on('cell:change:data', onCellChangeData)
    graph.on('cell:change:parent', onCellChangeParent)
    graph.on('cell:change:zIndex', onCellChangeZIndex)
    graph.on('cell:change:attrs', onCellChangeAttrs)

    graph.on('edge:change:source', onEdgeChangeSource)
    graph.on('edge:change:target', onEdgeChangeTarget)

    refreshCounts()
    pushSnapshot()

    append(
      '已挂载：cell:change:* / edge:change:*；bindCrossNodeDataWatch 将任意节点 data 摘要广播到其余节点（peerEcho）。toJSON 见上方',
    )

    return () => {
      if (snapshotTimer != null) clearTimeout(snapshotTimer)
      crossWatch.dispose()
      graph.off('cell:added', onCellAdded)
      graph.off('cell:removed', onCellRemoved)
      graph.off('cell:change:position', onCellChangePosition)
      graph.off('cell:change:data', onCellChangeData)
      graph.off('cell:change:parent', onCellChangeParent)
      graph.off('cell:change:zIndex', onCellChangeZIndex)
      graph.off('cell:change:attrs', onCellChangeAttrs)
      graph.off('edge:change:source', onEdgeChangeSource)
      graph.off('edge:change:target', onEdgeChangeTarget)
      unbindUi()
      graph.dispose()
    }
  }, [append])

  return (
    <div className={`tutorial-single-canvas ${styles.wrap}`}>
      <div ref={canvasRef} className={styles.canvas} />
      <aside className={styles.side} aria-label="Graph 调试侧栏">
        <div className={styles.sideHead}>模型快照与事件</div>
        <div className={styles.stats}>
          节点 {counts.nodes} · 边 {counts.edges}
        </div>
        <div className={styles.sideBody}>
          <section className={styles.jsonSection} aria-label="graph.toJSON 预览">
            <div className={styles.sectionTitle}>graph.toJSON()</div>
            <pre className={styles.jsonPre}>{jsonText}</pre>
          </section>
          <section className={styles.logSection} aria-label="cell 事件日志">
            <div className={styles.sectionTitle}>模型事件</div>
            <pre className={styles.log}>{lines.join('\n')}</pre>
          </section>
        </div>
        <p className={styles.hint}>
          使用 <code>src/agent-flow/crossNodeDataWatch.ts</code> 的 <code>bindCrossNodeDataWatch</code>：任意节点
          <code>inputDraft</code> 变更时，向图中<strong>除自己外</strong>所有节点合并
          <code>peerEcho</code>；可用 <code>getPeers</code> 自定义广播范围。模块内 <code>batch</code> 避免同伴
          <code>setData</code> 再次参与广播。toJSON 约 {SNAPSHOT_DEBOUNCE_MS}ms 防抖。
        </p>
      </aside>
    </div>
  )
}
