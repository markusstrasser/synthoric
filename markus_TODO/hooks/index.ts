import { api } from '@/convex/_generated/api'
import type { UserAction } from '@/lib/tsStructs'
import { useMutation } from 'convex/react'
import { useEffect, useRef, useState } from 'react'
import { useMutative } from 'use-mutative'
import { filterUserActions } from '../../src/lib/utils'
import { generateInferences, generateSubmissionReview } from '@/app/actions'

export function useInput() {
  const [input, setInput] = useState<string | number | any>('') // Generalize input state
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return { input, setInput, inputRef }
}

export function usePatchInteraction() {
  const patchUserActions = useMutation(api.interactions.patchUserActions)
  const patchSystemFeedback = useMutation(api.interactions.patchSystemFeedback)

  const patchInteraction = async (interaction, userActions) => {
    try {
      //? We only take the last value of the textinput for example (ie. "abc" would be "a", "ab", "abc" otherwise)
      const filteredActions = filterUserActions(userActions).filter(
        (action): action is UserAction => action !== undefined
      )

      await patchUserActions({
        interactionId: interaction._id,
        userActions: filteredActions,
      })

      // const inferences = await generateInferences(filteredActions)
      // console.log('INFERENCES RETURNED:', inferences)
    } catch (error) {
      console.error(error, 'ERROR at finalActionTriggered')
    }

    try {
      const review = await generateSubmissionReview({
        ...interaction,
        userActions,
      })
      await patchSystemFeedback({
        interactionId: interaction._id,
        systemFeedback: review,
      })
    } catch (error) {
      console.error(error, 'ERROR at finalActionTriggered')
    }
  }
  return { patchInteraction }
}
