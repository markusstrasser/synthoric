import { json, type RequestHandler } from '@sveltejs/kit'
import { api } from '$convex/_generated/api.js'
import { convexClient } from '$lib/providers'

const interactionExamples = [
  {
    id: '123',
    tagline: 'Classical mechanics exercise',
    content: [{ question: 'Calculate the trajectory of a projectile...' }],
  },
  {
    id: '456',
    tagline: 'Quantum mechanics problem',
    content: [{ question: 'Solve the Schrödinger equation for...' }],
  },
  {
    id: '789',
    tagline: 'Thermodynamics challenge',
    content: [{ question: 'Determine the entropy change in...' }],
  },
  // Add more examples as needed
]
console.log(await convexClient.query(api.interactions.getAll))

export const GET: RequestHandler = async () => {
  return json({
    success: true,
    data: interactionExamples,
  })
}
