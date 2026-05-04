import type { ComponentType } from 'react'
import { Lesson01MinimalGraph } from './demos/Lesson01MinimalGraph'
import { Lesson02CustomEdge } from './demos/Lesson02CustomEdge'
import { Lesson03ReactNode } from './demos/Lesson03ReactNode'
import { Lesson04PortInteraction } from './demos/Lesson04PortInteraction'
import { Lesson05Snapline } from './demos/Lesson05Snapline'
import { Lesson06Stencil } from './demos/Lesson06Stencil'
import { Lesson07DropReplace } from './demos/Lesson07DropReplace'
import { Lesson08FullApp } from './demos/Lesson08FullApp'

export type LessonEntry = {
  id: string
  indexLabel: string
  title: string
  lead: string
  bullets: string[]
  relatedFiles: string[]
  Demo: ComponentType
}

export const LESSONS: LessonEntry[] = [
  {
    id: 'l01',
    indexLabel: '01',
    title: '最简画布：Graph 与内置节点',
    lead:
      '先建立一个容器 div，再 `new Graph({ container, grid, mousewheel })`。本课用内置 `rect` 画一块卡片，确认画布能渲染、能缩放平移。',
    bullets: [
      '`Graph` 是一切交互的入口；`dispose()` 在组件卸载时必须调用，避免内存泄漏。',
      '网格与滚轮缩放只是配置项，尚未涉及自定义形状。',
    ],
    relatedFiles: ['src/tutorial/demos/Lesson01MinimalGraph.tsx'],
    Demo: Lesson01MinimalGraph,
  },
  {
    id: 'l02',
    indexLabel: '02',
    title: '自定义边 + 四向连接桩 + 拖拽连线',
    lead:
      '通过 `Graph.registerEdge` 注册 `agent-edge`，并在节点上挂上 `ports`（见 `fourWayPorts`）。配置 `connecting.createEdge` 让每次拖拽出的边都使用你的样式。',
    bullets: [
      '连接桩上的圆点要 `magnet: true` 才能作为起点/终点。',
      '`validateConnection` 可禁止连到空白处；本示例要求必须落到目标磁体上。',
      '`createAgentFlowConnecting(() => graph)` 用箭头函数懒取 graph，避免初始化顺序问题。',
    ],
    relatedFiles: [
      'src/agent-flow/registerShapes.ts（registerAgentEdgeShape）',
      'src/agent-flow/ports.ts',
      'src/agent-flow/graphOptions.ts',
      'src/agent-flow/graphInteractions.ts（悬停显隐连接桩，与第 04 课同源）',
      'src/tutorial/demos/Lesson02CustomEdge.tsx',
    ],
    Demo: Lesson02CustomEdge,
  },
  {
    id: 'l03',
    indexLabel: '03',
    title: 'React 节点：@antv/x6-react-shape',
    lead:
      '调用 `register({ shape, component, width, height, effect: [\'data\'] })` 把 React 组件绑到节点 shape。数据放在 `node.data`，组件里用 `node.getData()` 读取。',
    bullets: [
      '必须 `import \'@antv/x6-react-shape\'` 一次以挂载渲染逻辑。',
      '本课仍关闭连线或仅保留画布，让你专注看 DOM 卡片如何嵌在 SVG 图里。',
    ],
    relatedFiles: [
      'src/agent-flow/nodes/AgentReactCard.tsx',
      'src/agent-flow/registerShapes.ts（registerAgentReactCardShape）',
      'src/tutorial/demos/Lesson03ReactNode.tsx',
    ],
    Demo: Lesson03ReactNode,
  },
  {
    id: 'l04',
    indexLabel: '04',
    title: '端口悬停显隐与边的删除按钮',
    lead:
      '把「鼠标进入节点 → 显示全部桩；离开 → 只保留已连线桩」写在 `graph.on(\'node:mouseenter\')` 等事件里。边上加 `button-remove` 工具，便于删除连线。',
    bullets: [
      '`edge:added` / `edge:removed` 里根据 `isPortConnected` 更新圆点颜色与显隐。',
      '逻辑集中在 `graphInteractions.ts`，与 React 视图解耦。',
    ],
    relatedFiles: [
      'src/agent-flow/graphInteractions.ts',
      'src/tutorial/demos/Lesson04PortInteraction.tsx',
    ],
    Demo: Lesson04PortInteraction,
  },
  {
    id: 'l05',
    indexLabel: '05',
    title: '对齐线 Snapline',
    lead:
      '`graph.use(new Snapline())` 即可在拖动节点时出现对齐参考线，与 Selection、History 等一样属于插件式扩展。',
    bullets: ['可与教程前几课的连线、端口策略叠加使用，无额外业务代码。'],
    relatedFiles: ['src/tutorial/demos/Lesson05Snapline.tsx', 'src/agent-flow/AgentFlowView.tsx'],
    Demo: Lesson05Snapline,
  },
  {
    id: 'l06',
    indexLabel: '06',
    title: 'Stencil 左侧模具：拖入画布',
    lead:
      '`new Stencil({ target: graph, groups: [...] })`，左侧每个分组是一个小图；`stencil.load(nodes, groupName)` 填充卡片。拖入时仍在使用模具预览节点 `agent-stencil-card`。',
    bullets: [
      '模具节点与画布节点可以共用 `ports`，便于连线手感一致。',
      '本课尚未做「落地替换」，拖到画布上的仍是缩略 SVG 节点。',
    ],
    relatedFiles: [
      'src/agent-flow/registerShapes.ts（registerStencilPreviewNode）',
      'src/agent-flow/factory.ts（createAgentStencilCard）',
      'src/tutorial/demos/Lesson06Stencil.tsx',
    ],
    Demo: Lesson06Stencil,
  },
  {
    id: 'l07',
    indexLabel: '07',
    title: '落地替换：从模具预览到 React 节点',
    lead:
      '监听 `node:added`：若节点来自模具（`data.type` 存在且 shape 不是 `agent-react-card`），读取 JSON 配置生成真正的 `createAgentCard`，同坐标替换。',
    bullets: [
      '配置由 `public/data/agent-flow.json` 提供，可按业务改为接口请求。',
      '本课初始画布为空，请从左侧拖入节点观察替换效果。',
    ],
    relatedFiles: ['src/agent-flow/AgentFlowView.tsx', 'src/tutorial/demos/Lesson07DropReplace.tsx'],
    Demo: Lesson07DropReplace,
  },
  {
    id: 'l08',
    indexLabel: '08',
    title: '完整应用：起止节点 + 示例连线',
    lead:
      '综合前几课：加载配置、模具、替换、开始/结束 Flow 节点与默认边，与官方「智能体流程编排」展示一致。',
    bullets: ['对应生产代码入口：`AgentFlowView.tsx` + `agent-flow` 目录各模块。'],
    relatedFiles: ['src/agent-flow/AgentFlowView.tsx'],
    Demo: Lesson08FullApp,
  },
]
