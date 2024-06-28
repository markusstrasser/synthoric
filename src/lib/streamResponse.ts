import { Anthropic } from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import StreamingJSONParser from "./StreamingJSONParser"; // Assume we've moved the parser to its own file
import { ApplicationGoalTemplate } from "./prompts/snippets";

const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

export const streamResponse = async (
	prompt: string,
	zodSchema: z.ZodObject<any>,
	onKeyValuePair: (pair: Record<string, any>) => void,
) => {
	const toolCallSchema = z
		.object({
			tool: z.enum(["exercise", "multipleChoice", "binaryChoice"]),
			count: z
				.number()
				.min(1)
				.max(5)
				.describe("The number of consequtive interactions to generate"),
			prompts: z
				.array(z.string())
				.describe(
					"the prompts for the tool. The tool will call an LLM with each of the prompts to generate the interaction data. Be specific.",
				),
			// params: z
			// 	.array(z.string())
			// 	.describe("the params that go with each prompt"),
		})
		.describe("The tool the next AI agent can use");

	//? No updatedAt since interactions are permanent history! Only knowledge is updated

	let { $schema, ...schema } = zodToJsonSchema(zodSchema);
	const promptWithSchema = `${prompt}<schema>${JSON.stringify(schema)}</schema>`;
	//console.log(schema, "dict");
	const prefill =
		schema.type === "object"
			? `{"${Object.keys(schema.properties ?? {})[0] ?? ""}":`
			: "";

	schema = schema.type === "object" ? schema.properties : schema;

	const parser = new StreamingJSONParser(prefill);
	parser.on("keyValuePair", onKeyValuePair);

	const stream = anthropic.messages.stream({
		model: "claude-3-5-sonnet-20240620",
		max_tokens: 1024,
		system: promptWithSchema,
		messages: [
			{ role: "user", content: "<waiting for interaction>" },
			{ role: "assistant", content: prefill },
		],
	});

	for await (const chunk of stream) {
		if (chunk.type === "content_block_delta") {
			parser.processChunk(chunk.delta.text);
		}
	}

	return parser.getPartialObject();
};

// Example usage:

const toolCallSchema = z
	.object({
		tool: z.enum(["exercise", "multipleChoice", "binaryChoice"]),
		count: z
			.number()
			.min(1)
			.max(5)
			.describe("The number of consequtive interactions to generate"),
		prompts: z
			.array(z.string())
			.describe(
				"the prompts for the tool. The tool will call an LLM with each of the prompts to generate the interaction data. Be specific.",
			),
		// params: z
		// 	.array(z.string())
		// 	.describe("the params that go with each prompt"),
	})
	.describe("The tool the next AI agent can use");

const prompt = `${ApplicationGoalTemplate}
----
I want you to decide on the best next interaction type to serve to the user. You have the following types to chose from:

'exercise': A text problem with freeform text/expression input from the student, followed by a step-by-step solution after submit. 
'multipleChoice': A multiple choice question with a list of options for the user to choose from. 
'binaryChoice': Multiple choice but with only two options. This is best used for quick diagnostics and intuition check of the user in a given subdomain (ie. classical mechanics or more granular angular momentum and so on)

The user likes binary choice examples.

Just MUST output valid JSON. And your output should have ALL the keys of the follow the following JSON schema:
----
`;

streamResponse(prompt, toolCallSchema, (pair) =>
	console.log("New key-value pair:", pair),
)
	.then(console.log)
	.catch(console.error);
