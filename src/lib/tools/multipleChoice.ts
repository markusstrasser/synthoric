import { z } from "zod";
import { generateObject } from "ai";

export const MultipleChoiceContent = {
	type: "MultipleChoice",
	description: "A multiple choice question with a list of options",
	schema: z.object({
		task: z.string(),
		choices: z.array(z.string()).min(2),
		isCorrect: z.array(z.boolean()).min(2),
	}),
	generate: async (context: any) => {
		const { object } = await generateObject({
			prompt: `Generate a multiple choice question based on the following context: ${JSON.stringify(context)}`,
			model: openai("gpt-4o"),
			schema: MultipleChoiceContent.schema,
		});
		return object;
	},
	generateBatch: async (context: any, count: number) => {
		const { object } = await generateObject({
			prompt: `Generate ${count} multiple choice questions based on the following context: ${JSON.stringify(context)}`,
			model: openai("gpt-4o"),
			schema: z.array(MultipleChoiceContent.schema).min(count).max(count),
		});
		return object;
	},
};
