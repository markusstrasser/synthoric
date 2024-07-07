//TODO: add mocks
import { mockInteraction, mockMulitpleChoice } from '$lib/mocks'

import Tools from '$lib/tools/'

const mocks = [mockInteraction, mockMulitpleChoice]

export const interactionMock = async () =>
  await new Promise(resolve =>
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mocks.length)
      resolve(mocks[randomIndex])
    }, 1000)
  )
