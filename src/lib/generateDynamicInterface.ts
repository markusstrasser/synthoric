import { ApplicationExplainer } from '$prompts'
import { readFileSync } from 'node:fs'
import { anthropicClaude } from './providers'
import { readFolderContents } from './tools/file'

const SvelteMigrationGuide = readFileSync('src/lib/prompts/SvelteMigrationGuide.md', 'utf8')
const StateStoreDispatchPrompt = `
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

const dynamicComponentFormattingInstructions = `
<FormattingInstructions>
Your output should be a CONTINUATION of the starter code provided ie:
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
      </script>
      <h1>{currentstep}</h1>
      ...
  </WRONG-output>
  THIS WOULD CAUSE A FORMATTING ERROR SINCE IT"S NOT CORRECT SVELTE MARKUP.

  DO NOT USE any <style></style> tags. EVERYTHING MUST BE TAILWIND inline.
</FormattingInstructions>
`

// Some available Svelte Actions:
// ${readFileSync('src/lib/prompts/Svelte-Actions.md', 'utf8')}
const ComponentsInfo = `
<Component-Documentation>
  Here's the info on how to use some of the imported components and utils:
  ${readFolderContents('src/components/core', 4)}

</Component-Documentation>`

// ${readFolderContents('src/components/ui/form', 4)}

const createDynamicComponentPrompt = (InteractionSpec: string) => `
${ApplicationExplainer}
Your task is to create the next Interaction UI the user will see.
You will generate functioning Svelte component code (as value of one of the keys in the schema) that will be written to disk and dynamically loaded into the application.

<InteractionSpec>
Here's the high level spec for the next interaction:
${InteractionSpec}
</InteractionSpec>

The schema you have to adhere to will be given at the end.
<Setup>

We provide you with the starter code of the component, including many common imports and a basic structure as a prefill in the message. What you generate will be appended to the string.

* The component will be a .svelte file. We're using Svelte 5 with its new 'runes' api. Svelte 5, Runes and Migration docs info below.
* For styling use TailwindCSS. 
* The imports include many components and utils you can use.
* You are encouraged to leverage Svelte's features like motion, animation etc.

ONLY use the components where you are reasonably certain about how they work.

The Svelte component markup to be DIRECTLY appended to the starter setup code provided. Your generated code will be Direclty added after the provided (prefill) setup code, ie. markup = {providedCode} + {yourCode}. The result has to be valid svelte code

${dynamicComponentFormattingInstructions}

${StateStoreDispatchPrompt}

${SvelteMigrationGuide}

${ComponentsInfo}
`

const dynamicComponentStarterMarkup = `<script lang="ts">
 ${readFileSync('src/lib/prompts/dynamicStarterCode.ts', 'utf8')}
 `

export default async (InterfaceSpec: string) => {
  const prefill = dynamicComponentStarterMarkup
  try {
    const response = await anthropicClaude.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4048,
      system: createDynamicComponentPrompt(InterfaceSpec),
      messages: [
        { role: 'user', content: '<waiting for response>' },
        { role: 'assistant', content: prefill.trim() }, //? prefils help the LLM adhering to schema
      ],
    })
    console.log('response.content', response.content)

    return prefill + response.content?.[0].text
  } catch (error) {
    console.error('error', error)
  }
}
