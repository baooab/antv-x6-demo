import type { Graph, Node } from '@antv/x6'
import { PIPELINE_FUNCTION_LAYOUT } from '../../x6/pipelineLayout'
import type { PipelineFunctionData } from './types'
import styles from './pipeline-nodes.module.css'
import { usePipelineNodeAutoSize } from './usePipelineNodeAutoSize'

export function PipelineFunctionNode({
  node,
}: {
  node: Node
  graph: Graph
}) {
  const { ref, bodyScroll } = usePipelineNodeAutoSize(node, {
    minWidth: PIPELINE_FUNCTION_LAYOUT.minWidth,
    minHeight: PIPELINE_FUNCTION_LAYOUT.minHeight,
    maxHeight: PIPELINE_FUNCTION_LAYOUT.maxHeight,
  })

  const data = (node.getData() as PipelineFunctionData | undefined) ?? {}
  const title = data.title ?? '函数'
  const description =
    data.description ?? '接收输入参数，执行数据处理流程，并将结果交给输出节点。'
  const steps =
    data.steps?.length ? data.steps : ['校验输入', '执行核心逻辑', '组装下游所需结构']

  return (
    <div
      ref={ref}
      className={
        `${styles.root} ${styles.variantFunction}` +
        (bodyScroll ? ` ${styles.bodyScroll}` : '')
      }
    >
      <div className={styles.hd} data-pipeline-part="hd">
        <span className={styles.badge}>FN</span>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.bd} data-pipeline-part="bd">
        <p className={styles.muted} style={{ margin: 0 }}>
          {description}
        </p>
        <ol className={styles.steps}>
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}
