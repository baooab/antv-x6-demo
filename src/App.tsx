import { DemoGraph } from './components/DemoGraph'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>AntV X6 学习示例</h1>
        <p className="app-sub">
          React + Vite + TypeScript；按住 Ctrl / ⌘ 滚轮缩放；节点可拖动且限制在画布内（画布平移未开启）。
        </p>
      </header>
      <main className="app-main">
        <DemoGraph />
      </main>
    </div>
  )
}

export default App
