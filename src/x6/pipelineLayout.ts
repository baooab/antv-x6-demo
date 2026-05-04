/** 与 registerReactShapes 中默认 width 对齐，供自动增高 / 内部滚动使用 */
export const PIPELINE_INPUT_LAYOUT = {
  minWidth: 220,
  minHeight: 88,
  maxHeight: 420,
} as const

export const PIPELINE_FUNCTION_LAYOUT = {
  minWidth: 280,
  minHeight: 120,
  maxHeight: 480,
} as const

export const PIPELINE_OUTPUT_LAYOUT = {
  minWidth: 228,
  minHeight: 130,
  maxHeight: 520,
} as const
