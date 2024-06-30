import { assign, fromPromise, createMachine } from 'xstate'

const globalMachine = {
  id: 'global',
  types: {
    context: {} as { interactionCount: number; maxInteractions: number },
    events: {} as
      | { type: 'SELECT' | 'START' | 'CANCEL' | 'SUBMIT' | 'FINISH' }
      | { type: 'CONTINUE'; data: { shouldContinue: boolean } },
  },
  actions: {
    incrementInteraction: assign(({ context }) => ({
      interactionCount: context.interactionCount + 1,
    })),
  },
  guards: {
    canContinue: ({ context }) =>
      context.interactionCount < context.maxInteractions,
  },
  context: { interactionCount: 0, maxInteractions: 3 },
  initial: 'home',
  states: {
    home: { on: { SELECT: 'selection' } },
    selection: { on: { START: 'interaction', CANCEL: 'home' } },
    interaction: {
      entry: 'incrementInteraction',
      on: { SUBMIT: 'analysis' },
    },
    analysis: {
      invoke: {
        src: fromPromise(
          () =>
            new Promise((resolve) =>
              setTimeout(
                () => resolve({ shouldContinue: Math.random() > 0.5 }),
                1000,
              ),
            ),
        ),
        onDone: { target: 'update', actions: 'evaluateContinuation' },
      },
    },
    update: {
      on: {
        CONTINUE: [
          //? uses array syntax for transitions. checks sequentially until first match
          { guard: 'canContinue', target: 'interaction' },
          { target: 'summary' },
        ],
      },
    },
    summary: { on: { FINISH: 'home' } },
  },
}
export default createMachine(globalMachine)

// const StateRenderer: FC<StateProps> = ({ state, send }) => {
//   const stateComponents = {
//     home: (
//       <button onClick={() => send({ type: "SELECT" })}>Select Sequence</button>
//     ),
//     selection: (
//       <>
//         <button onClick={() => send({ type: "START" })}>Start Sequence</button>
//         <button onClick={() => send({ type: "CANCEL" })}>Cancel</button>
//       </>
//     ),
//     interaction: (
//       <button onClick={() => send({ type: "SUBMIT" })}>
//         Submit Interaction
//       </button>
//     ),
//     analysis: <div>Analyzing submission...</div>,
//     update: <div>Updating...</div>,
//     summary: <button onClick={() => send({ type: "FINISH" })}>Finish</button>,
//   };

//   return (
//     <div className="p-4 border rounded">
//       <h2 className="text-xl mb-2">Current State: {state.value as string}</h2>
//       <div className="mb-2">
//         Interaction Count: {state.context.interactionCount}
//       </div>
//       {stateComponents[state.value as keyof typeof stateComponents]}
//     </div>
//   );
// };
