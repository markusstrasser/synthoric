export default (task: string, answer: string) => `
   A user has just answered a question about a physics problem.
   The problem was ${task}.
   ----
   The user's answer was ${answer}.

   Concisely explain the answer to the user in under 3 sentences.
`
