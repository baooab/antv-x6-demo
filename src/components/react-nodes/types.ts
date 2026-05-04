export type PipelineInputData = {
  title?: string
  params?: { key: string; value: string }[]
}

export type PipelineFunctionData = {
  title?: string
  description?: string
  steps?: string[]
}

export type PipelineOutputData = {
  title?: string
  params?: { key: string; process: string }[]
}
