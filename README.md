# VeniceCode: The Venice.ai-Optimized Coding Agent

<p align="center">
  <a href="https://github.com/georgeglarson/venicecode">
    <img src="https://raw.githubusercontent.com/georgeglarson/venice-dev-tools/main/docs/assets/venice-logo-wordmark-black.svg" alt="VeniceCode Logo" width="400">
  </a>
</p>

<p align="center">
  <b>The AI coding agent for developers who value privacy and performance.</b>
</p>

<p align="center">
  <a href="https://github.com/georgeglarson/venicecode/stargazers"><img src="https://img.shields.io/github/stars/georgeglarson/venicecode?style=flat-square" alt="Stars"></a>
  <a href="https://github.com/georgeglarson/venicecode/forks"><img src="https://img.shields.io/github/forks/georgeglarson/venicecode?style=flat-square" alt="Forks"></a>
  <a href="https://github.com/georgeglarson/venicecode/issues"><img src="https://img.shields.io/github/issues/georgeglarson/venicecode?style=flat-square" alt="Issues"></a>
  <a href="https://github.com/georgeglarson/venice-dev-tools"><img src="https://img.shields.io/badge/powered%20by-venice--dev--tools-blue?style=flat-square" alt="Powered by venice-dev-tools"></a>
  <a href="https://github.com/georgeglarson/venicecode/blob/main/LICENSE"><img src="https://img.shields.io/github/license/georgeglarson/venicecode?style=flat-square" alt="License"></a>
</p>

---

**VeniceCode** is a powerful, terminal-based AI coding agent for developers, built on a modern TypeScript/Bun stack. It is a community-driven fork of the archived `opencode-ai/opencode` project, optimized for use with the [Venice.ai](https://venice.ai) platform.

If you were a fan of OpenCode and are looking for an actively maintained, privacy-focused alternative, you're in the right place.

## Why VeniceCode?

When `opencode` was archived, the official successor became `crush`, a Go-based project. While `crush` is a great tool, we believe there is a need for a TypeScript-native alternative that is deeply integrated with the Venice.ai ecosystem.

| Feature                 | **VeniceCode**         | **Crush (Successor)**  | **OpenCode (Archived)** |
| :---------------------- | :--------------------- | :--------------------- | :---------------------- |
| **Language**            | **TypeScript/Bun**     | Go                     | Go                      |
| **Status**              | ✅ Actively Maintained | ✅ Actively Maintained | ❌ Archived             |
| **Venice.ai Optimized** | ✅ **Yes**             | ⚠️ Partial (via PR)    | ❌ No                   |
| **Community**           | 🚀 Growing             | established            | 흩어진                  |
| **Accessibility**       | High (for JS/TS devs)  | Medium                 | Medium                  |
| **Extensibility**       | High (JS/TS plugins)   | Medium                 | Low                     |

### Key Advantages

- **Modern Tech Stack:** Built with TypeScript and Bun, making it fast, efficient, and easy for web developers to contribute.
- **Venice.ai First:** Designed from the ground up for seamless integration with Venice.ai, ensuring optimal performance and compatibility.
- **Privacy-Focused:** Leverages the privacy-preserving features of the Venice.ai platform.
- **Community-Driven:** As a fork of a beloved project, we are committed to building in the open and listening to our users.
- **Familiar Interface:** If you loved OpenCode, you'll feel right at home with VeniceCode.

## Key Features

- **Enhanced Model Compatibility:** Includes critical fixes for models like GLM 4.6 and Qwen 3 Coder that send array content.
- **Seamless Venice.ai Integration:** Just set your `VENICE_API_KEY` and you're ready to go.
- **Powered by `venice-dev-tools`:** Built on a production-ready, battle-tested SDK for the Venice.ai platform.
- **Interactive TUI:** A smooth, terminal-based user interface for an exceptional developer experience.
- **Extensible Tooling:** Easily add new tools and capabilities using TypeScript.

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/georgeglarson/venicecode.git
cd venicecode

# Install dependencies
bun install

# Run VeniceCode
bun run dev
```

### Configuration

To get started, simply set your Venice.ai API key as an environment variable:

```bash
export VENICE_API_KEY="your-api-key-here"
```

## The Future of VeniceCode

We believe VeniceCode has the potential to become the go-to AI coding agent for the TypeScript and Venice.ai communities. Our roadmap includes:

- **Deeper Venice.ai Integration:** Custom prompts, model presets, and performance tuning.
- **Web-Based UI:** A browser-based interface for those who prefer a GUI.
- **VS Code Extension:** Bring the power of VeniceCode directly into your editor.
- **Plugin Ecosystem:** A rich ecosystem of community-contributed tools and extensions.

## Community & Contributing

We are actively looking for contributors to help us build the future of AI-powered development. Whether you're a developer, designer, or just an enthusiastic user, we'd love to have you on board.

- **[Open Issues](https://github.com/georgeglarson/venicecode/issues):** See where you can help.
- **[Pull Requests](https://github.com/georgeglarson/venicecode/pulls):** Contribute your code.
- **[Discussions](https://github.com/georgeglarson/venicecode/discussions):** Share your ideas.

This project is a community effort, and we welcome all contributions. Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

## A Note to the OpenCode Community

We are grateful for the work of the original OpenCode team. VeniceCode aims to continue the legacy of this great project while adapting it for the future of AI development with Venice.ai. If you're looking for a new home for your AI coding agent, we invite you to join us.

## License

VeniceCode is licensed under the [MIT License](LICENSE).
