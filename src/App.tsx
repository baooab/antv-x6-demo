import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { DemoGraph } from './components/DemoGraph'
import './App.css'

function App() {
  return (
    <ConfigProvider locale={zhCN} componentSize="small">
      <div className="app">
        <header className="app-header">
          <h1>AntV X6 学习示例</h1>
          <p className="app-sub">
            三类 React 节点（输入 / 函数 / 输出）；按住 Ctrl / ⌘
            滚轮缩放；节点可拖动；表单变更写入节点 data。
          </p>
        </header>
        <main className="app-main">
          <DemoGraph />
        </main>
      </div>
    </ConfigProvider>
  )
}

export default App
