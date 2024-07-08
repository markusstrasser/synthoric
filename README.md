# Synth

## Setup

`pnpm install && pnpm dev`

Get a convex api key for local development
`pnpm convex dev`

## Abstractions

**AI**

- Orchestrator/Dispatcher takes in context and puts out params for the next interaction
- UI tools (multichoice, exercise) still have their own prompts and guidelines but the params (tone, topic, sequenceInfo, DB-context, misconceptions) are passed in as suffix
- This then gives the "tools" abstraction in that they have their own prompt, description, schema and description, a generate/execute - taking params - function for the orchestrator, examples
- Agent:Multistep, Tool: SingleStep

  **UI**

- Interaction UI and componentMap: an interactionConfig gets mapped into the respective components (task->Markdown, solution-> solutionReview etc.) based on the [key]. Including possibilities for conditional logic (hide/unhide given 'userActions' state).

## Gotchas

- Do not import anything into the /convex files that has dependencies like dotenv and so on. Convex has its own runtime.
- Svelte runes:
  1.  You can't export $derived(x) values directly
  2.  Either use a class, function or an object with get() and set() methods. The later you can't destructure because it won't be reactive. You can do {x} = $derived(storeJSObj) ... that would work but the reactivity won't be fine-grained I think
  3.  Good channel: https://www.youtube.com/watch?v=HnNgkwHZIII&t=601s

## TODO

- [ ] Unified state management synced local, session and db
- [ ] Custom svelte UserAction
- [ ] READ https://svelte-5-preview.vercel.app/docs/breaking-changes
- [ ] READ https://svelte.dev/blog/runes
- [ ] USE https://svelte-svg-icons.codewithshin.com/
- [ ] DEV: How to implement consistent mocking (MSW?) and route testing declaratively as a middleware

  - maybe a mock/_ route. The middleware redirect /_ -> mock/\* and the return is pattern matched

- [ ] More routing: back, next, home buttons. Redirect to beginning of page wrong path
- [ ] Decide on https://flaming.codes/en/posts/msw-in-sveltekit-for-local-development/ MSW
- [ ] Copy in your always used svelte actions
- [ ] use Abstractions like https://docs.copilotkit.ai/reference/hooks/useCopilotReadable?
- [ ] Svelte store (zustand copy)
- [ ] persist partial store (redirects/visited)
- [ ] at login, or leave app: cleanUnseenInteractions?
- [x] Fix the dotenv issues with importing api keys (provider.ts)
- [x] Fix prefixes $lib etc.
- [x] Just basic routing /seq/id/idx

### TODO / think about @**Markus**

- [ ] svelte html actions use:captureAction ? --> write to store? Can it add the {type:freeformtextinput}, spec:{freeformtextinput: {reducer: fn(bydefault: pickLatest), description, validation, isFinal?, isStep?, shouldInference--or use central point system??, or use AI to decide?}} etc?
- [ ] what to do about multiple generated UIs on a page and interspersed forms? SPAs?
- [ ] think about /explore /read /paper /research and how these abstraction work there
- [ ] createForm function '<form>...' as claude prefill
- [x] generateObject should only live inside tools and have the LLM fallbacks abstract the model: value and defaults
- [x] Should params -> prompt be passed in by the caller? then only non-prompt params are passed in effectively (aka dependencies?)
- [ ] hasSubmitted: boolean. Make the solution:unhide etc work for multiple components with multiple "interactions" on screen, ie.a multiple choice + freeform input but one solution unhides on mc-submit the other one freeform-submit. How to bind declaratively?

* Prompt Suffix / Prefix / slots?

- [ ] UseTool hook
- [ ] in "dev-mode" there should be a debug tagged to each schema
- [ ] .example outputs part of tools output (incl orchestrator... high quality params output)
- [ ] Model interactionSeq as chat with pluggable extra info before returning the object (streamObject or parallel tool calls??)
- [ ] solution/hint as a plugin?
- [ ] Vite plugin for generating tool types

---

**tool calling**

- [x] handle generating and posting sequentially page/index++ vs. at once ([1,2,3][3,4,5][5,3,2]) for displaying on a single page
- [x] pass down ultraspecific topic/difficulty prompts ... not params? configuration. This allows parallel generation without issues with interference/duplication of content
- [x] tool dispatcher has all needed context? Will pass subset to each tool? Or intermediaries that sample more ?
  - the tools stay "dumb" in that they only receive a full prompt, no params? maybe. The full prompt = prompt + context +slots

**Tools/Plugins todo. Libs**

- [ ] Make into tool: https://tympanus.net/codrops/2024/06/12/shape-lens-blur-effect-with-sdfs-and-webgl/
- [ ] Mathematica
- [ ] editorJS https://editorjs.io/
- [ ] https://svelte-ux.techniq.dev/docs/components/Table
- [ ] https://action-archive.vercel.app/actions/click-outside
- [ ] https://action-archive.vercel.app/actions/resize
- [ ] https://svelte-svg-icons.codewithshin.com/

## Overview

The goal is to make an AI-driven STEM learning platform that adapts content and interaction types to individual users, capturing and analyzing user actions to optimize the content and representations through generative UI.

### Key Features

- Adaptive AI-generated content and user interfaces
- Various interaction types: exercises, multiple-choice, binary-choice, timed tasks, minigames, simulations
- Spaced repetition system for optimized review
- Knowledge graph tracking individual components and user mastery
- Real-time content generation and selection
- Focus on reducing extraneous cognitive load
- Designed for self-learners
- Adaptive Metacognitive support and scaffolding

## Current Stack

- Svelte 5, Sveltekit 2
- Tailwind 4 Alpha
- Vercel ai sdk (after many hours wasted: I'm avoiding bug-ridden ai/rsc and sticking with core)
- DB: Convex
- Maybe soon : Sentry, Posthog, Clerk via Convex integration

## States and Events

Although I decided against using xState FSMs for now. Here's an [approximate state diagram](https://stately.ai/registry/editor/8aaa1898-9a0f-43e2-9fdb-d6571eee716c?machineId=6033e05b-5b3f-4ecf-be0c-aba9251e5e22) for when a user starts a learning sequence.

1. Home Page:

   - Initial state
   - Users choose a learning sequence

2. Sequence Selection:

   - Users select a specific learning sequence

3. Interaction Presentation:

   - AI-generated content is presented to users

4. User Interaction:

   - Users interact with presented content
   - Submit answers or solutions

5. Review Solution:

   - Users review the solution
   - Select the part they failed at

6. Submission Analysis:

   - User's submission is ranked

7. Knowledge Update:

   - User's knowledge state is updated
   - Users can proceed to next interaction or IFF the sequence is ended, show summary screen

8. Summary Screen:
   - Summary of the learning sequence is shown

The state machine guides users through the learning platform, enabling:

- Sequence selection
- Content interaction
- Solution review
- And the System does knowledge inference under conditions (each step or after _n_ interations)

## FAQs

**Q: How does the AI determine the best type of interaction for content?**

A: The AI selects the most appropriate interaction type by considering:

- User's current knowledge state
- Previous interactions
- Nature of the content

**Q: Is all content generated in real-time?**

A: The system uses a hybrid approach:

1. Performs an embedding search on existing content
2. Generates new content if necessary

**Q: How are spaced repetition schedules implemented?**

A: Schedules are personalized for each user, featuring:

- Partial hierarchical reviews
- Content variation along different dimensions
- Interleaving of topics

**Q: What is the structure of the knowledge graph?**

A: The knowledge graph consists of:

- Granular "knowledge atoms"
- Potential hierarchy
- Representation of specific concepts or skills within STEM subjects

**Q: How much control do users have over their learning path?**

A: Users can:

- Choose between different sequences on the homepage
- AI determines specific content and interaction types within each sequence

**Q: Can you describe the system architecture?**

A: The system includes:

- An 'interactions' table storing:
  - Tasks
  - Solutions
  - Hints
  - User actions
- Full architecture is still in development

## Thinking about:

- using https://github.com/transitive-bullshit/agentic tools
- using https://aceternity.sveltekit.io/components/
- https://runed.dev/docs/ : state-history and FSM claass
- https://github.com/svecosystem/svelte-interactions
- https://animation-svelte.vercel.app/
- https://animation-svelte.vercel.app/magic/marquee
