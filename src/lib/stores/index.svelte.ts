import type { UserAction } from '../schemas/index.js'

let userActions = $state([])

function filterUserActions(actions: UserAction[]): UserAction[] {
  const grouped = Object.groupBy(actions, action => action.type)
  //@ts-ignore
  return Object.values(grouped).map(group => group.sort((a, b) => b.timeStamp - a.timeStamp)[0])
}
let hasSubmitted: boolean = $derived(!!userActions.find(action => action.hasSubmitted))
let filteredUserActions = $derived(filterUserActions(userActions))
const reset = () => {
  newSubmit = false
  userActions = []
  revealedMultipleChoices = false
  // hasSubmitted = false
}

// Debug store
let debugInfo = $state({})

export const clearDebugInfo = () => {
  debugInfo = {}
}

export const setDebugInfo = (info: any) => {
  debugInfo = info
}
let newSubmit: boolean = $state(false)
let revealedMultipleChoices: boolean = $state(false)

const actionState = {
  //? if you want to destructure the store in the component use {a,b} = $derived(store) if not store.a ...
  get userActions() {
    return userActions
  },
  get revealedMultipleChoices() {
    return revealedMultipleChoices
  },
  set revealedMultipleChoices(value: boolean) {
    revealedMultipleChoices = value
  },
  get newSubmit() {
    return newSubmit
  },
  set newSubmit(value: boolean) {
    newSubmit = value
  },
  set userActions(actions: UserAction[]) {
    userActions = actions
  },
  syncUserActions(userActions: UserAction[]) {
    if (!userActions) {
      this.reset()
      return
    }
    this.userActions = userActions
    this.newSubmit = false
  },
  get hasSubmitted() {
    return hasSubmitted
  },
  get filteredUserActions() {
    return filteredUserActions
  },
  reset,
  // hasSubmitted = false
  get debugInfo() {
    return debugInfo
  },
  setDebugInfo,
  clearDebugInfo,
}
export const addUserAction = (action: UserAction) => {
  if (action.hasSubmitted) {
    actionState.newSubmit = true
  }
  if (action.type === 'revealedMultipleChoices') {
    actionState.revealedMultipleChoices = true
  }
  userActions.push({ ...action, timeStamp: Date.now() })
}
export default actionState
