# Migrating from OpenCode to VeniceCode

Welcome! If you're coming from the archived `opencode-ai/opencode` project, this guide will help you transition to VeniceCode smoothly.

## Why Migrate?

OpenCode was archived in September 2025, meaning it will no longer receive updates, bug fixes, or new features. VeniceCode is a community-driven fork that continues the legacy of OpenCode while adding new capabilities and optimizations for the Venice.ai platform.

## What's Different?

VeniceCode is built on a TypeScript/Bun stack, making it more accessible to web developers and easier to extend. It also includes several enhancements that were not present in the original OpenCode:

- **Venice.ai Optimization:** VeniceCode is designed to work seamlessly with Venice.ai models, including critical fixes for models like GLM 4.6 and Qwen 3 Coder.
- **Modern Tech Stack:** Built with TypeScript and Bun for better performance and developer experience.
- **Actively Maintained:** Regular updates, bug fixes, and community support.

## Installation

VeniceCode is easy to install. Simply clone the repository and install the dependencies:

```bash
git clone https://github.com/georgeglarson/venicecode.git
cd venicecode
bun install
```

## Configuration

If you were using OpenCode, you'll find the configuration process familiar. VeniceCode uses environment variables for API keys and other settings:

```bash
export VENICE_API_KEY="your-api-key-here"
```

## Running VeniceCode

To start VeniceCode, simply run:

```bash
bun run dev
```

This will launch the terminal-based interface, just like OpenCode.

## Differences in Usage

VeniceCode maintains the same core interface and commands as OpenCode, so you should feel right at home. However, there are a few differences to be aware of:

- **Venice.ai Models:** VeniceCode is optimized for Venice.ai, so you'll get the best experience when using Venice.ai API keys.
- **TypeScript Plugins:** If you were using custom plugins or extensions, you'll need to rewrite them in TypeScript. However, this also means you can leverage the full power of the TypeScript ecosystem.

## Getting Help

If you run into any issues during the migration process, please don't hesitate to reach out:

- **[Open an Issue](https://github.com/georgeglarson/venicecode/issues):** Report bugs or ask questions.
- **[Join the Discussion](https://github.com/georgeglarson/venicecode/discussions):** Connect with other users and contributors.

We're here to help!
