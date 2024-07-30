export const ApplicationExplainer = `
You are an AI for a new generation of AI powered learning app.`

const deleted = `
* Avoid breaking the fourth wall
* If it fits and you have adequate context, quickly point out previous interactions and knowledge to tie in your current interaction to leverage interweaving (interleaved practice) effects
`

export const ContentGuidelinePrompt = `
<Content Guidelines>
  Follow these guidelines to improve content, representation, and user experience:

  Cognitive Load and Understanding:
  • Test for understanding and intuition
  • Leverage cognitive science research on reducing extraneous cognitive load
  • If not distracting, use previous content/context the user has already loaded into his working memory

  Presentation and Ergonomics:
  • Use Markdown formatting for better readability
  • Use SI units for consistency
  • Use easily calculable numbers to test concept knowledge, not calculator skills
  • Mention if a problem might require a calculator

  Problem Framing:
  • Avoid instructional preamble
  • Minimize problem framing to encourage independent thinking
  • Don't specify which formulas to use or categorize the problem type
  • Avoid mentioning underlying principles unless necessary for context/explanation

  Key Principles:
  1. Prioritize conceptual understanding over rote calculation
  2. Encourage independent problem-solving approaches
  4. Maintain consistency in units and formatting
  5. Adapt to the user's current knowledge state when appropriate
</Content Guidelines>
`

export const ActionSelfTagPrompt = `Preface your response with the corresponding pedagogic or procedural state. Ie. "testing subcomponents", "digging deeper into weakness", "solidifying concept B", "remediating X" and so on`

export const ShortCutPrompt: string = `
** Shortcuts**  
The user response can be a one letter shortcut like below:
- "H" for hint: give a meaningful hint. If possible not formulas directly but a path for the user to find the correct approach. 

Admin Shortcuts [for the app developers to debug the prompts]
- "I" for inference: reveal declarative knowledge components you think the user has and has not (knowledge tree)
`
export const DebugPrompt: string = `The "debug" key in the schema given is for a short explanation for your response given the information you had -- no worries only our developers will see it, not the user`

export const MarkdownFormattingPrompt = `Your output will be displayed in Markdown that supports remarkGfm and rehypeKatex in case you need to display math formulas or code blocks
. Example formatting for math:
Inline: $a^2 + b^2 = c^2$
Block:
$$
\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}
$$
--
Use Markdown features to format your response and lower the time and mental effort for the user to understand the problem
`

export const defaultStudentDescription =
  ' If not enough context on the student is provided assume a smart high school or beginning undergraduate students. '

//${inference.schema.map()}

export const SvelteRunesExplainer = `


Introducing runes
Rethinking 'rethinking reactivity'

The Svelte team Sep 20 2023


On this page
In 2019, Svelte 3 turned JavaScript into a reactive language. Svelte is a web UI framework that uses a compiler to turn declarative component code like this...

App.svelte
<script>
	let count = 0;

	function increment() {
		count += 1;
	}
</script>

<button on:click={increment}>
	clicks: {count}
</button>

...into tightly optimized JavaScript that updates the document when state like count changes. Because the compiler can 'see' where count is referenced, the generated code is highly efficient, and because we're hijacking syntax like let and = instead of using cumbersome APIs, you can write less code.

A common piece of feedback we get is 'I wish I could write all my JavaScript like this'. When you're used to things inside components magically updating, going back to boring old procedural code feels like going from colour to black-and-white.

Svelte 5 changes all that with runes, which unlock universal, fine-grained reactivity.


Introducing runes
Before we beginpermalink
Even though we're changing how things work under the hood, Svelte 5 should be a drop-in replacement for almost everyone. The new features are opt-in — your existing components will continue to work.

We don't yet have a release date for Svelte 5. What we're showing you here is a work-in-progress that is likely to change!

What are runes?permalink
rune /ro͞on/ noun

A letter or mark used as a mystical or magic symbol.

Runes are symbols that influence the Svelte compiler. Whereas Svelte today uses let, =, the export keyword and the $: label to mean specific things, runes use function syntax to achieve the same things and more.

For example, to declare a piece of reactive state, we can use the $state rune:

App.svelte
<script>
	let count = $state(0);

	function increment() {
		count += 1;
	}
</script>

<button on:click={increment}>
	clicks: {count}
</button>

At first glance, this might seem like a step back — perhaps even un-Svelte-like. Isn't it better if let count is reactive by default?

Well, no. The reality is that as applications grow in complexity, figuring out which values are reactive and which aren't can get tricky. And the heuristic only works for let declarations at the top level of a component, which can cause confusion. Having code behave one way inside .svelte files and another inside .js can make it hard to refactor code, for example if you need to turn something into a store so that you can use it in multiple places.

Beyond componentspermalink
With runes, reactivity extends beyond the boundaries of your .svelte files. Suppose we wanted to encapsulate our counter logic in a way that could be reused between components. Today, you would use a custom store in a .js or .ts file:

counter.js
import { writable } from 'svelte/store';

export function createCounter() {
	const { subscribe, update } = writable(0);

	return {
		subscribe,
		increment: () => update((n) => n + 1)
	};
}

Because this implements the store contract — the returned value has a subscribe method — we can reference the store value by prefixing the store name with $:

App.svelte
<script>
	import { createCounter } from './counter.js';

	const counter = createCounter();
</script>

<button on:click={counter.increment}>
	clicks: {$counter}
</button>

This works, but it's pretty weird! We've found that the store API can get rather unwieldy when you start doing more complex things.

With runes, things get much simpler:

counter.svelte.js

export function createCounter() {
	let count = $state(0);

	return {
		get count() { return count },
		increment: () => count += 1
   };
}

App.svelte
<script>
	import { createCounter } from './counter.svelte.js';

	const counter = createCounter();
</script>

<button on:click={counter.increment}>
	clicks: {counter.count}
</button>

Outside .svelte components, runes can only be used in .svelte.js and .svelte.ts modules.

Note that we're using a get property in the returned object, so that counter.count always refers to the current value rather than the value at the time the function was called.

Runtime reactivitypermalink
Today, Svelte uses compile-time reactivity. This means that if you have some code that uses the $: label to re-run automatically when dependencies change, those dependencies are determined when Svelte compiles your component:

<script>
	export let width;
	export let height;

	// the compiler knows it should recalculate 'area'
	// when either 'width' or 'height' change...
	$: area = width * height;

	// ...and that it should log the value of 'area'
	// when _it_ changes
	$: console.log(area);
</script>

This works well... until it doesn't. Suppose we refactored the code above:

const multiplyByHeight = (width) => width * height;
$: area = multiplyByHeight(width);

Because the $: area = ... declaration can only 'see' width, it won't be recalculated when height changes. As a result, code is hard to refactor, and understanding the intricacies of when Svelte chooses to update which values can become rather tricky beyond a certain level of complexity.

Svelte 5 introduces the $derived and $effect runes, which instead determine the dependencies of their expressions when they are evaluated:

<script>
	let { width, height } = $props(); // instead of 'export let'

	const area = $derived(width * height);

	$effect(() => {
		console.log(area);
	});
</script>

As with $state, $derived and $effect can also be used in your .js and .ts files.

Signal boostpermalink
Like every other framework, we've come to the realisation that Knockout was right all along.

Svelte 5's reactivity is powered by signals, which are essentially what Knockout was doing in 2010. More recently, signals have been popularised by Solid and adopted by a multitude of other frameworks.

We're doing things a bit differently though. In Svelte 5, signals are an under-the-hood implementation detail rather than something you interact with directly. As such, we don't have the same API design constraints, and can maximise both efficiency and ergonomics. For example, we avoid the type narrowing issues that arise when values are accessed by function call, and when compiling in server-side rendering mode we can ditch the signals altogether, since on the server they're nothing but overhead.

Signals unlock fine-grained reactivity, meaning that (for example) changes to a value inside a large list needn't invalidate all the other members of the list. As such, Svelte 5 is ridonkulously fast.

Simpler times aheadpermalink
Runes are an additive feature, but they make a whole bunch of existing concepts obsolete:

the difference between let at the top level of a component and everywhere else
export let
$:, with all its attendant quirks
different behaviour between <script> and <script context="module">
$$props and $$restProps
lifecycle functions (things like afterUpdate can just be $effect functions)
the store API and $ store prefix (while stores are no longer necessary, they are not being deprecated)
For those of you who already use Svelte, it's new stuff to learn, albeit hopefully stuff that makes your Svelte apps easier to build and maintain. But newcomers won't need to learn all those things — it'll just be in a section of the docs titled 'old stuff'.

This is just the beginning though. We have a long list of ideas for subsequent releases that will make Svelte simpler and more capable.

Try it!permalink
You can't use Svelte 5 in production yet. We're in the thick of it at the moment and can't tell you when it'll be ready to use in your apps.

But we didn't want to leave you hanging. We've created a preview site with detailed explanations of the new features and an interactive playground. You can also visit the #svelte-5-runes channel of the Svelte Discord to learn more. We'd love to have your feedback!
`
