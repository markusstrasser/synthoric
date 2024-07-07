import { writable, get } from 'svelte/store'

export type UserAction = {
  type: string
  id: string
  value: any
  displayIndex?: number //? this is mostly for the AI to see where things were on the screen and to discern between multiple inputs from the same element
  timestamp?: number
  hasSubmitted?: boolean
  // Add any other properties that might be in the payload
}

const store = writable<{
  userActions: UserAction[]
  hasSubmitted: boolean //TODO: make this work for multiple components with multiple "interactions" on screen, ie.a multiple choice + freeform input but one solution unhides on mc-submit the other one freeform-submit. How to bind declaratively?
}>({
  userActions: [],
  hasSubmitted: false,
})

export const addUserAction = (action: UserAction) => {
  store.update(state => ({
    ...state,
    userActions: [...state.userActions, { ...action, timestamp: Date.now() }],
  }))

  // Log the action
  console.log('Action added:', action)

  // If it's a final action, you might want to trigger some logic here
  if (action.hasSubmitted) {
    //? in both cases we want to trigger an update ...
    store.update(state => ({ ...state, hasSubmitted: true }))
    console.log('Submit action received:', action)
    // Here you could trigger DB save or any other "finalization" logic
    const processedActions = filterUserActions(get(store).userActions)
    console.log('Processed actions for DB submission:', processedActions)
    // Reset or clean up if necessary
    // store.update(state => ({ ...state, userActions: [] }))
  }
}

export const resetInteraction = () => {
  store.update(state => ({ ...state, userActions: [] }))
  store.update(state => ({ ...state, hasSubmitted: false }))
}

function filterUserActions(actions: UserAction[]): UserAction[] {
  const grouped = Object.groupBy(actions, action => action.type)
  //@ts-ignore
  return Object.values(grouped).map(group => group.sort((a, b) => b.timestamp - a.timestamp)[0])
}

export default store
