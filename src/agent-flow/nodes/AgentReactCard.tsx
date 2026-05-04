/**
 * 阶段 4 — React 节点：画布上的「智能体卡片」
 * 通过 @antv/x6-react-shape 的 register({ shape, component }) 与图关联。
 */
import type { Node } from '@antv/x6'
import type { MouseEvent } from 'react'
import type { AgentCardConfig } from '../types'
import styles from './AgentReactCard.module.css'

type Props = { node: Node }

const THEME_ROOT: Partial<Record<NonNullable<AgentCardConfig['theme']>, string>> = {
  green: styles.rootGreen,
  orange: styles.rootOrange,
  red: styles.rootRed,
}

export function AgentReactCard({ node }: Props) {
  const raw = node.getData() as AgentCardConfig | null | undefined
  const data: AgentCardConfig = {
    key: raw?.key ?? 'unknown',
    iconText: raw?.iconText ?? '',
    title: raw?.title ?? '',
    desc: raw?.desc ?? '',
    theme: raw?.theme ?? 'blue',
    inputPlaceholder: raw?.inputPlaceholder,
  }
  const theme = data.theme ?? 'blue'
  const rootExtra = THEME_ROOT[theme]

  return (
    <div className={[styles.card, rootExtra].filter(Boolean).join(' ')}>
      <div className={styles.header}>
        <div className={styles.icon}>{data.iconText}</div>
        <div className={styles.title}>{data.title}</div>
        <div className={styles.actions}>
          <span
            className={styles.op}
            title="删除节点"
            onClick={(e: MouseEvent) => {
              e.stopPropagation()
              const cfg = (node.getData() as AgentCardConfig | null) || null
              const k = cfg?.key
              if (k === 'start' || k === 'end') return
              node.remove()
            }}
          >
            ✖️
          </span>
        </div>
      </div>
      {data.inputPlaceholder ? (
        <div className={styles.body}>
          <span className={styles.section}>节点内容</span>
          <input type="text" placeholder={data.inputPlaceholder} />
        </div>
      ) : (
        <div className={styles.desc}>{data.desc}</div>
      )}
    </div>
  )
}
