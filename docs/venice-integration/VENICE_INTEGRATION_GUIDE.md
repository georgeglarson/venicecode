# Venice.ai Integration Guide for OpenCode

This guide provides templates and configuration examples to make it easy for users to integrate Venice.ai models with OpenCode.

## Quick Start

### 1. Set Your API Key

```bash
export VENICE_API_KEY="your-venice-api-key-here"
```

Get your API key from [venice.ai/settings/api](https://venice.ai/settings/api).

### 2. Configure OpenCode

Create or edit `~/.opencode/config.json`:

```json
{
  "provider": {
    "venice": {
      "npm": "@venice-dev-tools/core",
      "options": {
        "apiKey": "$VENICE_API_KEY"
      }
    }
  }
}
```

### 3. Start Using Venice.ai Models

```bash
opencode --model venice/llama-3.3-70b
```

## Configuration Templates

### Basic Configuration

The simplest setup - just add your API key:

```json
{
  "provider": {
    "venice": {
      "npm": "@venice-dev-tools/core",
      "options": {
        "apiKey": "$VENICE_API_KEY"
      }
    }
  }
}
```

### Advanced Configuration

With custom base URL and headers:

```json
{
  "provider": {
    "venice": {
      "npm": "@venice-dev-tools/core",
      "options": {
        "apiKey": "$VENICE_API_KEY",
        "baseURL": "https://api.venice.ai/v1",
        "headers": {
          "X-Title": "opencode"
        }
      }
    }
  }
}
```

### Model Selection

Specify which Venice.ai models to use:

```json
{
  "provider": {
    "venice": {
      "npm": "@venice-dev-tools/core",
      "options": {
        "apiKey": "$VENICE_API_KEY"
      }
    }
  },
  "models": {
    "venice": [
      "llama-3.3-70b",
      "llama-3.1-405b-reasoning",
      "llama-3.1-70b-versatile",
      "codestral-22b-instruct",
      "gemma-2-27b-it"
    ]
  }
}
```

## Available Venice.ai Models

Venice.ai provides access to a wide range of open-source models:

### Llama Models

- `llama-3.3-70b` - Latest Llama 3.3 (recommended for most tasks)
- `llama-3.1-405b-reasoning` - Largest Llama model for complex reasoning
- `llama-3.1-70b-versatile` - Balanced performance and speed
- `llama-3.1-8b-instant` - Fast responses for simple tasks

### Specialized Models

- `codestral-22b-instruct` - Optimized for code generation
- `gemma-2-27b-it` - Google's Gemma for instruction following
- `gemma-2-9b-it` - Smaller Gemma variant
- `mixtral-8x22b-instruct` - Mixture of experts model
- `firellava-13b` - Multimodal vision model

## Environment Variables

You can configure Venice.ai using environment variables:

```bash
# Required
export VENICE_API_KEY="your-api-key"

# Optional
export VENICE_BASE_URL="https://api.venice.ai/v1"
```

## Usage Examples

### CLI Usage

```bash
# Use default Venice model
opencode --provider venice

# Use specific Venice model
opencode --model venice/llama-3.3-70b

# Use Venice for a specific task
opencode --model venice/codestral-22b-instruct "Write a function to sort an array"
```

### Programmatic Usage

If you're using OpenCode programmatically:

```typescript
import { VeniceAI } from "@venice-dev-tools/core"

const venice = new VeniceAI({
  apiKey: process.env.VENICE_API_KEY!,
})

const completion = await venice.chat.completions.create({
  model: "llama-3.3-70b",
  messages: [{ role: "user", content: "Explain how Venice.ai works" }],
})

console.log(completion.choices[0].message.content)
```

## Troubleshooting

### "Invalid input: expected string, received array"

This error occurs with some Venice.ai models that send content as arrays. **This has been fixed in OpenCode PR #4715**. If you're still seeing this error:

1. Update to the latest OpenCode version
2. Or use the venicecode fork: `https://github.com/georgeglarson/venicecode`

### API Key Not Found

Make sure your `VENICE_API_KEY` environment variable is set:

```bash
echo $VENICE_API_KEY
```

If empty, export it:

```bash
export VENICE_API_KEY="your-key-here"
```

### Model Not Available

Check that the model ID is correct. Venice.ai model IDs are case-sensitive and should match exactly.

## Privacy & Security

Venice.ai is privacy-focused:

- **No data retention**: Your prompts and responses are not stored
- **No training**: Your data is never used to train models
- **Client-side encryption**: Available for sensitive data

When using Venice.ai with OpenCode, your code and prompts are sent directly to Venice.ai's API and are not stored or logged.

## Best Practices

### Model Selection

- **General coding**: `llama-3.3-70b` or `codestral-22b-instruct`
- **Complex reasoning**: `llama-3.1-405b-reasoning`
- **Fast iterations**: `llama-3.1-8b-instant`
- **Vision tasks**: `firellava-13b`

### Performance Optimization

1. **Use specific models**: Instead of relying on defaults, specify the exact model for your use case
2. **Cache API key**: Set `VENICE_API_KEY` in your shell profile to avoid re-exporting
3. **Rate limiting**: Venice.ai has generous rate limits, but consider implementing backoff for production use

### Cost Management

Venice.ai offers competitive pricing. To optimize costs:

- Use smaller models (`8b`, `9b`) for simple tasks
- Use larger models (`70b`, `405b`) only when needed
- Monitor your usage at [venice.ai/settings/usage](https://venice.ai/settings/usage)

## Integration with venice-dev-tools

For more advanced Venice.ai features, use the `venice-dev-tools` SDK:

```bash
pnpm add @venice-dev-tools/core
```

Features include:

- Rate limiting and retries
- Streaming support
- Privacy-forward defaults
- Client-side redaction
- 170+ automated tests

See the [venice-dev-tools README](https://github.com/georgeglarson/venice-dev-tools) for full documentation.

## Contributing

Found an issue or want to improve Venice.ai support in OpenCode?

1. Check existing issues: https://github.com/sst/opencode/issues
2. Open a PR: https://github.com/sst/opencode/pulls
3. Reference PR #4715 for the array content fix

## Resources

- **Venice.ai Platform**: https://venice.ai
- **API Documentation**: https://docs.venice.ai
- **OpenCode Repository**: https://github.com/sst/opencode
- **venice-dev-tools SDK**: https://github.com/georgeglarson/venice-dev-tools
- **Array Content Fix PR**: https://github.com/sst/opencode/pull/4715

## Support

- **Venice.ai Discord**: Join the Venice.ai community
- **OpenCode Discord**: https://discord.gg/opencode
- **GitHub Issues**: Report bugs or request features

---

**Last Updated**: November 24, 2025  
**OpenCode Version**: 1.0.109+  
**Venice.ai API Version**: v1
