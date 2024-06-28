import { Anthropic } from "@anthropic-ai/sdk";
import { z } from "zod";
import {
	ApplicationGoalTemplate,
	ContextExplainerTemplate,
} from "./prompts/snippets";
import Handlebars from "handlebars";
import { zodToJsonSchema } from "zod-to-json-schema";

enum ParserState {
	WaitingForKey,
	InKey,
	WaitingForColon,
	WaitingForValue,
	InStringValue,
	InNumberValue,
	InBooleanValue,
	InNullValue,
	InArrayValue,
}

enum ParserState {
	WaitingForKey,
	InKey,
	WaitingForColon,
	WaitingForValue,
	InStringValue,
	InNumberValue,
	InBooleanValue,
	InNullValue,
	InArrayValue,
}

class StreamingJSONParser {
	private accumulatedJson = "";
	private partialObject: Record<string, any> = {};
	private currentKey = "";
	private currentValue: any = "";
	private state = ParserState.WaitingForKey;
	private escapeNext = false;
	private stack: Array<Record<string, any> | any[]> = [];
	private arrayDepth = 0;

	constructor(prefill: string = "") {
		this.accumulatedJson = prefill;
		this.initializePrefill();
	}

	private initializePrefill() {
		const colonIndex = this.accumulatedJson.indexOf(":");
		if (colonIndex !== -1) {
			this.currentKey = this.accumulatedJson.slice(2, colonIndex - 1);
			this.state = ParserState.WaitingForValue;
		}
	}

	public processChunk(chunk: string): void {
		for (const char of chunk) {
			this.accumulatedJson += char;
			this.processChar(char);
		}
	}

	private processChar(char: string): void {
		if (this.escapeNext) {
			this.handleEscapeSequence(char);
			return;
		}

		switch (this.state) {
			case ParserState.WaitingForKey:
				if (char === '"') {
					this.state = ParserState.InKey;
					this.currentKey = "";
				} else if (char === "}") {
					this.finalizeObject();
				}
				break;
			case ParserState.InKey:
				if (char === '"') {
					this.state = ParserState.WaitingForColon;
				} else {
					this.currentKey += char;
				}
				break;
			case ParserState.WaitingForColon:
				if (char === ":") {
					this.state = ParserState.WaitingForValue;
				}
				break;
			case ParserState.WaitingForValue:
				if (char === '"') {
					this.state = ParserState.InStringValue;
					this.currentValue = "";
				} else if (char === "t" || char === "f") {
					this.state = ParserState.InBooleanValue;
					this.currentValue = char;
				} else if (char === "n") {
					this.state = ParserState.InNullValue;
					this.currentValue = char;
				} else if (char === "-" || (char >= "0" && char <= "9")) {
					this.state = ParserState.InNumberValue;
					this.currentValue = char;
				} else if (char === "[") {
					this.state = ParserState.InArrayValue;
					this.arrayDepth = 1;
					this.currentValue = char;
				} else if (char === "{") {
					this.stack.push(this.partialObject);
					this.partialObject = {};
					this.state = ParserState.WaitingForKey;
				}
				break;
			case ParserState.InStringValue:
				if (char === "\\") {
					this.escapeNext = true;
				} else if (char === '"' && !this.escapeNext) {
					this.finalizeKeyValuePair();
				} else {
					this.currentValue += char;
					this.escapeNext = false;
				}
				break;
			case ParserState.InNumberValue:
			case ParserState.InBooleanValue:
			case ParserState.InNullValue:
				if (char === "," || char === "}" || char === "]") {
					this.finalizeKeyValuePair();
					this.processChar(char);
				} else {
					this.currentValue += char;
				}
				break;
			case ParserState.InArrayValue:
				this.currentValue += char;
				if (char === "[") {
					this.arrayDepth++;
				} else if (char === "]") {
					this.arrayDepth--;
					if (this.arrayDepth === 0) {
						this.finalizeKeyValuePair();
					}
				}
				break;
		}
	}

	private handleEscapeSequence(char: string): void {
		switch (char) {
			case '"':
			case "\\":
			case "/":
				this.currentValue += char;
				break;
			case "b":
				this.currentValue += "\b";
				break;
			case "f":
				this.currentValue += "\f";
				break;
			case "n":
				this.currentValue += "\n";
				break;
			case "r":
				this.currentValue += "\r";
				break;
			case "t":
				this.currentValue += "\t";
				break;
			case "u":
				this.unicodeBuffer = "";
				return;
			default:
				throw new Error(`Invalid escape sequence: \\${char}`);
		}
		this.escapeNext = false;
	}

	private finalizeKeyValuePair(): void {
		let value: any;
		switch (this.state) {
			case ParserState.InStringValue:
				value = this.currentValue;
				break;
			case ParserState.InNumberValue:
				value = parseFloat(this.currentValue);
				break;
			case ParserState.InBooleanValue:
				value = this.currentValue === "true";
				break;
			case ParserState.InNullValue:
				value = null;
				break;
			case ParserState.InArrayValue:
				value = JSON.parse(this.currentValue);
				break;
			default:
				throw new Error(
					`Unexpected state when finalizing key-value pair: ${this.state}`,
				);
		}

		if (this.stack.length && Array.isArray(this.stack[this.stack.length - 1])) {
			(this.stack[this.stack.length - 1] as any[]).push(value);
		} else {
			this.partialObject[this.currentKey] = value;
		}

		this.currentKey = "";
		this.currentValue = "";
		this.state = ParserState.WaitingForKey;
	}

	private finalizeObject(): void {
		if (this.stack.length) {
			const parent = this.stack.pop();
			if (Array.isArray(parent)) {
				parent.push(this.partialObject);
			} else {
				parent[this.currentKey] = this.partialObject;
			}
			this.partialObject = parent as Record<string, any>;
		}
		this.state = ParserState.WaitingForKey;
	}

	private finalizeArray(): void {
		const array = this.stack.pop() as any[];
		if (this.stack.length) {
			const parent = this.stack[this.stack.length - 1];
			if (Array.isArray(parent)) {
				parent.push(array);
			} else {
				parent[this.currentKey] = array;
			}
		} else {
			this.partialObject[this.currentKey] = array;
		}
		this.state = ParserState.WaitingForKey;
	}

	public getPartialObject(): Record<string, any> {
		return this.partialObject;
	}

	public getAccumulatedJson(): string {
		return this.accumulatedJson;
	}

	public getFinalObject(): Record<string, any> {
		return this.partialObject;
	}
}
import dotenv from "dotenv";
dotenv.config();
const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

export const main = async (contextConfig) => {
	//TODO: getContext with config

	//TODO: make the descriptions come from the interactionTypes schema

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

	let { $schema, ...schema } = zodToJsonSchema(toolCallSchema);
	//console.log(schema, "dict");
	const prefill =
		schema.type === "object"
			? `{"${Object.keys(schema.properties ?? {})[0] ?? ""}":`
			: "{";

	schema = schema.type === "object" ? schema.properties : schema;
	const prompt = `${ApplicationGoalTemplate}
----
I want you to decide on the best next interaction type to serve to the user. You have the following types to chose from:

'exercise': A text problem with freeform text/expression input from the student, followed by a step-by-step solution after submit. 
'multipleChoice': A multiple choice question with a list of options for the user to choose from. 
'binaryChoice': Multiple choice but with only two options. This is best used for quick diagnostics and intuition check of the user in a given subdomain (ie. classical mechanics or more granular angular momentum and so on)

The user likes binary choice examples.

Just MUST output valid JSON. And your output should have ALL the keys of the follow the following JSON schema:
----
${JSON.stringify(schema)}

Consult the descriptions of the schema to know what the value of the keys should be. The prompts field specific what the next AI will generate for it's tooltype.
`;

	console.log(prompt, "prompt");
	const parser = new StreamingJSONParser(prefill);
	console.log(prefill, "prefill");
	const stream = anthropic.messages.stream({
		model: "claude-3-5-sonnet-20240620",
		max_tokens: 1024,
		system: prompt,
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
	const finalObj = await stream.finalMessage();
	console.log(finalObj, "final");

	return parser.getPartialObject();
};

main({}).then(console.log).catch(console.error);
