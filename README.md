# Synth

## Overview

The goal is to make an AI-driven STEM learning platform that adapts content and interaction types to individual users. It captures user actions and feeds them back into the content and ui generation process.

## Current Stack

- SvelteKit 5
- Tailwind 4 alpha
- Vercel ai sdk (after many hours wasted: I'm avoiding bug-ridden ai/rsc and sticking with core)
- DB: Convex
- (soon:) Sentry, Posthog, Clerk

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

## TODOs

- [ ] Unify /tools to have consistent API. Decide what is a tool (exercise, multipleChoice) and what not (hints, solution?)
- [ ] Update UI with current progress inside a agentChain (ie. show the task without having to wait for the rest of the task->solution chain to finish)
- [ ] use Abstractions like https://docs.copilotkit.ai/reference/hooks/useCopilotReadable?

## Thinking about:

- using https://github.com/transitive-bullshit/agentic tools
