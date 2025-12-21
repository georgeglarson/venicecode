import { describe, expect, test } from "bun:test"
import { VeniceReasoningContext } from "../../src/provider/venice-context"
import type { ReasoningData, ReasoningStore } from "../../src/provider/venice-context"

describe("VeniceReasoningContext", () => {
  describe("Venice Gemini 3 reasoning_details preservation", () => {
    test("stores and retrieves reasoning details for a message", () => {
      const store: ReasoningStore = new Map()
      const messageIndex = 0
      const reasoningData: ReasoningData = {
        reasoning: "I need to analyze this problem...",
        reasoning_details: [{ thought_signature: "encrypted_signature_abc123" }]
      }

      VeniceReasoningContext.provide(store, () => {
        const ctx = VeniceReasoningContext.use()
        ctx.set(messageIndex, reasoningData)
        const retrieved = ctx.get(messageIndex)
        expect(retrieved).toEqual(reasoningData)
      })
    })

    test("returns undefined for non-existent message index", () => {
      const store: ReasoningStore = new Map()

      VeniceReasoningContext.provide(store, () => {
        const ctx = VeniceReasoningContext.use()
        const retrieved = ctx.get(999)
        expect(retrieved).toBeUndefined()
      })
    })

    test("stores multiple reasoning details for different messages", () => {
      const store: ReasoningStore = new Map()
      const details0: ReasoningData = {
        reasoning: "First thought...",
        reasoning_details: [{ thought_signature: "sig_0" }]
      }
      const details2: ReasoningData = {
        reasoning: "Third thought...",
        reasoning_details: [{ thought_signature: "sig_2" }]
      }

      VeniceReasoningContext.provide(store, () => {
        const ctx = VeniceReasoningContext.use()
        ctx.set(0, details0)
        ctx.set(2, details2)

        expect(ctx.get(0)).toEqual(details0)
        expect(ctx.get(1)).toBeUndefined()
        expect(ctx.get(2)).toEqual(details2)
      })
    })

    test("overwrites existing reasoning details for same index", () => {
      const store: ReasoningStore = new Map()
      const original: ReasoningData = {
        reasoning: "Original thought",
        reasoning_details: [{ thought_signature: "sig_original" }]
      }
      const updated: ReasoningData = {
        reasoning: "Updated thought",
        reasoning_details: [{ thought_signature: "sig_updated" }]
      }

      VeniceReasoningContext.provide(store, () => {
        const ctx = VeniceReasoningContext.use()
        ctx.set(0, original)
        ctx.set(0, updated)
        expect(ctx.get(0)).toEqual(updated)
      })
    })

    test("clear removes all stored reasoning details", () => {
      const store: ReasoningStore = new Map()

      VeniceReasoningContext.provide(store, () => {
        const ctx = VeniceReasoningContext.use()
        ctx.set(0, { reasoning: "t1", reasoning_details: [{ thought_signature: "s1" }] })
        ctx.set(1, { reasoning: "t2", reasoning_details: [{ thought_signature: "s2" }] })
        
        ctx.clear()
        
        expect(ctx.get(0)).toBeUndefined()
        expect(ctx.get(1)).toBeUndefined()
      })
    })

    test("throws NotFound when used outside of provide", () => {
      expect(() => VeniceReasoningContext.use()).toThrow()
    })
  })

  describe("thought_signature requirement for Gemini 3", () => {
    test("reasoning_details array can contain thought_signature for multi-turn", () => {
      // This documents the Venice API requirement:
      // Without thought_signature in reasoning_details, Venice returns HTTP 400
      const store: ReasoningStore = new Map()
      const validReasoningData: ReasoningData = {
        reasoning: "Analysis of the problem...",
        reasoning_details: [
          { thought_signature: "encrypted_sig_required_by_venice" }
        ]
      }

      VeniceReasoningContext.provide(store, () => {
        const ctx = VeniceReasoningContext.use()
        ctx.set(0, validReasoningData)
        const retrieved = ctx.get(0)
        
        expect(retrieved).toBeDefined()
        expect(retrieved!.reasoning_details).toBeDefined()
        expect(Array.isArray(retrieved!.reasoning_details)).toBe(true)
        expect(retrieved!.reasoning_details!.length).toBeGreaterThan(0)
        expect(retrieved!.reasoning_details![0].thought_signature).toBeDefined()
      })
    })

    test("preserves reasoning_details structure across store operations", () => {
      // Simulates what happens during multi-turn conversation
      const store: ReasoningStore = new Map()
      
      // First assistant message with reasoning
      const turn1: ReasoningData = {
        reasoning: "Let me think about this...",
        reasoning_details: [
          { thought_signature: "sig_turn_1_encrypted" },
          { thinking: "Step 1: analyze the input" }
        ]
      }
      
      // Second assistant message after tool call
      const turn2: ReasoningData = {
        reasoning: "Based on the tool result...",
        reasoning_details: [
          { thought_signature: "sig_turn_2_encrypted" },
          { thinking: "Step 2: process tool output" }
        ]
      }

      VeniceReasoningContext.provide(store, () => {
        const ctx = VeniceReasoningContext.use()
        
        // Store both turns
        ctx.set(1, turn1) // Assistant message at index 1
        ctx.set(3, turn2) // Assistant message at index 3 (after tool result)
        
        // Verify both are preserved
        const retrieved1 = ctx.get(1)
        const retrieved2 = ctx.get(3)
        
        expect(retrieved1).toEqual(turn1)
        expect(retrieved2).toEqual(turn2)
        
        // Verify structure is intact for re-injection
        expect(retrieved1!.reasoning_details![0].thought_signature).toBe("sig_turn_1_encrypted")
        expect(retrieved2!.reasoning_details![0].thought_signature).toBe("sig_turn_2_encrypted")
      })
    })
  })
})
