# VeniceCode: The Venice.ai-Optimized Fork of OpenCode

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

**VeniceCode** is a fork of the popular and actively maintained `sst/opencode` project, optimized for use with the [Venice.ai](https://venice.ai) platform.

This fork exists to provide a version of OpenCode that is specifically tailored for Venice.ai users, with enhanced model compatibility and deeper integration with the Venice.ai ecosystem.

## Why Use VeniceCode?

While the upstream `sst/opencode` is an excellent project, VeniceCode offers a few key advantages for Venice.ai users:

- **Enhanced Model Compatibility:** Includes a critical fix for models like GLM 4.6 and Qwen 3 Coder that send array content, which is not yet available in the upstream project.
- **Venice.ai Optimized:** Designed to work seamlessly with the Venice.ai API, with plans for deeper integration and Venice-specific features.
- **Privacy-Focused:** Leverages the privacy-preserving features of the Venice.ai platform.
- **Powered by `venice-dev-tools`:** Built on a production-ready, battle-tested SDK for the Venice.ai platform.

## Key Features

- **All the features of `sst/opencode`:** VeniceCode is a superset of the upstream project, so you get all the features you know and love.
- **Seamless Venice.ai Integration:** Just set your `VENICE_API_KEY` and you're ready to go.
- **Fix for Array Content:** Ensures that models that send content as arrays (like GLM 4.6 and Qwen 3 Coder) work out of the box.

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

## Contributing

We welcome contributions! If you have ideas for how to improve VeniceCode or want to help with development, please open an issue or submit a pull request.

Our goal is to contribute our changes back to the upstream `sst/opencode` project where possible, while also providing a dedicated space for Venice.ai-specific features.

## License

VeniceCode is licensed under the [MIT License](LICENSE).
