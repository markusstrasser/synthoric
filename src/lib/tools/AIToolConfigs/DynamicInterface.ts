import { z } from 'zod'
import { ApplicationExplainer } from '$prompts'
import { readFolderContents } from '../file'
import { readFileSync } from 'node:fs'
import { anthropicClaude } from '$lib/providers'

const mockContext = `
* The current topic is classical mechanics.
* The user is a high school AP or college freshman.
* The user likes elegant styling
`

export const StateStoreDispatchPrompt = `
<State-Store-Dispatch>
  ### Dispatch and Global State
  The 'dispatch' function let's you dispatch actions to the store. 
  The dispatch takes a type and a payload. {type, payload}. 
  Type could be 'requested-hint', 'selected-choice', 'requested-solution', 'highlighted-paragraph', 'requested-definition', 'requested-explainer' 

  There's other actions that get triggered in parent components, for example, 'submitted-answer'. You don't have to worry about them but if some of your UI depends on that state change you can read it out with actions.hasSubmitted. Actions is a class instance and all properties are reactive value. That means you cannot use javascript destructuring like {hasSubmitted} (no-go!). You have to always read them with actions.hasSubmitted.

  In the store it gets added to the list of actions and is automatically given an Id and timestamp. At certain intervals the actionStore gets persisted into the DB for later analyzing user behavior, learning, preferences, interests and knowledge (by AIs or human experts).

  By default only the last value per type get's saved to the database. Example: If there's a text-input field we only save the most recent value, ie. "abc" and not the otherwise ["a", "ab", "abc"].

  For your reference the implementation of the store is here:

  <actionStore-code>
    ${readFileSync('src/lib/stores/index.svelte.ts')}
  </actionStore-code>

  Only the entry component (the one you write) should actually dispatch actions since the utility/ui svelte components should be kept 'dumb'.
  For example if you want to update the store based on a child component state change you can do this:

  

  Of course you can also create a custom onSelect function that changes your $state for custom local logic and then use an $effect to dispatch to the tore.  Your choice.

  ### Local State
  If an action/event is just to manage the UI, like a hover or mouse move, you can keep that state locally as normally with Svelte. 
  Meaningful actions, which includes everything that can teach us something about the user and should persist to DB, should be dispatched to the store.
  For example, a user requesting a hint instead of solving the task himself is a meaningful action, but then if the user shows/hides the hint button multiple times in the same interaction that's not meaningful. 
  
  <Gotchas>
  Example of updating state
    let progress = $state(0);
    //let is ok. If it was 'const progress = ...' it would throw on error on reassignment
    const updateProgress = () => {
      progress = Math.min(100, progress + 20);
      dispatch({ type: 'progress-update', payload: progress });
    };
  </Gotchas>
</State-Store-Dispatch>

`

const WhatYouCanDoPrompt = `
In general you can create any interface you want. 
You also have access to
* lots of components (ala component library)
* utility libraries
* drawing (2D and 3D like D3js)
* phaser and gaming libraries

This is to open up your mind to find the most engaging and fitting next interface to think off for the user.
Obviously content/concepts and context should win over just a cool interface but I hope can think of something cool.  
`

export const SvelteMigrationGuide = readFileSync('src/lib/prompts/SvelteMigration.md', 'utf8')
export const dynamicComponentStarterMarkup = `<script lang="ts">
 ${readFileSync('src/lib/prompts/dynamicStarterCode', 'utf8')}`

const InterfaceSpecPrompt = `${ApplicationExplainer}
Your tasked to create a detailed specification of the next User Interface and Content the user will see. This specification will be fed to the next AI that then transforms it into actual frontend component markup, data and code. 
You will be provided with user analytics, topic and app history as context to make the most engaging interaction for the user.

The AI that reads your specification has no access to the user data Context you are provided with. This means you should mention any important details, concepts, representations, analytics, insights and so on. You can recommend a few ideas or  or issues the user might have. 

Every prompt can include:
  * what skill/concept to test the user on. 
  * mentions of user history (context) to best inform the tool AI so it can personalize UI and content.

<Context>
${mockContext}
</Context>

You do not need to generate any code. That's the task of your successor AI 

Your task is to ** generate a high level configuration prompt for the next interaction**.

  Consult the previous CONTEXT to generate a fitting, personalized instruction.

  >> Avoid duplicates and repetition unless if you think the student should be re-exposed to it.
  
  Here's an example output with placeholders {} for the context you can insert:
  <example outputs>
  * Test the user on the relationship between centripedal force and velocity in circular motion. The task should challenge the user to think about how changing the velocity would affect the centripetal force required to maintain circular motion, both in the case of a roller coaster loop and a satellite orbit. The user previously correctly completed: {...insertRelevantTasks}. The user struggled with {...insertWhatYouThinkAreStrugglepoints}

  * Building on the user's correct understanding of how velocity affects centripetal force, challenge them to apply this knowledge to a real-world scenario. Present a situation where a space agency needs to adjust a satellite's orbit to a higher altitude while maintaining a circular path. Ask the user to explain the steps the agency would need to take in terms of adjusting the satellite's velocity, and how this relates to the centripetal force required for the new orbit. Encourage them to think about the balance between gravitational pull and the satellite's velocity in maintaining a stable, circular orbit at different altitudes.
  </example outputs>
`

const DynamicInterfaceOrchestrator = {
  //execute is passed into the .execute function
  description: 'Creates the High Level Specification for the next Interaction: content and UI',
  prompt: InterfaceSpecPrompt,
  // prefill: dynamicComponentStarterMarkup,
  // params: z.any(),
  schema: z.object({
    specficationPrompt: z.string(),
    debug: z.string(),
  }),
}

const ComponentsInfo = `
<Component-Documentation>
  Here's the info on how to use some of the imported components and utils:
  ${readFolderContents('src/components/core', 4)}
  ${readFolderContents('src/components/ui/form', 4)}
</Component-Documentation>`

const createDynamicComponentPrompt = `
${ApplicationExplainer}
Your task is to create the next Interaction UI the user will see.
You will generate functioning Svelte component code (as value of one of the keys in the schema) that will be written to disk and dynamically loaded into the application.

Other than navigation and sidebar, what you create will be the main content and UI the user sees and interacts with.

**You will be provided with user analytics, topic and app history as context to make the most engaging interaction for the user.**

The schema you have to adhere to will be given at the end. 

<Setup>

We provide you with the starter code of the component, including many common imports and a basic structure as a prefill in the message. What you generate will be appended to the string.

* The component will be a .svelte file. We're using Svelte 5 with its new 'runes' api. Svelte 5, Runes and Migration docs info below.
* For styling use TailwindCSS. 
* The imports include many components and utils you can use.
* You are encouraged to leverage Svelte's features like motion, animation etc.

Just to make sure you format correctly. Your output should be a CONTINUATION of the starter code provided ie:
<Correct-Example-output>
  const a = $state(0)
  </script>
  <div>
    <p>a is {a}</p>
  </div>
</Correct-Example-output>
As you can see it's just a continuation of the starter code provided. The combined strings form a valid svelte component.

<WRONG-output>
  //Your code and svelte html/markup + tailwind below ...  ->
  {
    "content": 
    // State variables
    let currentStep = $state(0);
    let userAnswer = $state('');
    let feedback = $state('');
    ...
</WRONG-output>

THIS WOULD CAUSE A FORMATTING ERROR SINCE IT"S NOT CORRECT SVELTE MARKUP.
DO NOT USE any <style></style> tags. EVERYTHING MUST BE TAILWIND inline.

ONLY use the components where you are reasonably certain about how they work.

The Svelte component markup to be DIRECTLY appended to the starter setup code provided. Your generated code will be Direclty added after the provided (prefill) setup code, ie. markup = {providedCode} + {yourCode}. The result has to be valid svelte code

${StateStoreDispatchPrompt}

${SvelteMigrationGuide}

${ComponentsInfo}
`

export const generateDynamicInterface = async () => {
  const prefill = dynamicComponentStarterMarkup
  try {
    const response = await anthropicClaude.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 2024,
      system: createDynamicComponentPrompt,
      messages: [
        { role: 'user', content: '<waiting for response>' },
        { role: 'assistant', content: prefill.trim() }, //? prefils help the LLM adhering to schema
      ],
    })
    console.log('response', response)

    return response.content?.[0].text
  } catch (error) {
    console.error('error', error)
  }
}

// export default {
//   description: 'Dynamically Generates a Svelte component for the user to interact with.',
//   prompt: createDynamicComponentPrompt,
//   prefill: dynamicComponentStarterMarkup,
//   // params: z.any(),
//   schema: z
//     .string()
// }
