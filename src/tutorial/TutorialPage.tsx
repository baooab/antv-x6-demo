import { useCallback, useEffect, useState } from 'react'
import '../agent-flow/agent-flow.css'
import './tutorial.css'
import { LESSONS } from './lessonRegistry'

function readLessonFromHash(): string | null {
  const id = window.location.hash.replace(/^#/, '').trim()
  return LESSONS.some((l) => l.id === id) ? id : null
}

export function TutorialPage() {
  const [activeId, setActiveId] = useState(() => readLessonFromHash() ?? LESSONS[0].id)

  useEffect(() => {
    const fromHash = readLessonFromHash()
    if (fromHash) setActiveId(fromHash)
  }, [])

  const selectLesson = useCallback((id: string) => {
    setActiveId(id)
    window.history.replaceState(null, '', `#${id}`)
  }, [])

  const lesson = LESSONS.find((l) => l.id === activeId) ?? LESSONS[0]
  const Demo = lesson.Demo

  return (
    <div className="tutorial-layout">
      <nav className="tutorial-nav" aria-label="教程目录">
        <h2>从 0 到 1</h2>
        <ul className="tutorial-nav-list">
          {LESSONS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`tutorial-nav-item${item.id === activeId ? ' is-active' : ''}`}
                onClick={() => selectLesson(item.id)}
              >
                <span className="tutorial-nav-index">第 {item.indexLabel} 课</span>
                <span className="tutorial-nav-title">{item.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="tutorial-content">
        <article className="tutorial-article">
          <h3>
            第 {lesson.indexLabel} 课 · {lesson.title}
          </h3>
          <p className="tutorial-lead">{lesson.lead}</p>
          <ul className="tutorial-bullets">
            {lesson.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <p className="tutorial-files">
            相关源码：
            {lesson.relatedFiles.map((f, i) => (
              <span key={f}>
                {i > 0 ? ' · ' : ' '}
                <code>{f}</code>
              </span>
            ))}
          </p>
        </article>

        <div className="tutorial-demo-wrap">
          <Demo key={lesson.id} />
        </div>
      </div>
    </div>
  )
}
