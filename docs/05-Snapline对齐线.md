# 第 05 课 · 对齐线 Snapline

**交互 Demo**：`src/tutorial/demos/Lesson05Snapline.tsx` · 页面哈希 `#l05`

## 目标

拖动节点时显示 **对齐参考线**，与其它画布行为（连线、端口策略）正交，一行插件即可启用。

## 用法

```ts
import { Snapline } from '@antv/x6'

graph.use(new Snapline())
```

与官方插件 **`Selection`**、**`History`** 等一样，通过 **`graph.use`** 安装。

## 本课与前序课程的关系

在第 04 课基础上增加 **`Snapline`**；仍保留 **`bindAgentFlowInteractions`** 与 **`createAgentFlowConnecting`**，对齐线不改变业务事件逻辑。

完整编排界面中同样在 **`AgentFlowView.tsx`** 里对主图调用了 **`graph.use(new Snapline())`**。

## 下一课

[第 06 课 · Stencil 模具](./06-Stencil模具.md)
