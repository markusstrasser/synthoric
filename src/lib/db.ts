//TODO: make a db class and abstract the non-useQuery querying/mutating
// src/lib/db/ConvexDB.ts

import { convexClient } from './providers'
import { api } from '$convex/_generated/api'
import type { Id } from '$convex/_generated/dataModel'

export class DB {
  private client

  constructor(client = convexClient) {
    this.client = client
  }

  // Sequences
  async getSequences(k: number) {
    return this.client.query(api.sequences.getLatestK, { k })
  }

  async getSequenceByIndex(index: number) {
    return this.client.query(api.sequences.getByIndex, { index })
  }

  async createSequence(sequence: any) {
    return this.client.mutation(api.sequences.create, { sequence })
  }

  async patchUserActions(interactionId: Id<'interactions'>, userActions: any[]) {
    return this.client.mutation(api.interactions.patchUserActions, { interactionId, userActions })
  }

  async patchSystemFeedback(interactionId: Id<'interactions'>, systemFeedback: any) {
    return this.client.mutation(api.interactions.patchSystemFeedback, {
      interactionId,
      systemFeedback,
    })
  }

  // Inferences
  async getInferences() {
    return this.client.query(api.inferences.get)
  }

  async createInference(inference: any) {
    return this.client.mutation(api.inferences.create, { inference })
  }

  // Cache
  async getCacheStatus() {
    return this.client.query(api.cache.getStatus)
  }

  async newCacheStatus(status: string) {
    return this.client.mutation(api.cache.newStatus, { status })
  }

  // Utility methods
  async getFullSequence(index: number) {
    const sequence = await this.getSequenceByIndex(index)
    if (!sequence) return null

    const interactions = await Promise.all(
      sequence.interactions.map((id: Id<'interactions'>) =>
        this.client.query(api.interactions.getById, { id })
      )
    )

    return { ...sequence, interactions }
  }

  async getLatestInteraction(seqIndex: number) {
    const sequence = await this.getSequenceByIndex(seqIndex)
    if (!sequence) return null

    return this.getInteraction(seqIndex, sequence.interactions.length - 1)
  }

  async batchCreateInferences(inferences: any[]) {
    return Promise.all(inferences.map(inference => this.createInference(inference)))
  }

  async getInteractionsWithInferences(seqIndex: number) {
    const sequence = await this.getSequenceByIndex(seqIndex)
    if (!sequence) return null

    const interactions = await Promise.all(
      sequence.interactions.map((id: Id<'interactions'>) =>
        this.client.query(api.interactions.getById, { id })
      )
    )

    const inferences = await this.getInferences()

    return interactions.map(interaction => ({
      ...interaction,
      inferences: inferences.filter(inference =>
        inference.sources.some((source: any) => source.id === interaction._id)
      ),
    }))
  }

  // Performance optimization method
  async prefetchSequenceData(seqIndex: number) {
    const sequence = await this.getSequenceByIndex(seqIndex)
    if (!sequence) return

    // Prefetch all interactions for this sequence
    for (const id of sequence.interactions) {
      this.client.query(api.interactions.getById, { id })
    }

    // Prefetch inferences
    this.getInferences()
  }
}
