# AntV X6 · 智能体流程编排教程（文档）

本目录与仓库内 **交互式分步教程**（`src/tutorial/`）一一对应：运行 `npm run dev` 后，在页面左侧切换第 01–08 课即可对照运行效果。文档用于离线阅读与检索 API、路径约定。

**官方参考**：[X6 官网](https://x6.antv.antgroup.com/) · [快速上手](https://x6.antv.antgroup.com/tutorial/getting-started) · [智能体流程编排示例](https://x6.antv.antgroup.com/examples/showcase/practices/#agentFlow)

## 阅读顺序

| 课次 | 文档 | 交互路由（可选） | 核心内容 |
| --- | --- | --- | --- |
| 导读 | [环境与仓库说明](./00-环境与仓库说明.md) | — | 技术栈、安装、目录、`Graph` 生命周期 |
| 01 | [第 01 课 · 最简画布](./01-最简画布.md) | `#l01` | `new Graph`、内置 `rect`、`dispose` |
| 02 | [第 02 课 · 自定义边与连接桩](./02-自定义边与连接桩.md) | `#l02` | `registerEdge`、`ports`、`connecting` |
| 03 | [第 03 课 · React 节点](./03-React节点.md) | `#l03` | `x6-react-shape`、`register`、`node.data` |
| 04 | [第 04 课 · 端口与边交互](./04-端口与边交互.md) | `#l04` | 悬停显隐、`graphInteractions` |
| 05 | [第 05 课 · Snapline](./05-Snapline对齐线.md) | `#l05` | `graph.use(new Snapline())` |
| 06 | [第 06 课 · Stencil 模具](./06-Stencil模具.md) | `#l06` | 左侧面板、`stencil.load` |
| 07 | [第 07 课 · 落地替换](./07-落地替换.md) | `#l07` | `node:added`、JSON 配置 |
| 08 | [第 08 课 · 完整应用](./08-完整应用.md) | `#l08` | `AgentFlowView`、模块拼图 |

在浏览器地址栏追加哈希可直接打开对应课程，例如：`http://localhost:5173/#l07`。

## 源码地图（与本教程相关）

```
src/
  App.tsx                    # 挂载 TutorialPage
  tutorial/
    TutorialPage.tsx         # 左侧目录 + 右侧说明与 Demo
    lessonRegistry.tsx       # 各课元数据（与上表一致）
    demos/                   # Lesson01…Lesson08 可运行示例
  agent-flow/
    AgentFlowLayout.tsx      # 左 Stencil + 右画布布局（同目录 .module.css）
    AgentFlowView.tsx        # 第 08 课完整编排界面
    graphOptions.ts          # 视口（平移/滚轮修饰键/节点范围）、connecting、高亮
    registerShapes.ts        # 边与节点形状注册（可拆分调用）
    ports.ts                 # 四向连接桩
    graphInteractions.ts     # 端口与边事件
    factory.ts               # createAgentCard / createFlowCard 等
    nodes/                   # AgentReactCard、FlowCard
public/
  data/agent-flow.json       # 节点类型配置（第 07、08 课）
```

## 本地运行

```bash
npm install
npm run dev
```

生产构建：`npm run build`。
