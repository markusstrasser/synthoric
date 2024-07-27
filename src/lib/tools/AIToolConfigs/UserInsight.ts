import { ApplicationExplainer } from '../../prompts'
import { z } from 'zod'

// const knowledgeComponentExamples = `
// """Example of specific Knowledge Components:"""
// [
//   Understanding that internal energy is a state function and depends only on the current state of the system
//   Knowing that heat and work are path functions and depend on the process
//   Applying the first law of thermodynamics (conservation of energy)
//   Recognizing that the change in internal energy is equal to the sum of heat added to the system and work done by the system
//   Being able to express the first law mathematically as ΔU = Q + W
//   Identifying the sign convention for heat transfer
//   Knowing that heat added to the system is positive (Q > 0)
//   Knowing that heat rejected from the system is negative (Q < 0)
//   Solving for work using the given values of change in internal energy and heat transfer
//   Identifying the three main components of a nucleotide: a phosphate group, a sugar (deoxyribose in DNA, ribose in RNA), and a nitrogenous base
//   Knowing that the 5' end of a nucleic acid has a phosphate group, while the 3' end has a hydroxyl group
//   Recognizing that DNA replication is semi-conservative, meaning each daughter strand contains one original parent strand and one newly synthesized strand
//   Understanding that DNA polymerase can only add nucleotides to the 3' end of a growing DNA strand
//   Identifying the three stages of transcription: initiation, elongation, and termination
//   Knowing that mRNA, tRNA, and rRNA are the three main types of RNA involved in protein synthesis
//   Recognizing that codons are three-base sequences in mRNA that code for specific amino acids
//   Understanding that ribosomes consist of a large and a small subunit, which come together during translation
//   Recognizing that a primary reinforcer is inherently rewarding (e.g., food, water), while a secondary reinforcer is learned (e.g., money, praise)
//   Understanding that continuous reinforcement schedules provide reinforcement after every desired behavior, while intermittent schedules provide reinforcement only after some instances of the behavior
//   Identifying the four intermittent reinforcement schedules: fixed-ratio, variable-ratio, fixed-interval, and variable-interval
//   Knowing that the law of mass action states that the rate of a chemical reaction is proportional to the product of the concentrations of the reactants
//   Recognizing that the equilibrium constant (K) is temperature-dependent but does not depend on the initial concentrations of reactants or products
//   Understanding that a large K value indicates that the equilibrium favors the products, while a small K value indicates that the equilibrium favors the reactants
//   Identifying that the equilibrium position can be shifted by changing the concentration of reactants or products, the pressure (for gaseous reactions), or the temperature
//   Knowing that adding a catalyst to a reaction lowers the activation energy but does not change the equilibrium constant or the equilibrium position
//   Understanding that the order of a reaction with respect to a particular reactant is the exponent to which its concentration is raised in the rate law
//   Knowing that a first-order reaction has a rate that depends linearly on the concentration of a single reactant
// ]`
const goodKnowledgeComponentExamples = `
Knowledge components that align with our goals of specificity, atomicity, and clear distinction between types:

Applied Understanding: "Solving for work using given values of change in internal energy and heat transfer in a thermodynamic problem"
Skill: "Expressing the first law of thermodynamics mathematically as ΔU = Q + W"
Misconception: "Believing that adding a catalyst changes the equilibrium constant of a chemical reaction"
Declarative Knowledge: "Identifying that the 5' end of a nucleic acid has a phosphate group"
Skill: "Calculating the equilibrium constant (K) for a given chemical reaction at a specific temperature"
Skill: "Identifying the order of a chemical reaction from experimental rate data"

Declarative Knowledge: "Stating that the acceleration due to gravity on Earth's surface is approximately 9.8 m/s²"
Applied Understanding: "Interpreting the significance of a p-value being less than 0.05 in a statistical hypothesis test"
Skill: "Constructing a free-body diagram for an object on an inclined plane"
Misconception: "Believing that evolution always results in organisms becoming more complex"
Declarative Knowledge: "Recalling that the pH of a neutral solution at 25°C is 7"
Applied Understanding: "Explaining why the boiling point of water decreases at higher altitudes using the concept of vapor pressure"
Skill: "Balancing a redox reaction in acidic solution using the half-reaction method"
Declarative Knowledge: "Identifying the difference between scalar and vector quantities in physics"
Applied Understanding: "Predicting the effect of temperature on reaction rate using the Arrhenius equation"
Skill: "Calculating the half-life of a radioactive isotope given its decay constant"

Declarative Knowledge:"Identifying that the SI unit for electric current is the ampere (A)"
Applied Understanding:"Interpreting the slope of a position-time graph as the velocity of an object"
Skill:"Balancing a chemical equation by adjusting coefficients"
Misconception:"Believing that heavier objects always fall faster than lighter objects in a vacuum"
Declarative Knowledge:"Recalling that mitochondria are the primary site of ATP production in eukaryotic cells"
Applied Understanding:"Predicting the direction of current flow in a circuit based on the arrangement of voltage sources"
Skill:"Calculating the pH of a solution given its hydrogen ion concentration"
Declarative Knowledge:"Stating Newton's Second Law of Motion: F = ma"
Applied Understanding:"Explaining why the sky appears blue using the concept of Rayleigh scattering"
Skill: "Constructing a Punnett square to determine the probability of specific genetic outcomes"


These examples demonstrate:

Specificity: Each component describes a single, well-defined piece of knowledge or skill.
Atomicity: They are broken down into the smallest meaningful units.
Clear type distinction: Each fits clearly into one of the defined types (declarative knowledge, applied understanding, skill, misconception).
Measurability: These components can be directly assessed through targeted questions or problems.
Relevance: They represent important concepts in their respective fields (thermodynamics, molecular biology, chemical kinetics).
`

const almostButNotQuiteThereKnowledgeComponentExamplesWithExplanation = `
Almost: "Understanding the relationship between voltage, current, and resistance in Ohm's Law"
Better: "Stating Ohm's Law: V = IR"
Difference: The "almost" version is too broad and uses vague language ("understanding the relationship"). The better version is more specific and actionable.
Almost: "Knowing the parts of a plant cell"
Better: "Identifying the chloroplast as the site of photosynthesis in plant cells"
Difference: The "almost" version is a broad category rather than a specific piece of knowledge. The better version focuses on one specific fact about plant cells.
Almost: "Solving quadratic equations"
Better: "Applying the quadratic formula to solve an equation in the form ax² + bx + c = 0"
Difference: The "almost" version is too general. The better version specifies a particular method and form of equation.
Almost: "Understanding natural selection"
Better: "Explaining how a specific trait can become more common in a population over time due to environmental pressures"
Difference: The "almost" version is a broad concept. The better version focuses on a specific aspect of natural selection that can be more easily assessed.
Almost: "Knowing the periodic table"
Better: "Identifying the number of valence electrons for elements in the main group of the periodic table"
Difference: The "almost" version is too broad and vague. The better version focuses on a specific skill related to the periodic table.
Almost: "Calculating acceleration"
Better: "Determining an object's acceleration given its initial velocity, final velocity, and time interval"
Difference: The "almost" version doesn't specify the given information. The better version clearly outlines the parameters for the calculation.
Almost: "Understanding the water cycle"
Better: "Describing the role of evaporation in transferring water from Earth's surface to the atmosphere"
Difference: The "almost" version is a broad topic. The better version focuses on a specific process within the water cycle.
Almost: "Knowing about DNA structure"
Better: "Identifying adenine as the complementary base pair to thymine in DNA"
Difference: The "almost" version is too general. The better version focuses on a specific fact about DNA base pairing.
Almost: "Understanding magnetism"
Better: "Predicting the direction of the magnetic field around a straight current-carrying wire using the right-hand rule"
Difference: The "almost" version is a broad topic. The better version specifies a particular skill related to electromagnetism.
Almost: "Balancing chemical equations"
Better: "Determining the coefficient needed for oxygen to balance the equation: CH₄ + O₂ → CO₂ + H₂O"
Difference: The "almost" version is a general skill. The better version provides a specific example that can be directly assessed.

[before/after]
Before: "Knowing that heat added to a thermodynamic system is positive (Q > 0)"
After: "Stating that heat added to a thermodynamic system is positive (Q > 0)"
Explanation: The change from "Knowing" to "Stating" makes the component more action-oriented and directly assessable.

Before: "Recognizing that DNA replication is semi-conservative based on experimental results"
After: "Recognizing that DNA replication is semi-conservative based on the Meselson-Stahl experiment results"
Explanation: This change adds specificity by naming the key experiment, making the component more precise and informative.

Before: "Knowing that mRNA, tRNA, and rRNA are the three main types of RNA involved in protein synthesis"
After: "Listing the three main types of RNA involved in protein synthesis: mRNA, tRNA, and rRNA"
Explanation: Changing "Knowing" to "Listing" makes the component more action-oriented and clearly assessable.

Before: "Predicting how changing reactant concentration will shift the equilibrium position in a chemical reaction"
After: "Predicting how increasing reactant concentration will shift the equilibrium position towards the products in a chemical reaction"
Explanation: This change specifies the direction of concentration change and its effect, making the component more precise and demonstrating a deeper understanding of Le Chatelier's principle.

`
const subOptimalKnowledgeComponentExamplesWithExplanation = `
"Understanding that internal energy is a state function and depends only on the current state of the system"
Reason: This is too broad and combines multiple concepts. It could be broken down into more atomic components.
"Applying the first law of thermodynamics (conservation of energy)"
Reason: This is too general. It doesn't specify what kind of application or in what context.
"Identifying the three main components of a nucleotide: a phosphate group, a sugar (deoxyribose in DNA, ribose in RNA), and a nitrogenous base"
Reason: This combines multiple pieces of information. It could be split into several more specific components.
"Understanding that continuous reinforcement schedules provide reinforcement after every desired behavior, while intermittent schedules provide reinforcement only after some instances of the behavior"
Reason: This compares two concepts in one statement. It would be better to separate these into individual components.
"Knowing that the law of mass action states that the rate of a chemical reaction is proportional to the product of the concentrations of the reactants"
Reason: While specific, this is a complex concept that might be better broken down into more fundamental components.
"Understanding that ribosomes consist of a large and a small subunit, which come together during translation"
Reason: This combines structural information with a process. It could be split into more atomic components.
"Identifying the four intermittent reinforcement schedules: fixed-ratio, variable-ratio, fixed-interval, and variable-interval"
Reason: This is a list of items rather than a single, atomic piece of knowledge. Each schedule could be its own component.
"Recognizing that the equilibrium constant (K) is temperature-dependent but does not depend on the initial concentrations of reactants or products"
Reason: This combines two separate ideas (temperature dependence and independence from initial concentrations). It should be split.
"Understanding that the order of a reaction with respect to a particular reactant is the exponent to which its concentration is raised in the rate law"
Reason: While specific, this is a complex concept that might be intimidating for a single knowledge component. It could potentially be broken down further.
"Identifying that the equilibrium position can be shifted by changing the concentration of reactants or products, the pressure (for gaseous reactions), or the temperature"
Reason: This lists multiple factors affecting equilibrium. Each factor could be its own knowledge component.

The main reasons these didn't make the cut are:

Complexity: They often combine multiple concepts or ideas.
Lack of specificity: Some are too broad or general.
Listedness: Some are essentially lists of items rather than single, atomic pieces of knowledge.
Compound statements: Many combine multiple related but distinct pieces of information.
`

const old = `
- Specific mathematical operations or algebraic manipulations
- Understanding and applying particular scientific laws or principles
- Ability to interpret and analyze graphs or diagrams
- Recognizing and applying problem-solving strategies
- Recalling and using domain-specific facts or formulas
`

//TODO: each inference has implications?
const sourceSchema = z.object({
  sourceId: z
    .string()
    .describe('Can be another knowledge component id, userInsight id OR interaction id'),
  whyRelevant: z.string().describe('Why is this source relevant to the inference?'),
  weight: z.number().min(0).max(1).describe('The weight of the source in the inference'),
})

export default {
  description: 'Generate Insights from the users interaction history and previous insights',
  prompt: `
  ${ApplicationExplainer}
  <instruction>
  
  Your job is to help build a knowledge graph that mirrors the user's knowledge and skills.
  ** You will be provided the context of the user history and interactions! **.
  
  Your response might be a mix of:
  
  a) referencing an existing knowledge component via an ID (provided in the context). Do this only if it matches the concept/component you'd generate otherwise.
  
  or

  b) generate new knowledge components that are as specific and fine-grained as possible. These components should cover the various skills, concepts, and problem-solving techniques required to answer the question correctly. Examples of such components include:
  
  * The generated knowledge components should be detailed enough to capture the nuances of the problem and the user's demonstrated abilities. 
  * Multiple components may be required to fully characterize a single interaction.
  
  The goal is to have each knowledge component represent a single, specific, measurable piece of knowledge or skill. This makes it easier to assess, track progress, and provide targeted learning experiences.
  
  
  * Be timid to assume that the user's ability to answer one question implies a broad understanding of other topics. Instead, focus on the specific skills and knowledge directly applied in answering that particular question. 
  * Skill transfer and cross-learning does happen but be sure you have enough evidence.
  * Use conservative confidence scores, starting low and building up with evidence.
  * Look at the time it takes for the user in contrast to how tought the interaction was
  * More recent interactions obviously are more telling

  </instruction>

<examples>
To illustrate here are plenty of good, suboptimal and 'almost' examples of the knowledge component "content" key with added explanations:

  <goodExamplesWithExplanation>
  ${goodKnowledgeComponentExamples}
  </goodExamplesWithExplanation>

  <subOptimalExamplesWithExplanation>
  ${subOptimalKnowledgeComponentExamplesWithExplanation}
  </subOptimalExamplesWithExplanation>

  <almostButNotQuiteThereExamplesWithExplanation>
  ${almostButNotQuiteThereKnowledgeComponentExamplesWithExplanation}
  </almostButNotQuiteThereExamplesWithExplanation>

</examples>


  *Context and History*::
  `,
  schema: z.array(
    z.object({
      type: z
        .enum([
          //interest,
          //preference
          'declarativeKnowledge',
          'appliedUnderstanding',
          'misconception',
          'skill',
          'other',
        ])
        .describe('The type of knowledge component'),
      knowledgeComponentIdOrDescription: z
        .string()
        .describe(
          'Either reference an existing knowledge component by its "_id" key or, if creating a new one, provide a specific, atomic description of the knowledge component'
        ),
      assumedMasteryLevel: z
        .number()
        .min(0)
        .max(1)
        .describe('How much the user has mastered this concept'),
      //implications:
      systemConfidence: z
        .number()
        .min(0)
        .max(1)
        .describe("How confident YOU are in your prediction about the user's knowledge"),
      sources: z.array(sourceSchema).describe('The evidence/sources that support the inference'),
    })
  ),
} as const
