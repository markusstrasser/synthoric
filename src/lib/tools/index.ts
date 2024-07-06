import * as AIToolConfigs from './AIToolConfigs'
import createEnhancedAITool from './createAITool'

const Tools = Object.fromEntries(
  Object.entries(AIToolConfigs).map(([name, config]) => [name, createEnhancedAITool(config)])
) as { [K in keyof typeof AIToolConfigs]: ReturnType<typeof createEnhancedAITool> }

console.log(Tools.MultipleChoiceTask.prefill, Object.keys(Tools))

export default Tools
