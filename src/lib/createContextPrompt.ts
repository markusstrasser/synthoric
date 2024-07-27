import jsyaml from 'js-yaml'
import { summarizeInteraction, omit } from '$lib/utils/index'
import _ from 'lodash'
//@ts-ignore
export default ({ interactions, userInsights, sequence, knowledgeComponents }) => {
  const [currentSequenceInteractionsStr, otherSequencesInteractionsStr] = _.partition(
    interactions,
    i => sequence.interactions.includes(i._id)
  ).map(group => JSON.stringify(group.map(summarizeInteraction)))
  //'_creationTime'
  const infs = JSON.stringify(omit(['_id', 'sources'], userInsights))

  const { tagline } = sequence

  return `
  <context>
  
  You are given the following history and user insights:
  1. 'tagline': the topic/tagline of the current learning Sequence. If the topic is exhausted by previous interactions, please branch out to adjacent topics instead of repeating the same questions or exercises.
  2. 'interactions': the previous history of interactions the user engaged with within our App. This includes the actions taken within a dynamic UI component (key 'useractions'), often with additional information (timeElapsed etc.). for you to consider.
  3. 'userInsights' : the previous userInsights and learning insights another AI System made about the user ie. assumed/inferred knowledge, skills, abilities, etc.)

    The topic/tagline of the current learning Sequence is: 
    <LearningSequenceTopic>
    ${tagline}
    </LearningSequenceTopic>
    <interactions>
      <from-current-learning-sequence>
      ${currentSequenceInteractionsStr}
      </from-current-learning-sequence>

      <from-other-sequences>
      ${otherSequencesInteractionsStr}
      </from-other-sequences>
    </interactions>

    <userInsights>
    ${infs}
    </userInsights>
  </context>
    `
}
