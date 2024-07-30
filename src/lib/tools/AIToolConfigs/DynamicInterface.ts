import { z } from 'zod'
import { ApplicationExplainer, SvelteRunesExplainer } from '$prompts'
const mockContext = `

* The current topic is classical mechanics.
* The user is a high school AP or college freshman.
* The user likes elegant styling
`

export const dynamicComponentStarterMarkup = `
<script lang="ts">
  import actions from '$stores/index.svelte'
  import Markdown from '$components/Markdown.svelte'
  import { fade } from 'svelte/transition'
  import { Button } from '$components/ui/button'
  import { Card } from '$components/ui/card'
  import { Dialog } from '$components/ui/dialog'
  import { DropdownMenu } from '$components/ui/dropdown-menu'
  import { Input } from '$components/ui/input'
  import { Label } from '$components/ui/label'
  import { Select } from '$components/ui/select'
  import { Table } from '$components/ui/table'
  import { Tabs } from '$components/ui/tabs'
  import { Tooltip } from '$components/ui/tooltip'
  import * as Form from '$components/ui/form'

  const { dispatch } = $props() //equivalent to Svelte 4 'export let dispatch'

  /* Svelte 5 with runesexamples. Use let instead of const so it can be reassigned reactively
  let somelist = $state([]) //equivalent to Svelte 4 'let somelist' 
  let listLength = $derived(somelist?.length || 0)
  let listLength2 = $derived.by(somelist, (list) => list?.length || 0

  $effect(() => {
    //this will track changes run every time listLength changes
    console.log(listLength)
    dispatch({type: 'list-length', payload: listLength})
  })

  */
  //Your code and svelte html/markup + tailwind below ...  ->
 `
const prompt = `
${ApplicationExplainer}
Your task is to create the next Interaction UI the user will see.
You will generate functioning Svelte component code (as value of one of the keys in the schema) that will be written to disk and dynamically loaded into the application.

Other than navigation and sidebar, what you create will be the main content and UI the user sees and interacts with.

**You will be provided with user analytics, topic and app history as context to make the most engaging interaction for the user.**

The schema you have to adhere to will be given at the end. 
<Setup>

We provide you with the starter code of the component, including many common imports and a basic structure. What you generate will be appended to the string.

* The component will be a .svelte file. We're using Svelte 5 with its new 'runes' api. Migration info below.
* For styling use TailwindCSS. 
* The imports include Shadcn components you can use.
* You are encouraged to leverage Svelte's features like motion, animation etc.

</Setup>

<StartOfComponent>
${dynamicComponentStarterMarkup}
</StartOfComponent>


<States>

### Dispatch and Global State
The 'dispatch' function let's you dispatch actions to the store. 
The dispatch takes a type and a payload. {type, payload}. 
Type could be 'requested-hint', 'selected-choice', 'requested-solution', 'highlighted-paragraph', 'requested-definition', 'requested-explainer' 

There's other actions that get triggered in parent components, for example, 'submitted-answer'. You don't have to worry about them but if some of your UI depends on that state change you can read it out with actions.hasSubmitted. Actions is a class instance and all properties are reactive value. That means you cannot use javascript destructuring like {hasSubmitted} (no-go!). You have to always read them with actions.hasSubmitted.

In the store it gets added to the list of actions and is automatically given an Id and timestamp. At certain intervals the actionStore gets persisted into the DB for later analyzing user behavior, learning, preferences, interests and knowledge (by AIs or human experts).

By default only the last value per type get's saved to the database. Example: If there's a text-input field we only save the most recent value, ie. "abc" and not the otherwise ["a", "ab", "abc"].

### Local State
If an action is just to manage the UI, like a hover or mouse move, you can keep that state locally as normally with Svelte. 
Meaningful actions, which includes everything that can teach us something about the user and we should persist, should be dispatched to the store.
For example, a user requesting a hint instead of solving the task himself is a meaningful action, but then if the user shows/hides the hint button multiple times in the same interaction that's not meaningful. 

</States>

<Svelte5RunesMigrationInfo>
${SvelteRunesExplainer}
</Svelte5RunesMigrationInfo>

<Gotchas>
Example of updating state
  let progress = $state(0);
  //let is ok. If it was 'const progress = ...' it would throw on error on reassignment
  const updateProgress = () => {
    progress = Math.min(100, progress + 20);
    dispatch({ type: 'progress-update', payload: progress });
  };
</Gotchas>

<Context>
${mockContext}
</Context>
`

export default {
  description: 'Dynamically Generates a Svelte component for the user to interact with.',
  prompt,
  // params: z.any(),
  schema: z
    .string()
    .describe(
      'The Svelte component markup to be appended to the starter component ie. <StartOfComponent>. Do not forget to close the script tag and add svelte markup'
    ),
}
