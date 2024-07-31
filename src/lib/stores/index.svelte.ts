import type { UserAction } from '../schemas/index.js'

class ActionState {
  userActions = $state<UserAction[]>([])
  revealedMultipleChoices = $state(false)
  newSubmit = $state(false)

  hasSubmitted = $derived(!!this.userActions.find(action => action.hasSubmitted))
  filteredUserActions = $derived(this.filterUserActions(this.userActions))

  filterUserActions(actions: UserAction[]): UserAction[] {
    const grouped = Object.groupBy(actions, action => action.type)
    //@ts-ignore
    return Object.values(grouped).map(group => group.sort((a, b) => b.timeStamp - a.timeStamp)[0])
  }

  reset() {
    this.newSubmit = false
    this.userActions = []
    this.revealedMultipleChoices = false
  }

  syncUserActions(userActions: UserAction[]) {
    if (!userActions) {
      this.reset()
      return
    }
    this.userActions = userActions
    this.newSubmit = false
  }
}

const actionState = new ActionState()

export const createDispatch = (config = {}) => {
  const dispatch = (action: UserAction) => {
    if (action.hasSubmitted) {
      actionState.newSubmit = true
    }
    if (action.type === 'revealedMultipleChoices') {
      actionState.revealedMultipleChoices = true
    }
    actionState.userActions = [
      ...actionState.userActions,
      { ...config, ...action, timeStamp: Date.now() },
    ]
  }
  return dispatch
}

export default actionState
