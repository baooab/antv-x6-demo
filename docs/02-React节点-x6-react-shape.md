# 第二部分：用 `@antv/x6-react-shape` 把节点画成 React 组件

## 1. 为什么需要它

X6 默认节点多为 SVG 模板（`label`、`attrs` 等）。当节点里需要 **复杂 UI**（表单、列表、富交互）时，用字符串拼 SVG 成本高。`@antv/x6-react-shape` 在节点内的 **foreignObject** 里挂载 React，让你像写普通组件一样写节点内容。

官方教程入口：[React 节点](https://x6.antv.antgroup.com/tutorial/intermediate/react)。

## 2. 包在运行时做了什么

安装依赖后（本仓库已在 `package.json` 中引入），在业务代码里 **至少执行一次** 对包的加载：

```ts
import '@antv/x6-react-shape'
```

该包会注册内置基类节点 **`react-shape`** 以及对应 **`react-shape-view`**（内部用 `createRoot` 把 React 树挂到节点容器上）。若打包工具只打进了 `register` 而未分析到上述副作用，可能出现视图未注册的运行时错误，因此建议 **显式** `import '@antv/x6-react-shape'` 再 `import { register } from '...'`。

## 3. `register`：声明一种可复用的「形状」

```ts
import { register } from '@antv/x6-react-shape'

register({
  shape: 'pipeline-input', // 与 addNode({ shape }) 对应
  component: PipelineInputNode,
  effect: ['data'],
  width: 220,
  height: 136,
  attrs: {
    body: { stroke: '#34d399', rx: 8, ry: 8, fill: '#ffffff' },
  },
})
```

要点：

- **`shape`**：自定义名称，之后在 `graph.addNode({ shape: 'pipeline-input', ... })` 使用。
- **`component`**：函数组件或类组件；库会通过 `cloneElement` 注入 **`node` 与 `graph`**。
- **`inherit`**：默认继承内置的 `react-shape`，一般不必改。
- **`effect`**：见源码 `Wrap`：监听 `node` 的 `change:*`，仅当 `key` 落在 `effect` 里才 `setState` 触发子树更新；不写则任意属性变更都会重渲染。

## 4. 本仓库示例对应关系

演示图为 **纯 React 节点** 串联的数据处理语义：**输入 → 函数 → 输出**。

| 形状 id | 语义 | 样式区分 | 组件 |
| --- | --- | --- | --- |
| `pipeline-input` | 输入参数，供给下游函数 | 绿色系 + `IN` 徽章 | `PipelineInputNode.tsx`（`Form` + `Form.List` + `Input`） |
| `pipeline-function` | 数据处理流程 | 蓝色系 + `FN` 徽章 | `PipelineFunctionNode.tsx` |
| `pipeline-output` | 接收函数结果，声明过滤/后处理 | 琥珀色系 + `OUT` 徽章 | `PipelineOutputNode.tsx`（`Form` + `Input` / `Input.TextArea`） |

输入 / 输出节点内表单由 **Ant Design** 提供；根应用在 `App.tsx` 中使用 `ConfigProvider`（`locale` 中文、`componentSize="small"`、`theme` 略收紧圆角与控制高度）。

公共类型见 `src/components/react-nodes/types.ts`，样式见 `pipeline-nodes.module.css`（CSS Modules）。`DemoGraph.tsx` 中仅添加上述三类节点与两条边；连线颜色与语义大致对齐（输入→函数偏绿，函数→输出偏蓝）。

节点内 **不要** 默认能使用 `App` 里自定义 React Context，除非按官方方式处理 Portal（进阶话题）。

## 5. 动态高度与内部滚动（`foreignObject` 与 `node.resize`）

React 内容画在 SVG 的 **foreignObject** 里，其宽高由节点模型上的 **width / height** 决定。若只把根节点写 `height: 100%`，内容增高时仍受上一帧的固定高度约束，表现成 **裁切**、**没有滚动条**。

本仓库在 `usePipelineNodeAutoSize` 中：

- 用 **ResizeObserver** 感知变化；自然高度由 **标题栏高度 + 主体 `.pipeline-node-bd` 的 `scrollHeight`** 相加得到（**不再**先把节点临时拉到极大高度，以免连线端点随之乱跳）。
- **`ResizeObserver` 回调防抖**，合并短时间内的反复触发（例如拖动 textarea 垂直尺寸），仅在停顿后调用 **`node.resize`**；并用 **`graph.startBatch` / `stopBatch`** 包住一次尺寸写入，减轻边的重复计算。
- 在 `src/x6/pipelineLayout.ts` 配置 **`maxHeight`**；超出时为根节点加上 `pipeline-node--body-scroll`，在 **`.pipeline-node-bd` 上启用 `overflow-y: auto`**。

实现细节见 `src/components/react-nodes/usePipelineNodeAutoSize.ts` 与 `pipeline-nodes.module.css` 中 `bodyScroll`（根上同时挂 `root` + `bodyScroll`）相关规则。标题/主体用 `data-pipeline-part` 供 hook 测量，避免依赖被哈希的类名。

## 6. 与第一部分的关系

- 画布配置（`autoResize`、`translating.restrict`、`mousewheel` 等）不变。
- 当前分支演示 **不再使用内置矩形节点**，全部由 `register` 的 React 形状承担。

## 7. 自测建议

1. `npm run dev`，确认三类节点样式与布局正常。  
2. 在 **输入** 中修改参数名/值、点击「添加参数」，数据应写回 `node.data`。  
3. 在 **输出** 中编辑处理说明，验证 `setData` 与 `effect: ['data']`。  
4. 拖动节点，确认仍受 `translating.restrict` 约束。  
5. 在 **输入** 中多次「添加参数」或拉高峰值内容，节点外框应 **变高**；当超过 `pipelineLayout` 中 `maxHeight` 时，**主体内**应出现 **纵向滚动条**。

## 8. 后续可扩展方向

- 为边绑定端口（port）以便从指定磁贴连线。  
- 与外部状态管理（Zustand、Redux 等）同步 `node.setData`。  
- 阅读官方文档中关于 **Portal**、**性能**、**事件穿透** 的说明，避免复杂交互与 X6 拖拽冲突。
