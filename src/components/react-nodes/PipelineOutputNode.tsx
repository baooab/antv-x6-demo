import type { Graph, Node } from '@antv/x6'
import { Button, Form, Input } from 'antd'
import { useEffect, useMemo } from 'react'
import { PIPELINE_OUTPUT_LAYOUT } from '../../x6/pipelineLayout'
import type { PipelineOutputData } from './types'
import styles from './pipeline-nodes.module.css'
import { usePipelineNodeAutoSize } from './usePipelineNodeAutoSize'

export function PipelineOutputNode({
  node,
}: {
  node: Node
  graph: Graph
}) {
  const [form] = Form.useForm<{
    params: NonNullable<PipelineOutputData['params']>
  }>()
  const { ref, bodyScroll } = usePipelineNodeAutoSize(node, {
    minWidth: PIPELINE_OUTPUT_LAYOUT.minWidth,
    minHeight: PIPELINE_OUTPUT_LAYOUT.minHeight,
    maxHeight: PIPELINE_OUTPUT_LAYOUT.maxHeight,
  })

  const data = (node.getData() as PipelineOutputData | undefined) ?? {}
  const title = data.title ?? '输出'
  const rawParams = data.params
  const params = useMemo(
    () =>
      rawParams?.length
        ? rawParams
        : [
            {
              key: 'result',
              process: '接收函数输出；可在此配置过滤或映射规则。',
            },
          ],
    [rawParams],
  )

  const paramsKey = useMemo(() => JSON.stringify(params), [params])

  useEffect(() => {
    const cur = form.getFieldValue('params') as
      | NonNullable<PipelineOutputData['params']>
      | undefined
    if (cur && JSON.stringify(cur) === paramsKey) return
    form.setFieldsValue({ params })
  }, [form, params, paramsKey])

  return (
    <div
      ref={ref}
      className={
        `${styles.root} ${styles.variantOutput}` +
        (bodyScroll ? ` ${styles.bodyScroll}` : '')
      }
    >
      <div className={styles.hd} data-pipeline-part="hd">
        <span className={styles.badge}>OUT</span>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.bd} data-pipeline-part="bd">
        <span className={styles.muted}>从函数接收结果字段，并声明过滤 / 后处理</span>
        <Form<{
          params: NonNullable<PipelineOutputData['params']>
        }>
          form={form}
          layout="vertical"
          size="small"
          requiredMark={false}
          className={styles.antdForm}
          onValuesChange={(_, all) => {
            const prev = (node.getData() as PipelineOutputData) ?? {}
            node.setData({ ...prev, params: all.params })
          }}
        >
          <Form.List name="params">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div key={field.key} className={styles.listRow}>
                    <div className={styles.outRow}>
                      <Form.Item name={[field.name, 'key']} noStyle>
                        <Input placeholder="字段名" allowClear />
                      </Form.Item>
                      <Form.Item name={[field.name, 'process']} noStyle>
                        <Input.TextArea
                          rows={2}
                          placeholder="过滤条件、映射或聚合说明…"
                          className={styles.outTextarea}
                        />
                      </Form.Item>
                    </div>
                    <Button
                      type="text"
                      danger
                      size="small"
                      disabled={fields.length <= 1}
                      onClick={() => remove(field.name)}
                    >
                      删除
                    </Button>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    block
                    onClick={() =>
                      add({ key: `out${fields.length + 1}`, process: '' })
                    }
                  >
                    添加接收字段
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </div>
    </div>
  )
}
