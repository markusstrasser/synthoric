import { z } from 'zod'
import { ApplicationExplainer, SvelteRunesExplainer } from '$prompts'
import { readFile, readFolderContents } from '../file'
import { anthropicClaude } from '$lib/providers'
const mockContext = `

* The current topic is classical mechanics.
* The user is a high school AP or college freshman.
* The user likes elegant styling
`

// <shadcn>
// ${readFolderContents('src/components/ui', 4)}
// </shadcn>
// <StartOfComponent>
//   ${dynamicComponentStarterMarkup}
// </StartOfComponent>
// Custom Components
// import SolutionReview from "$components/core/SolutionReview.svelte";
// import GridMultiSelect from "$components/core/GridMultiSelect.svelte";
// import MultipleChoice from "$components/core/MultipleChoice.svelte";
// import Tree from "$components/core/Tree.svelte";
// import Markdown from "$components/core/Markdown.svelte";

export const dynamicComponentStarterMarkup = `
<script lang="ts">
  //Shadcn components
import { Tabs, TabsList, TabsTrigger, TabsContent } from "$components/ui/tabs";
import {  FormField, FormLabel, FormControl, FormDescription, FormFieldset, FormLegend } from "$components/ui/form";
import { Tooltip, TooltipTrigger, TooltipContent } from "$components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "$components/ui/card";
import { Input } from "$components/ui/input";
import { Skeleton } from "$components/ui/skeleton";
import { Label } from "$components/ui/label";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuRadioGroup } from "$components/ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "$components/ui/dialog";
import { Button } from "$components/ui/button";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "$components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectLabel } from "$components/ui/select";



import actions from '$stores/index.svelte'
  import { createDispatch, dispatch} from '$stores/index.svelte'

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



<States>

### Dispatch and Global State
The 'dispatch' function let's you dispatch actions to the store. 
The dispatch takes a type and a payload. {type, payload}. 
Type could be 'requested-hint', 'selected-choice', 'requested-solution', 'highlighted-paragraph', 'requested-definition', 'requested-explainer' 

There's other actions that get triggered in parent components, for example, 'submitted-answer'. You don't have to worry about them but if some of your UI depends on that state change you can read it out with actions.hasSubmitted. Actions is a class instance and all properties are reactive value. That means you cannot use javascript destructuring like {hasSubmitted} (no-go!). You have to always read them with actions.hasSubmitted.

In the store it gets added to the list of actions and is automatically given an Id and timestamp. At certain intervals the actionStore gets persisted into the DB for later analyzing user behavior, learning, preferences, interests and knowledge (by AIs or human experts).

By default only the last value per type get's saved to the database. Example: If there's a text-input field we only save the most recent value, ie. "abc" and not the otherwise ["a", "ab", "abc"].

For your reference the implementation of the store is here:

<actionStore-code>
${readFile('src/lib/stores/index.svelte.ts')}
</actionStore-code>

Only the entry component (the one you write) should actually dispatch actions since the utility/ui svelte components should be kept 'dumb'.
For example if you want to update the store based on a child component state change you can do this:

<example-dispatch>
<SolutionReview
  title={mockSolutionReviewData.title}
  sections={mockSolutionReviewData.sections}
  steps={mockSolutionReviewData.steps}
  onSelect={createDispatch('selected-solution-step')}
/>
//createDispatch returns a dispatch function with the type (selected-solution-step) curried into.
</example-dispatch>
Of course you can also create a custom onSelect function that changes your $state for custom local logic and then use an $effect to dispatch to the store.  Your choice.





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

<Component-Documentation>
Here's the info on how to use the imported components and utils:
    <component-info>
    ${readFolderContents('src/components/core', 4)}
    ${readFolderContents('src/components/ui/form', 4)}

  </component-info>

</Component-Documentation>

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
  {
  "content": 
  // State variables
  let currentStep = $state(0);
  let userAnswer = $state('');
  let feedback = $state('');
  ....
  ..
</WRONG-output>
THis is wrong because it would result in the following string:

"""
  $effect(() => {
    //this will track changes run every time listLength changes
    console.log(listLength)
    dispatch({type: 'list-length', payload: listLength})
  })

  */
  //Your code and svelte html/markup + tailwind below ...  ->

    {
  "content": 
  // State variables
  let currentStep = $state(0);
  let userAnswer = $state('');
  let feedback = $state('');

  ...
"""
THIS WOULD CAUSE A FORMATTING ERROR SINCE IT"S NOT CORRECT SVELTE MARKUP.
DO NOT USE any <style></style> tags. EVERYTHING MUST BE TAILWIND inline.

ONLy use components and UI elements where you are reasonable certain about how they work.
`

export const generateDynamicInterface = async () => {
  const prefill = dynamicComponentStarterMarkup
  try {
    const response = await anthropicClaude.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 2024,
      system: prompt,
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

export default {
  description: 'Dynamically Generates a Svelte component for the user to interact with.',
  prompt,
  prefill: dynamicComponentStarterMarkup,
  // params: z.any(),
  schema: z
    .string()
    .describe(
      'The Svelte component markup to be DIRECTLY appended to the starter setup code provided. Your generated code will be Direclty added after the provided setup code inside of <StartOfComponent>, ie. markup = ${providedCode} + ${yourCode}. The result has to be valid svelte code'
    ),
}
