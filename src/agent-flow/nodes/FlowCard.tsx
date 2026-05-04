/**
 * 阶段 4 — 开始 / 结束节点共用组件，用 node.shape 区分样式与文案。
 */
import type { Node } from '@antv/x6'
import type { FlowData } from '../types'
import styles from './FlowCard.module.css'

type Props = { node: Node }

export function FlowCard({ node }: Props) {
  const data = node.getData() as FlowData
  const shape = node.shape
  const type = shape === 'agent-end-card' ? 'end' : 'start'
  const kind = type === 'end' ? styles.kindEnd : styles.kindStart

  return (
    <div className={`${styles.card} ${kind}`}>
      <div className={styles.header}>
        <div className={styles.icon}>{type === 'end' ? 'E' : 'S'}</div>
        <div className={styles.title}>{data.title}</div>
        {data.badge ? <div className={styles.badge}>{data.badge}</div> : null}
      </div>
      {type === 'start' ? (
        <div className={styles.body}>
          <span className={styles.section}>Agent 开始节点</span>
        </div>
      ) : (
        <div className={styles.footer}>
          <span className={styles.section}>Agent 结束节点</span>
        </div>
      )}
    </div>
  )
}
