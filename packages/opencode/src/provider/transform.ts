import type { ModelMessage } from "ai"
import { unique } from "remeda"
import type { JSONSchema } from "zod/v4/core"
import { VeniceReasoningContext, type ReasoningData, type ReasoningStore } from "./venice-context"

export namespace ProviderTransform {
  function normalizeMessages(msgs: ModelMessage[], providerID: string, modelID: string): ModelMessage[] {
    if (modelID.includes("claude")) {
      return msgs.map((msg) => {
        if ((msg.role === "assistant" || msg.role === "tool") && Array.isArray(msg.content)) {
          msg.content = msg.content.map((part) => {
            if ((part.type === "tool-call" || part.type === "tool-result") && "toolCallId" in part) {
              return {
                ...part,
                toolCallId: part.toolCallId.replace(/[^a-zA-Z0-9_-]/g, "_"),
              }
            }
            return part
          })
        }
        return msg
      })
    }
    // Venice-specific transformations
    if (providerID === "venice") {
      // Try to get reasoning store for Gemini 3 models
      let reasoningStore: ReasoningStore | null = null
      if (modelID.includes("gemini-3")) {
        try {
          reasoningStore = VeniceReasoningContext.use()
        } catch {
          // Context not available, reasoning won't be preserved
        }
      }

      let assistantIndex = 0
      return msgs.map((msg) => {
        let result = msg

        // Venice returns "name": null in assistant messages but rejects it when sent back
        if ("name" in result && result.name === null) {
          const { name, ...rest } = result
          result = rest as ModelMessage
        }

        // Normalize tool call IDs (Kimi K2 returns IDs with leading spaces like " functions.write:0")
        if ((result.role === "assistant" || result.role === "tool") && Array.isArray(result.content)) {
          result.content = result.content.map((part) => {
            if ((part.type === "tool-call" || part.type === "tool-result") && "toolCallId" in part) {
              return {
                ...part,
                toolCallId: part.toolCallId.trim(),
              }
            }
            return part
          })
        }

        // Extract and store reasoning for Gemini 3 multi-turn tool calling
        if (result.role === "assistant" && Array.isArray(result.content)) {
          console.error(
            "[TRANSFORM] Assistant message content types:",
            result.content.map((p: any) => p.type),
          )
          console.error("[TRANSFORM] Full content:", JSON.stringify(result.content).slice(0, 500))
        }
        if (result.role === "assistant" && Array.isArray(result.content) && reasoningStore) {
          console.error("[TRANSFORM] Has reasoningStore, checking for reasoning parts...")
          let reasoningText = ""
          const reasoningDetails: any[] = []

          for (const part of result.content) {
            if (part.type === "reasoning") {
              console.error("[TRANSFORM] Reasoning part keys:", Object.keys(part))
              console.error("[TRANSFORM] providerOptions:", JSON.stringify((part as any).providerOptions))
              console.error("[TRANSFORM] providerMetadata:", JSON.stringify((part as any).providerMetadata))
              reasoningText += (part as any).text || ""
              // Extract reasoning_details from providerMetadata if available
              // Check multiple possible locations for reasoning_details
              const providerMeta = (part as any).providerMetadata || (part as any).providerOptions
              const metadata = providerMeta?.openaiCompatible || providerMeta?.venice || providerMeta // Also check top-level for stored metadata from processor

              console.error("[TRANSFORM] Checking metadata:", JSON.stringify(providerMeta)?.slice(0, 200))

              if (metadata?.reasoning_details) {
                const details = metadata.reasoning_details
                console.error("[TRANSFORM] Found reasoning_details in metadata:", details.length)
                reasoningDetails.push(...(Array.isArray(details) ? details : [details]))
              }
              // Also check for thought_signature in metadata
              if (metadata?.thought_signature) {
                reasoningDetails.push({
                  type: "reasoning.encrypted",
                  thought_signature: metadata.thought_signature,
                })
              }
            }
          }

          if (reasoningText || reasoningDetails.length > 0) {
            console.error(
              "[TRANSFORM] Storing reasoning for index",
              assistantIndex,
              "text:",
              reasoningText?.slice(0, 50),
              "details:",
              reasoningDetails.length,
            )
            reasoningStore.set(assistantIndex, {
              reasoning: reasoningText || undefined,
              reasoning_details: reasoningDetails.length > 0 ? reasoningDetails : undefined,
            })
          }
          assistantIndex++
        } else if (result.role === "assistant") {
          assistantIndex++
        }

        return result
      })
    }

    if (providerID === "mistral" || modelID.toLowerCase().includes("mistral")) {
      const result: ModelMessage[] = []
      for (let i = 0; i < msgs.length; i++) {
        const msg = msgs[i]
        const nextMsg = msgs[i + 1]

        if ((msg.role === "assistant" || msg.role === "tool") && Array.isArray(msg.content)) {
          msg.content = msg.content.map((part) => {
            if ((part.type === "tool-call" || part.type === "tool-result") && "toolCallId" in part) {
              // Mistral requires alphanumeric tool call IDs with exactly 9 characters
              const normalizedId = part.toolCallId
                .replace(/[^a-zA-Z0-9]/g, "") // Remove non-alphanumeric characters
                .substring(0, 9) // Take first 9 characters
                .padEnd(9, "0") // Pad with zeros if less than 9 characters

              return {
                ...part,
                toolCallId: normalizedId,
              }
            }
            return part
          })
        }

        result.push(msg)

        // Fix message sequence: tool messages cannot be followed by user messages
        if (msg.role === "tool" && nextMsg?.role === "user") {
          result.push({
            role: "assistant",
            content: [
              {
                type: "text",
                text: "Done.",
              },
            ],
          })
        }
      }
      return result
    }

    return msgs
  }

  function applyCaching(msgs: ModelMessage[], providerID: string): ModelMessage[] {
    const system = msgs.filter((msg) => msg.role === "system").slice(0, 2)
    const final = msgs.filter((msg) => msg.role !== "system").slice(-2)

    const providerOptions = {
      anthropic: {
        cacheControl: { type: "ephemeral" },
      },
      openrouter: {
        cache_control: { type: "ephemeral" },
      },
      bedrock: {
        cachePoint: { type: "ephemeral" },
      },
      openaiCompatible: {
        cache_control: { type: "ephemeral" },
      },
    }

    for (const msg of unique([...system, ...final])) {
      const shouldUseContentOptions = providerID !== "anthropic" && Array.isArray(msg.content) && msg.content.length > 0

      if (shouldUseContentOptions) {
        const lastContent = msg.content[msg.content.length - 1]
        if (lastContent && typeof lastContent === "object") {
          lastContent.providerOptions = {
            ...lastContent.providerOptions,
            ...providerOptions,
          }
          continue
        }
      }

      msg.providerOptions = {
        ...msg.providerOptions,
        ...providerOptions,
      }
    }

    return msgs
  }

  export function message(msgs: ModelMessage[], providerID: string, modelID: string) {
    // Defensive check - ensure msgs is an array of ModelMessages
    if (!Array.isArray(msgs)) {
      console.error("[TRANSFORM] message() received non-array:", typeof msgs)
      return msgs
    }
    // Check if these look like UIMessages instead of ModelMessages
    const hasUIMessageFormat = msgs.some((m: any) => m.parts && !m.content)
    if (hasUIMessageFormat) {
      console.error("[TRANSFORM] WARNING: Received UIMessage format instead of ModelMessage!")
      console.error("[TRANSFORM] First msg keys:", Object.keys(msgs[0] || {}))
    }
    msgs = normalizeMessages(msgs, providerID, modelID)
    if (providerID === "anthropic" || modelID.includes("anthropic") || modelID.includes("claude")) {
      msgs = applyCaching(msgs, providerID)
    }

    return msgs
  }

  export function temperature(_providerID: string, modelID: string) {
    if (modelID.toLowerCase().includes("qwen")) return 0.55
    if (modelID.toLowerCase().includes("claude")) return undefined
    if (modelID.toLowerCase().includes("gemini-3-pro")) return 1.0
    return 0
  }

  export function topP(_providerID: string, modelID: string) {
    if (modelID.toLowerCase().includes("qwen")) return 1
    return undefined
  }

  export function options(providerID: string, modelID: string, npm: string, sessionID: string): Record<string, any> {
    const result: Record<string, any> = {}

    // switch to providerID later, for now use this
    if (npm === "@openrouter/ai-sdk-provider") {
      result["usage"] = {
        include: true,
      }
    }

    if (providerID === "openai") {
      result["promptCacheKey"] = sessionID
    }

    if (
      providerID === "google" ||
      (providerID.startsWith("opencode") && modelID.includes("gemini-3")) ||
      (providerID === "venice" && modelID.includes("gemini-3"))
    ) {
      result["thinkingConfig"] = {
        includeThoughts: true,
      }
    }

    if (modelID.includes("gpt-5") && !modelID.includes("gpt-5-chat")) {
      if (modelID.includes("codex")) {
        result["store"] = false
      }

      if (!modelID.includes("codex") && !modelID.includes("gpt-5-pro")) {
        result["reasoningEffort"] = "medium"
      }

      if (modelID.endsWith("gpt-5.1") && providerID !== "azure") {
        result["textVerbosity"] = "low"
      }

      if (providerID.startsWith("opencode")) {
        result["promptCacheKey"] = sessionID
        result["include"] = ["reasoning.encrypted_content"]
        result["reasoningSummary"] = "auto"
      }
    }
    return result
  }

  export function smallOptions(input: { providerID: string; modelID: string }) {
    const options: Record<string, any> = {}

    if (input.providerID === "openai" || input.modelID.includes("gpt-5")) {
      if (input.modelID.includes("5.1")) {
        options["reasoningEffort"] = "low"
      } else {
        options["reasoningEffort"] = "minimal"
      }
    }
    if (input.providerID === "google") {
      options["thinkingConfig"] = {
        thinkingBudget: 0,
      }
    }

    return options
  }

  export function providerOptions(npm: string | undefined, providerID: string, options: { [x: string]: any }) {
    switch (npm) {
      case "@ai-sdk/openai":
      case "@ai-sdk/azure":
        return {
          ["openai" as string]: options,
        }
      case "@ai-sdk/amazon-bedrock":
        return {
          ["bedrock" as string]: options,
        }
      case "@ai-sdk/anthropic":
        return {
          ["anthropic" as string]: options,
        }
      case "@ai-sdk/google":
        return {
          ["google" as string]: options,
        }
      case "@ai-sdk/gateway":
        return {
          ["gateway" as string]: options,
        }
      case "@openrouter/ai-sdk-provider":
        return {
          ["openrouter" as string]: options,
        }
      default:
        return {
          [providerID]: options,
        }
    }
  }

  export function maxOutputTokens(
    npm: string,
    options: Record<string, any>,
    modelLimit: number,
    globalLimit: number,
  ): number {
    const modelCap = modelLimit || globalLimit
    const standardLimit = Math.min(modelCap, globalLimit)

    if (npm === "@ai-sdk/anthropic") {
      const thinking = options?.["thinking"]
      const budgetTokens = typeof thinking?.["budgetTokens"] === "number" ? thinking["budgetTokens"] : 0
      const enabled = thinking?.["type"] === "enabled"
      if (enabled && budgetTokens > 0) {
        // Return text tokens so that text + thinking <= model cap, preferring 32k text when possible.
        if (budgetTokens + standardLimit <= modelCap) {
          return standardLimit
        }
        return modelCap - budgetTokens
      }
    }

    return standardLimit
  }

  export function schema(_providerID: string, _modelID: string, schema: JSONSchema.BaseSchema) {
    /*
    if (["openai", "azure"].includes(providerID)) {
      if (schema.type === "object" && schema.properties) {
        for (const [key, value] of Object.entries(schema.properties)) {
          if (schema.required?.includes(key)) continue
          schema.properties[key] = {
            anyOf: [
              value as JSONSchema.JSONSchema,
              {
                type: "null",
              },
            ],
          }
        }
      }
    }

    if (providerID === "google") {
    }
    */

    return schema
  }

  export function error(providerID: string, message: string) {
    if (providerID === "github-copilot" && message.includes("The requested model is not supported")) {
      message +=
        "\n\nMake sure the model is enabled in your copilot settings: https://github.com/settings/copilot/features"
    }
    return message
  }
}
