import { describe, expect, test } from "bun:test"
import z from "zod"

// Test the preprocess logic used in write tool for Venice model compatibility
const contentSchema = z.preprocess((val) => {
  if (typeof val === "string") {
    return val
  }
  if (Array.isArray(val)) {
    // Join array elements with newlines
    return val.map((item) => String(item)).join("\n")
  }
  return String(val)
}, z.string())

describe("WriteTool content preprocessing", () => {
  describe("Venice model compatibility - array content handling", () => {
    test("handles string content (standard format)", () => {
      const input = "line 1\nline 2\nline 3"
      const result = contentSchema.parse(input)
      expect(result).toBe("line 1\nline 2\nline 3")
    })

    test("handles array content from GLM 4.6 model", () => {
      const input = ["line 1", "line 2", "line 3"]
      const result = contentSchema.parse(input)
      expect(result).toBe("line 1\nline 2\nline 3")
    })

    test("handles array content from Qwen 3 Coder model", () => {
      const input = ["const x = 1;", "const y = 2;", "console.log(x + y);"]
      const result = contentSchema.parse(input)
      expect(result).toBe("const x = 1;\nconst y = 2;\nconsole.log(x + y);")
    })

    test("handles single-element array", () => {
      const input = ["single line"]
      const result = contentSchema.parse(input)
      expect(result).toBe("single line")
    })

    test("handles empty array", () => {
      const input: string[] = []
      const result = contentSchema.parse(input)
      expect(result).toBe("")
    })

    test("handles array with mixed types (converts to strings)", () => {
      const input = ["text", 123, true, null]
      const result = contentSchema.parse(input)
      expect(result).toBe("text\n123\ntrue\nnull")
    })

    test("handles non-string non-array input (converts to string)", () => {
      const input = 12345
      const result = contentSchema.parse(input)
      expect(result).toBe("12345")
    })

    test("handles empty string", () => {
      const input = ""
      const result = contentSchema.parse(input)
      expect(result).toBe("")
    })

    test("preserves multiline string content", () => {
      const input = `function hello() {
  console.log("Hello, World!");
}

hello();`
      const result = contentSchema.parse(input)
      expect(result).toBe(input)
    })
  })
})
