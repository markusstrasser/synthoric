import { z } from 'zod'

const knowledgeComponentExamples = `
"""Example of specific Knowledge Components:"""
[
  Understanding that internal energy is a state function and depends only on the current state of the system
  Knowing that heat and work are path functions and depend on the process
  Applying the first law of thermodynamics (conservation of energy)
  Recognizing that the change in internal energy is equal to the sum of heat added to the system and work done by the system
  Being able to express the first law mathematically as ΔU = Q + W
  Identifying the sign convention for heat transfer
  Knowing that heat added to the system is positive (Q > 0)
  Knowing that heat rejected from the system is negative (Q < 0)
  Solving for work using the given values of change in internal energy and heat transfer
  Identifying the three main components of a nucleotide: a phosphate group, a sugar (deoxyribose in DNA, ribose in RNA), and a nitrogenous base
  Knowing that the 5' end of a nucleic acid has a phosphate group, while the 3' end has a hydroxyl group
  Recognizing that DNA replication is semi-conservative, meaning each daughter strand contains one original parent strand and one newly synthesized strand
  Understanding that DNA polymerase can only add nucleotides to the 3' end of a growing DNA strand
  Identifying the three stages of transcription: initiation, elongation, and termination
  Knowing that mRNA, tRNA, and rRNA are the three main types of RNA involved in protein synthesis
  Recognizing that codons are three-base sequences in mRNA that code for specific amino acids
  Understanding that ribosomes consist of a large and a small subunit, which come together during translation
  Knowing that a reinforcer is a stimulus that increases the likelihood of a behavior occurring again
  Recognizing that a primary reinforcer is inherently rewarding (e.g., food, water), while a secondary reinforcer is learned (e.g., money, praise)
  Understanding that continuous reinforcement schedules provide reinforcement after every desired behavior, while intermittent schedules provide reinforcement only after some instances of the behavior
  Identifying the four intermittent reinforcement schedules: fixed-ratio, variable-ratio, fixed-interval, and variable-interval
  Knowing that the law of mass action states that the rate of a chemical reaction is proportional to the product of the concentrations of the reactants
  Recognizing that the equilibrium constant (K) is temperature-dependent but does not depend on the initial concentrations of reactants or products
  Understanding that a large K value indicates that the equilibrium favors the products, while a small K value indicates that the equilibrium favors the reactants
  Identifying that the equilibrium position can be shifted by changing the concentration of reactants or products, the pressure (for gaseous reactions), or the temperature
  Knowing that adding a catalyst to a reaction lowers the activation energy but does not change the equilibrium constant or the equilibrium position
  Understanding that the order of a reaction with respect to a particular reactant is the exponent to which its concentration is raised in the rate law
  Knowing that a first-order reaction has a rate that depends linearly on the concentration of a single reactant
]`

//TODO: each inference has implications?
const sourceSchema = z.object({
  sourceId: z.string().describe('Can be an inference OR interaction id'),
  whyRelevant: z.string().describe('Why is this source relevant to the inference?'),
  weight: z.number().min(0).max(1).describe('The weight of the source in the inference'),
})
import type { AIToolConfig } from '../createEnhancedAITool'
export default {
  description: 'Generate Insights from the users interaction history and previous insights',
  prompt: `
  From the Context provided, generate a list of knowledge components that are as specific and fine-grained as possible. These components should cover the various skills, concepts, and problem-solving techniques required to answer the question correctly. Examples of such components include:
  
  - Specific mathematical operations or algebraic manipulations
  - Understanding and applying particular scientific laws or principles
  - Ability to interpret and analyze graphs or diagrams
  - Recognizing and applying problem-solving strategies
  - Recalling and using domain-specific facts or formulas
  
  The generated knowledge components should be detailed enough to capture the nuances of the problem and the user's demonstrated abilities. Multiple components may be required to fully characterize a single interaction.
  
  ${knowledgeComponentExamples}
  
  Do not assume that the user's ability to answer one question implies a broad understanding of the topic. Instead, focus on the specific skills and knowledge directly applied in answering that particular question.
  `,
  schema: z.object({
    type: z
      .enum([
        //interest,
        //preference
        'knowledge', // Includes conceptual, procedural, and metacognitive knowledge
        'skill', // Includes cognitive and emotional skills
        'misconception',
        'other',
      ])
      .describe('The type of knowledge component'),
    assumedMasteryLevel: z.number().min(0).max(1),
    //implications:
    systemConfidence: z
      .number()
      .min(0)
      .max(1)
      .describe("How confident YOU are in your prediction about the user's knowledge"),
    sources: z.array(sourceSchema).describe('The evidence/sources that support the inference'),
  }),
} as const
