import { Context } from "@/util/context"

export interface ReasoningData {
  reasoning?: string
  reasoning_details?: any[]
}

// Map of assistant message index -> reasoning data
export type ReasoningStore = Map<number, ReasoningData>

export const VeniceReasoningContext = Context.create<ReasoningStore>("venice-reasoning")
