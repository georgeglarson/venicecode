import z from "zod"

/**
 * Helper to handle both string and array of strings for tool parameters.
 * Some models (GLM 4.6, Qwen 3 Coder) send arrays instead of strings.
 * This preprocessor normalizes the input to always be a string.
 * 
 * @param description - The description for the zod schema
 * @returns A zod schema that accepts string or array and outputs string
 */
export function stringOrArray(description: string) {
  return z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        return val
      }
      if (Array.isArray(val)) {
        // Join array elements with newlines
        return val.map(item => String(item)).join('\n')
      }
      return String(val)
    },
    z.string().describe(description)
  )
}

/**
 * Same as stringOrArray but for optional parameters
 */
export function stringOrArrayOptional(description: string) {
  return z.preprocess(
    (val) => {
      if (val === undefined || val === null) {
        return undefined
      }
      if (typeof val === 'string') {
        return val
      }
      if (Array.isArray(val)) {
        return val.map(item => String(item)).join('\n')
      }
      return String(val)
    },
    z.string().describe(description).optional()
  )
}
