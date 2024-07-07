export type UserAction = {
  type: string
  id: string
  value: any
  displayIndex?: number //? this is mostly for the AI to see where things were on the screen and to discern between multiple inputs from the same element
  timestamp?: number
  hasSubmitted?: boolean
  // Add any other properties that might be in the payload
}

let userActions = $state([{ type: 'init' }])

export const addUserAction = (action: UserAction) => {
  userActions.push({ ...action, timestamp: Date.now() })
}

function filterUserActions(actions: UserAction[]): UserAction[] {
  const grouped = Object.groupBy(actions, action => action.type)
  //@ts-ignore
  return Object.values(grouped).map(group => group.sort((a, b) => b.timestamp - a.timestamp)[0])
}
let hasSubmitted: boolean = $derived(!!userActions.find(action => action.hasSubmitted))
let filteredUserActions = $derived(filterUserActions(userActions))
const reset = () => {
  userActions = []
  // hasSubmitted = false
}
export default {
  //? if you want to destructure the store in the component use {a,b} = $derived(store) if not store.a ...
  get userActions() {
    return userActions
  },
  get hasSubmitted() {
    return hasSubmitted
  },
  get filteredUserActions() {
    return filteredUserActions
  },
  reset,
  // hasSubmitted = false
}
