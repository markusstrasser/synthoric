import { Anthropic } from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import StreamingJSONParser from "./StreamingJSONParser";
import toolDispatcher from "./tools/toolDispatcher";

const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

export const streamResponse = async (
	{ prefill, promptWithSchema }: { prefill: string; promptWithSchema: string },
	onKeyValuePair: (pair: Record<string, any>) => void,
) => {
	const parser = new StreamingJSONParser(prefill);
	parser.on("keyValuePair", onKeyValuePair);
	console.log(promptWithSchema, "p");
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

streamResponse(toolDispatcher, (pair) =>
	console.log("New key-value pair:", pair),
)
	.then(console.log)
	.catch(console.error);
