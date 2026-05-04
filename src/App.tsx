import { TutorialPage } from './tutorial/TutorialPage'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>X6 智能体流程：分步教程</h1>
        <p className="app-sub">
          左侧切换第 01–08 课，每课对应可运行的小 Demo，从空画布逐步拼出与
          <code> agent-flow/ </code> 一致的完整应用。第 08 课即完整编排界面；URL 哈希{' '}
          <code>#l07</code> 可直接打开对应课程。
        </p>
      </header>
      <main className="app-main">
        <TutorialPage />
      </main>
    </div>
  )
}

export default App
