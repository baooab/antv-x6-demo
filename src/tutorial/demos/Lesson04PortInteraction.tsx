import { Graph, type Cell, type Node } from '@antv/x6'
import { useEffect, useRef } from 'react'
import { bindAgentFlowInteractions } from '../../agent-flow/graphInteractions'
import { createAgentCard } from '../../agent-flow/factory'
import {
  agentFlowHighlighting,
  agentFlowViewport,
  createAgentFlowConnecting,
} from '../../agent-flow/graphOptions'
import { registerAgentEdgeShape, registerAgentReactCardShape } from '../../agent-flow/registerShapes'
import type { AgentCardConfig } from '../../agent-flow/types'

const sampleA = {
  key: 'a',
  iconText: 'A',
  title: '上游',
  desc: '悬停显示四向连接桩',
  theme: 'green' as const,
}
const sampleB = {
  key: 'b',
  iconText: 'B',
  title: '下游',
  desc: '从桩拖出边连到另一节点',
  theme: 'orange' as const,
}

/**
 * 本课演示：连线校验用黑名单（默认放行，仅禁止若干起点→终点组合）。
 * 后续节点类型变多时，多为「追加一条禁止规则」，比维护白名单更省事。
 */
function createLesson04Connecting(getGraph: () => Graph) {
  const base = createAgentFlowConnecting(getGraph)
  return {
    ...base,
    validateConnection({
      targetMagnet,
      sourceCell,
      targetCell,
    }: {
      targetMagnet?: Element | null
      sourceCell?: Cell | null
      targetCell?: Cell | null
    }) {
      if (!base.validateConnection({ targetMagnet })) return false
      if (!sourceCell?.isNode() || !targetCell?.isNode()) return false
      const s = (sourceCell as Node).getData() as AgentCardConfig | undefined
      const t = (targetCell as Node).getData() as AgentCardConfig | undefined
      // 黑名单：禁止「下游 → 上游」（本课 sample 对应 key=b → key=a）
      if (s?.key === sampleB.key && t?.key === sampleA.key) return false
      return true
    },
  }
}

/** 教程 04：端口显隐 + 边工具 + 与第三课相同的 React 节点 */
export function Lesson04PortInteraction() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    registerAgentEdgeShape()
    registerAgentReactCardShape()

    const graph: Graph = new Graph({
      container: el,
      autoResize: true,
      grid: true,
      ...agentFlowViewport,
      connecting: createLesson04Connecting(() => graph),
      highlighting: agentFlowHighlighting,
    })

    const unbind = bindAgentFlowInteractions(graph)

    graph.addNode(createAgentCard(graph, sampleA).position(80, 100))
    graph.addNode(createAgentCard(graph, sampleB).position(360, 100))

    return () => {
      unbind()
      graph.dispose()
    }
  }, [])

  return <div ref={ref} className="tutorial-single-canvas" />
}
