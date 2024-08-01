import type { UserAction } from '../schemas/index.js'

export class ActionState {
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

export const dispatch = (type: string, action: UserAction, config: Record<string, any> = {}) => {
  // Check for keyword clashes between config and action
  const clashingKeys = Object.keys(config).filter(key => key in action)

  if (clashingKeys.length > 0) {
    throw new Error(
      `Keyword clash detected between config and action. Clashing keys: ${clashingKeys.join(', ')}`
    )
  }

  if (action.hasSubmitted) {
    actionState.newSubmit = true
  }
  if (type === 'revealedMultipleChoices') {
    actionState.revealedMultipleChoices = true
  }
  actionState.userActions = [
    ...actionState.userActions,
    { type, ...config, ...action, timeStamp: Date.now() },
  ]
}

export const createDispatch = (type: string, config: Record<string, any>) => {
  return (action: UserAction) => dispatch(type, action, config)
}

export default actionState
