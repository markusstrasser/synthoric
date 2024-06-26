import type { RequestHandler } from "./$types";

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
	apiKey: "my_api_key", // defaults to process.env["ANTHROPIC_API_KEY"]
});

const msg = await anthropic.messages.create({
	model: "claude-3-5-sonnet-20240620",
	max_tokens: 1024,
	tools: [
		{
			name: "get_weather",
			description: "Get the current weather in a given location",
			input_schema: {
				type: "object",
				properties: {
					location: {
						type: "string",
						description: "The city and state, e.g. San Francisco, CA",
					},
				},
				required: ["location"],
			},
		},
	],
	messages: [
		{
			role: "user",
			content: "What is the weather like in San Francisco?",
		},
	],
});

console.log(msg);

const exampleResponse = {
	id: "msg_018NKfdAx4vqqUS9pQm79Vxt",
	type: "message",
	role: "assistant",
	model: "claude-3-5-sonnet-20240620",
	content: [
		{
			type: "text",
			text: "Certainly! I can help you find out the current weather in San Francisco. To get this information, I'll use the get_weather function. Let me fetch that data for you right away.",
		},
		{
			type: "tool_use",
			id: "toolu_01Ktg2L62L3AgwrYDvpseeRj",
			name: "get_weather",
			input: { location: "San Francisco, CA" },
		},
	],
	stop_reason: "tool_use",
	stop_sequence: null,
	usage: { input_tokens: 384, output_tokens: 96 },
};

export const GET: RequestHandler = async () => {
	return new Response();
};
