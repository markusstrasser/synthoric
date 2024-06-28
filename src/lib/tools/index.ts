import { zodToJsonSchema } from "zod-to-json-schema";
import type { z } from "zod";

const getJsonSchema = (schema: z.ZodObject<any>) => {
	const { $schema, ...schemaObject } = zodToJsonSchema(schema);
	return schemaObject;
};
export const createTool = (prompt: string, schema: z.ZodObject<any>) => ({
	prompt,
	zodSchema: schema,
	get jsonSchema() {
		const jsonSchema = getJsonSchema(this.zodSchema);
		//? if z.object vs z.string
		return jsonSchema.properties || jsonSchema;
	},
	get promptWithSchema() {
		return `${this.prompt} <schema>${JSON.stringify(this.jsonSchema)}</schema>`;
	},
	get prefill() {
		const jsonSchema = getJsonSchema(this.zodSchema);
		return jsonSchema.type === "object"
			? `{"${Object.keys(jsonSchema.properties)[0]}":`
			: "";
	},
});
