import type { UserAction } from '../schemas/index.js'
import Tools from '$lib/tools'

const post = async (route: string, payload: object) => {
  try {
    const response = await fetch(route, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return response.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function handleInteraction(type: string, payload: any) {
  switch (type) {
    case 'REQUEST_HINT':
    // return await Tools.Hint.execute(payload)
    case 'REQUEST_INSIGHTS':
      return await Tools.UserInsight.execute(payload)
    case 'REQUEST_SKIP':
      // Implement skip logic
      return { content: 'Skipping to next interaction...' }
    case 'REQUEST_NEXT':
      // Implement next interaction logic
      return { content: 'Moving to next interaction...' }
    case 'REQUEST_REFRESHER':
      // Implement refresher content generation
      return {
        content: "<h2>Refresher Content</h2><p>Here's a quick refresher on the topic...</p>",
      }
    case 'REQUEST_HELP':
      // Implement help content generation
      return { content: "<h2>Help Content</h2><p>Here's some help with the current problem...</p>" }
    default:
      throw new Error(`Unsupported interaction type: ${type}`)
  }
}

export const machine = {}

const state2Components = {
  REQUEST_HINT: {},
}

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
    actionState.userActions = [...actionState.userActions, { ...action, timeStamp: Date.now() }]
  }
  return dispatch
}

export default actionState
