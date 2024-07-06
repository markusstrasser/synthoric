import jsyaml from 'js-yaml'
import { compressInteractionsforLLM, omit } from './utils'

//@ts-ignore
export default ({ interactions, inferences, seqIndex, tagline }) => {
  //TODO: filter interaction keys and summarize. use partition func

  const currentSequenceInteractions = compressInteractionsforLLM(
    //@ts-ignore
    interactions.filter(i => i.seqIndex === seqIndex).map(i => omit(['_id'], i))
  )
  const otherSequencesInteractions = compressInteractionsforLLM(
    //@ts-ignore
    interactions.filter(i => i.seqIndex !== seqIndex).map(i => omit(['_id'], i))
  )
  const infs = jsyaml.dump(omit(['_id', '_creationTime', 'sources'], inferences), {
    skipInvalid: true,
  })

  return `
  <context>
  
  You are given the following history and user insights:
  1. 'tagline': the topic/tagline of the current learning Sequence.
  2. 'interactions': the previous history of interactions the user engaged with within our App. This includes the actions taken within a dynamic UI component (key 'useractions'), often with additional information (timeElapsed etc.). for you to consider.
  3. 'inferences' : the previous inferences and learning insights another AI System made about the user ie. assumed/inferred knowledge, skills, abilities, etc.)

    The topic/tagline of the current learning Sequence is: 
    <LearningSequenceTopic>
    ${tagline}
    </LearningSequenceTopic>
    <interactions>
      <from-current-learning-sequence>
      ${currentSequenceInteractions}
      </from-current-learning-sequence>

      <from-other-sequences>
      ${otherSequencesInteractions}
      </from-other-sequences>
    </interactions>

    <inferences>
    ${infs}
    </inferences>
  </context>
    `
}
