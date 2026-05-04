import type { Node } from '@antv/x6'
import { useLayoutEffect, useRef, useState } from 'react'

export type PipelineAutoSizeOpts = {
  minWidth: number
  minHeight: number
  maxHeight?: number
}

const RO_DEBOUNCE_MS = 40
const SIZE_EPS = 1.5

function measureNaturalBlock(el: HTMLElement, opts: PipelineAutoSizeOpts): {
  width: number
  shouldCap: boolean
  targetH: number
} {
  const hd = el.querySelector('[data-pipeline-part="hd"]')
  const bd = el.querySelector('[data-pipeline-part="bd"]')
  let contentW = opts.minWidth
  if (hd instanceof HTMLElement) {
    contentW = Math.max(contentW, hd.scrollWidth)
  }
  if (bd instanceof HTMLElement) {
    contentW = Math.max(contentW, bd.scrollWidth)
  }
  const aw = Math.ceil(contentW)

  const hdH = hd instanceof HTMLElement ? hd.offsetHeight : 0
  const bdH = bd instanceof HTMLElement ? bd.scrollHeight : 0
  const naturalUncapped = Math.ceil(hdH + bdH)

  const maxH = opts.maxHeight
  const shouldCap = maxH != null && naturalUncapped > maxH
  const targetH = Math.max(opts.minHeight, shouldCap ? maxH! : naturalUncapped)

  return { width: aw, shouldCap, targetH }
}

function applyGraphResize(node: Node, width: number, height: number) {
  const graph = node.model?.graph
  if (graph) {
    graph.startBatch('pipeline-node-autosize')
    try {
      node.resize(width, height)
    } finally {
      graph.stopBatch('pipeline-node-autosize')
    }
  } else {
    node.resize(width, height)
  }
}

export function usePipelineNodeAutoSize(node: Node, opts: PipelineAutoSizeOpts) {
  const ref = useRef<HTMLDivElement>(null)
  const [bodyScroll, setBodyScroll] = useState(false)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    let cancelled = false

    const measureNow = () => {
      if (cancelled) return

      const { width: aw, shouldCap, targetH } = measureNaturalBlock(el, opts)
      setBodyScroll(shouldCap)

      const sz = node.size()
      if (
        Math.abs(sz.width - aw) < SIZE_EPS &&
        Math.abs(sz.height - targetH) < SIZE_EPS
      ) {
        return
      }

      applyGraphResize(node, aw, targetH)
    }

    const schedule = () => {
      if (debounceTimerRef.current != null) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null
        measureNow()
      }, RO_DEBOUNCE_MS)
    }

    const ro = new ResizeObserver(() => {
      schedule()
    })
    ro.observe(el)

    measureNow()

    return () => {
      cancelled = true
      ro.disconnect()
      if (debounceTimerRef.current != null) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node, opts.minWidth, opts.minHeight, opts.maxHeight])

  return { ref, bodyScroll }
}
