//ts-ignore
//@ts-ignore

import { z } from "zod";
import { knowledgeComponentExamples } from "../prompts/static";
//import { inferences, interactions } from '@/server/db/schema'

//? No updatedAt since interactions are permanent history! Only knowledge is updated

export const schema2dict = (zodSchema) =>
  Object.fromEntries(
    Object.entries(zodSchema.shape).map(([key, value]) => [
      key,
      //@ts-ignore
      value.description || "No description",
    ]),
  );

const sourceSchema = z.object({
  id: z.string().describe("Can be an inference OR interaction id"),
  whyRelevant: z
    .string()
    .describe("Why is this source relevant to the inference?"),
  weight: z
    .number()
    .min(0)
    .max(1)
    .describe("The weight of the source in the inference"),
});

//TODO: each inference has implications?
export const InferenceSchema = z.object({
  type: z
    .enum([
      //interest,
      //preference
      "knowledge", // Includes conceptual, procedural, and metacognitive knowledge
      "skill", // Includes cognitive and emotional skills
      "misconception",
      "other",
    ])
    .describe("The type of knowledge component"),
  description: z.string().describe(knowledgeComponentExamples), // Using z.record(z.any()) as a placeholder for a more specific schema if needed
  assumedMasteryLevel: z.number().min(0).max(1),
  //implications:
  systemConfidence: z
    .number()
    .min(0)
    .max(1)
    .describe(
      "How confident YOU are in your prediction about the user's knowledge",
    ),
  sources: z
    .array(sourceSchema)
    .describe("The evidence/sources that support the inference"),
});

export const interactionSequenceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  interactionIds: z.array(z.string()),
});

export const hintSchema = z.object({
  hint: z.string(),
  usedAfterSeconds: z.number(),
});

export const userActionTakenSchema = z.object({
  type: z.string(),
  description: z.string(),
  timeAfterInteractionStartInSeconds: z.date(),
});

export const UserActionSchema = z.object({
  id: z.string(),
  isFinal: z.boolean().default(false),
  displayIndex: z.number(),
  fromSpec: z.enum([
    "TASK",
    "HINTS",
    "SOLUTION",
    "TextInput",
    "AnswerSubmitButton",
  ]),
  value: z.unknown(),
  timeStamp: z.number(),
});
export const SubmissionReviewSchema = z.object({
  feedback: z
    .string()
    .describe(
      "Quick precise feedback if user submission isn't 100% correct - under 20 words if possible. Remember the student sees the full solution in the UI with this feedback. Give feedback on things/misconceptions not apparent from the solution and taking his/her submission into account. If it's correct (highest rating), just reply: 'correct!' ",
    ),
  notes: z
    .string()
    .describe(
      "Iff the user's answer is wrong: short pointer to what concepts might be good to review/look at",
    ),
  rating: z
    .number()
    .min(0)
    .max(3)
    .describe(
      "A number between 0 and 3. 0 for being absolutely wrong (even wrong units), 1 for being wrong, 2 for being partially correct or the right direction, 3 for the correct answer",
    ),
});
