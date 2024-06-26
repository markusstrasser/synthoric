import * as dotenv from "dotenv";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";

dotenv.config();

// console.log('env', process.env)

export const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const anthropic = createAnthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});
