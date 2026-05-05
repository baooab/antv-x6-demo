# 第 06 课 · Stencil 左侧模具

**交互 Demo**：`src/tutorial/demos/Lesson06Stencil.tsx` · 页面哈希 `#l06`

## 目标

- 使用 **`new Stencil({ target: graph, groups, ... })`** 构建左侧资源面板；
- **`stencil.load(nodeList, groupName)`** 向指定分组放入可拖拽节点；
- 模具内预览使用 **`Graph.registerNode`** 注册的 **`agent-stencil-card`**（纯 SVG，轻量），见 **`registerStencilPreviewNode`**；
- 用 **`createAgentStencilCard(graph, cfg)`**（`src/agent-flow/factory.ts`）生成模具里的节点实例。
- 检索：在 **`new Stencil`** 中传入 **`search`**（字段映射）及可选 **`placeholder` / `notFoundText`**；本仓库共用 **`graphOptions.ts`** 中的 **`agentStencilSearchUi`**，按 **`agent-stencil-card`** 的标题、描述、角标与 **`data/type`** 做子串匹配。

## 布局说明

典型页面结构为 **左：Stencil 容器** + **右：主 Graph 容器**（本仓库用 **`AgentFlowLayout`** 组件 + **`AgentFlowLayout.module.css`** 中的根区、左右栏与 X6 模具部件的全局覆盖样式）。

Stencil 的 **`container`** 需插入 DOM（如 **`appendChild(stencil.container)`**），卸载时 **`stencil.dispose()`**。

## 本课与下一课的区别

第 06 课拖到主画布上的节点 **仍是模具预览形状**（`agent-stencil-card`）。  
第 07 课会在 **`node:added`** 里将其 **替换** 为 React 业务卡片（`agent-react-card`）。

## 下一课

[第 07 课 · 落地替换](./07-落地替换.md)
