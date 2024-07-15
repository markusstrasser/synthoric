// See https://kit.svelte.dev/docs/types#app

import type { ConvexHttpClient } from "convex/browser"

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      convexClient: ConvexHttpClient
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export type { }

