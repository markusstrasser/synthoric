import { writable, get } from 'svelte/store'

type UserAction = {
  type: string
  id: string
  value?: any
  timestamp: number
  isFinal?: boolean
  // Add any other properties that might be in the payload
}

const store = writable<{
  userActions: UserAction[]
}>({
  userActions: [],
})

export const addUserAction = (action: UserAction) => {
  store.update(state => ({
    ...state,
    userActions: [...state.userActions, action],
  }))

  // Log the action
  console.log('Action added:', action)

  // If it's a final action, you might want to trigger some logic here
  if (action.isFinal) {
    console.log('Final action received:', action)
    // Here you could trigger DB save or any other "finalization" logic
    const processedActions = filterUserActions(get(store).userActions)
    console.log('Processed actions for DB submission:', processedActions)
    // Reset or clean up if necessary
    // store.update(state => ({ ...state, userActions: [] }))
  }
}

function filterUserActions(actions: UserAction[]): UserAction[] {
  const grouped = Object.groupBy(actions, action => action.type)
  //@ts-ignore
  return Object.values(grouped).map(group => group.sort((a, b) => b.timestamp - a.timestamp)[0])
}

export default store
