/**
 * 阶段 4 — 开始 / 结束节点共用组件，用 node.shape 区分样式与文案。
 */
import type { Node } from '@antv/x6'
import type { FlowData } from '../types'

type Props = { node: Node }

export function FlowCard({ node }: Props) {
  const data = node.getData() as FlowData
  const shape = node.shape
  const type = shape === 'agent-end-card' ? 'end' : 'start'

  return (
    <div className={`flow-card ${type}`}>
      <div className="header">
        <div className="icon">{type === 'end' ? 'E' : 'S'}</div>
        <div className="title">{data.title}</div>
        {data.badge ? <div className="badge">{data.badge}</div> : null}
      </div>
      {type === 'start' ? (
        <div className="body">
          <span className="section">Agent 开始节点</span>
        </div>
      ) : (
        <div className="footer">
          <span className="section">Agent 结束节点</span>
        </div>
      )}
    </div>
  )
}
