import type { UserAction } from '../schemas/index.js'

export class ActionState {
  userActions = $state<UserAction[]>([])
  revealedMultipleChoices = $state(false)
  newSubmit = $state(false)

  hasSubmitted = $derived(!!this.userActions.find(action => action.hasSubmitted))
  actionsByType = $derived(Object.groupBy(this.userActions, action => action.type))
  filteredUserActions = $derived(
    Object.values(this.actionsByType).map(
      group => group.sort((a, b) => b.timeStamp - a.timeStamp)[0]
    )
  )

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

export const dispatch = (type: string, action: any, metaData: Record<string, any> = {}) => {
  if (action?.hasSubmitted) {
    actionState.newSubmit = true
  }
  if (type === 'revealedMultipleChoices') {
    actionState.revealedMultipleChoices = true
  }
  actionState.userActions.push({ type, ...action, metaData, timeStamp: Date.now() })
}

export const createDispatch =
  (type: string, metaData: Record<string, any> = {}) =>
  //? curry dispatch
  (action: any) => {
    // Check for keyword clashes between config and action
    const clashingKeys = Object.keys(metaData).filter(key => key in action)

    if (clashingKeys.length > 0) {
      throw new Error(
        `Keyword clash detected between config and action. Clashing keys: ${clashingKeys.join(', ')}`
      )
    }

    return dispatch(type, action, metaData)
  }

export default actionState
