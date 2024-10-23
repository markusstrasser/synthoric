// export const POST = (async ({ request }) => {
// 	const { messages } = await request.json();

// 	const answer = await agent(messages);

// 	const agentJson = await generateText({
// 		model: anthropic('claude-3-5-sonnet-20241022'),
// 		system:
// 			'Convert the following JSON into a clean, simple HTML that gets displayed to the user. Focus on information design principles. If your tools do not correspond to the task, just return "*" instead',
// 		prompt: answer
// 		// messages: [{ role: 'user', content:  }]
// 	});

// 	const result = await streamText({
// 		system: `Convert the following JSON into a clean, simple HTML that gets displayed to the user. Focus on information design principles. Response MUST be VALID HTML ONLY. It will get mapped into a svelte component using the {@html ...} directive.

// 		${
// 			agentJson.text === '*' &&
// 			`<json>
// 			${agentJson}
// 			</json>`
// 		}`,
// 		model: anthropic('claude-3-5-sonnet-20241022'),
// 		messages: [...messages, { role: 'assistant', content: '<' }]
// 	});

// 	return result.toAIStreamResponse();

// 	// return json({ html });
// }) satisfies RequestHandler;
