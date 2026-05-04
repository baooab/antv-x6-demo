# 第 03 课 · React 节点（@antv/x6-react-shape）

**交互 Demo**：`src/tutorial/demos/Lesson03ReactNode.tsx` · 页面哈希 `#l03`

## 目标

- 至少执行一次 **`import '@antv/x6-react-shape'`**，挂载库的内置视图（副作用引入）；
- 使用 **`register({ shape, component, width, height, effect })`** 声明自定义形状；
- 在 **`graph.addNode({ shape, data, ports })`** 中挂上业务数据，组件内通过 **`node.getData()`** 读取。

## 为什么需要 x6-react-shape

复杂 UI（表单、按钮、多区块布局）用 SVG 字符串维护成本高。`@antv/x6-react-shape` 在节点视图内用 React 渲染内容，开发体验接近普通页面组件。

官方文档：[React 节点](https://x6.antv.antgroup.com/tutorial/intermediate/react)。

## `register` 要点

注册代码在 **`src/agent-flow/registerShapes.ts`** 的 **`registerAgentReactCardShape`**：

- **`shape`**：与 `addNode({ shape: 'agent-react-card' })` 一致；
- **`component`**：接收注入的 **`node`**（及 **`graph`**，若需要）；
- **`effect: ['data']`**：仅在 `node` 的 data 等指定维度变化时触发 React 更新，避免无谓重渲染。

本仓库节点 UI 见 **`src/agent-flow/nodes/AgentReactCard.tsx`**（业务卡片）及后续 Flow 起止节点用的 **`FlowCard.tsx`**。

## 本课 Demo 的特点

为突出「React 已挂上节点」，第 03 课 **不启用 `connecting`**，避免与「认形状」混在一起。第 04 课起会重新打开连线并叠加端口交互。

## 与内置 rect 的对比

| 方式 | 适用场景 |
| --- | --- |
| 内置 `rect` / `registerNode` SVG | 简单几何与文本 |
| `register` + React 组件 | 复杂 DOM、交互、与 `node.data` 同步 |

## 下一课

[第 04 课 · 端口与边交互](./04-端口与边交互.md)
