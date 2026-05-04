import type { Graph, Node } from '@antv/x6'
import { Button, Form, Input, Space } from 'antd'
import { useEffect, useMemo } from 'react'
import { PIPELINE_INPUT_LAYOUT } from '../../x6/pipelineLayout'
import type { PipelineInputData } from './types'
import styles from './pipeline-nodes.module.css'
import { usePipelineNodeAutoSize } from './usePipelineNodeAutoSize'

export function PipelineInputNode({
  node,
}: {
  node: Node
  graph: Graph
}) {
  const [form] = Form.useForm<{ params: NonNullable<PipelineInputData['params']> }>()
  const { ref, bodyScroll } = usePipelineNodeAutoSize(node, {
    minWidth: PIPELINE_INPUT_LAYOUT.minWidth,
    minHeight: PIPELINE_INPUT_LAYOUT.minHeight,
    maxHeight: PIPELINE_INPUT_LAYOUT.maxHeight,
  })

  const data = (node.getData() as PipelineInputData | undefined) ?? {}
  const title = data.title ?? '输入'
  const rawParams = data.params
  const params = useMemo(
    () =>
      rawParams?.length ? rawParams : [{ key: 'param', value: '' }],
    [rawParams],
  )

  const paramsKey = useMemo(() => JSON.stringify(params), [params])

  useEffect(() => {
    const cur = form.getFieldValue('params') as
      | NonNullable<PipelineInputData['params']>
      | undefined
    if (cur && JSON.stringify(cur) === paramsKey) return
    form.setFieldsValue({ params })
  }, [form, params, paramsKey])

  return (
    <div
      ref={ref}
      className={
        `${styles.root} ${styles.variantInput}` +
        (bodyScroll ? ` ${styles.bodyScroll}` : '')
      }
    >
      <div className={styles.hd} data-pipeline-part="hd">
        <span className={styles.badge}>IN</span>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.bd} data-pipeline-part="bd">
        <span className={styles.muted}>提供给下游函数的参数</span>
        <Form<{ params: NonNullable<PipelineInputData['params']> }>
          form={form}
          layout="vertical"
          size="small"
          requiredMark={false}
          className={styles.antdForm}
          onValuesChange={(_, all) => {
            const prev = (node.getData() as PipelineInputData) ?? {}
            node.setData({ ...prev, params: all.params })
          }}
        >
          <Form.List name="params">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div key={field.key} className={styles.listRow}>
                    <Space.Compact block className={styles.paramCompact}>
                      <Form.Item name={[field.name, 'key']} noStyle>
                        <Input placeholder="参数名" allowClear />
                      </Form.Item>
                      <Form.Item name={[field.name, 'value']} noStyle>
                        <Input placeholder="值" allowClear />
                      </Form.Item>
                    </Space.Compact>
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
                      add({ key: `p${fields.length + 1}`, value: '' })
                    }
                  >
                    添加参数
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
