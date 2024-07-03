import { tools } from './tools'
const context = Database.interactions()
const topic = State.getCurrentCourse()

const ToolDescriptions = tools.map(t => t.description).join('\n')
const prompt = `

{{ApplicationGoal}}

Your job now is to decide on the best next interaction type [toolcall] to serve to the student. 

The general topic of the current sequence is {{topic}}

The context is {{context}}

"Available Tools that will be presented as UI to the user":
{{ToolDescriptions}}

If the tool parameters have a 'prompt' field: 
* you must generate a specific prompt for the next AI to use. The prompt has to detail the subtopic, what skill/concept should be tested and so on. Consult the previous student history to generate a fitting, personalized instruction (interactions and system inferences about the student). 
* In the prompt, also list any context (interactions, inferences) to best inform the tool AI.
----
I want you to decide on the best next interaction type to serve to the user. You have the following types to choose from:`
