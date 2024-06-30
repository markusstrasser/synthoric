import z from "zod";

const KatexSchema = z.object({
  name: z.literal("katex"),
  content: z
    .string()
    .describe(
      "The Katex syntax compliant expression to show in the katex component."
    ),
});
const showKatex = {
  description: "Show a mathematical expression in correct Katex format",
  parameters: KatexSchema,
};
