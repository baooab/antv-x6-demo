/**
 * 左 Stencil、右主画布的根布局；样式见同目录 `AgentFlowLayout.module.css`。
 */
import type { RefObject } from 'react'
import styles from './AgentFlowLayout.module.css'

export type AgentFlowLayoutProps = {
  stencilRef: RefObject<HTMLDivElement | null>
  graphRef: RefObject<HTMLDivElement | null>
  /** 根节点附加类名，例如教程中的 `tutorial-demo-inner` */
  className?: string
}

export function AgentFlowLayout({ stencilRef, graphRef, className }: AgentFlowLayoutProps) {
  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-agent-flow-root
    >
      <div ref={stencilRef} className={styles.stencil} />
      <div ref={graphRef} className={styles.canvas} />
    </div>
  )
}
