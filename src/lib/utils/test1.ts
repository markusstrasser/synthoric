import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

zodToJsonSchema(z.string().describe("aaa"));

console.log(zodToJsonSchema(z.string().describe("aaa")));
