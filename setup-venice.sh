#!/usr/bin/env bash
# Venice.ai Setup Script for OpenCode
# This script helps you quickly configure Venice.ai with OpenCode

set -e

echo "🌊 Venice.ai Setup for OpenCode"
echo "================================"
echo ""

# Check if VENICE_API_KEY is set
if [ -z "$VENICE_API_KEY" ]; then
  echo "❌ VENICE_API_KEY environment variable is not set."
  echo ""
  echo "To get your API key:"
  echo "1. Visit https://venice.ai/settings/api"
  echo "2. Generate a new API key"
  echo "3. Export it: export VENICE_API_KEY=\"your-key-here\""
  echo ""
  exit 1
fi

echo "✅ VENICE_API_KEY found"
echo ""

# Create .opencode directory if it doesn't exist
OPENCODE_DIR="$HOME/.opencode"
if [ ! -d "$OPENCODE_DIR" ]; then
  echo "📁 Creating $OPENCODE_DIR directory..."
  mkdir -p "$OPENCODE_DIR"
fi

# Create or update config.json
CONFIG_FILE="$OPENCODE_DIR/config.json"

if [ -f "$CONFIG_FILE" ]; then
  echo "⚠️  Config file already exists at $CONFIG_FILE"
  echo "Creating backup at $CONFIG_FILE.backup"
  cp "$CONFIG_FILE" "$CONFIG_FILE.backup"
fi

echo "📝 Writing Venice.ai configuration..."

cat > "$CONFIG_FILE" << 'EOF'
{
  "$schema": "https://opencode.ai/config.json",
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
  },
  "models": {
    "venice": [
      "llama-3.3-70b",
      "llama-3.1-405b-reasoning",
      "llama-3.1-70b-versatile",
      "llama-3.1-8b-instant",
      "codestral-22b-instruct",
      "gemma-2-27b-it",
      "gemma-2-9b-it",
      "mixtral-8x22b-instruct",
      "firellava-13b"
    ]
  }
}
EOF

echo "✅ Configuration written to $CONFIG_FILE"
echo ""
echo "🎉 Venice.ai is now configured for OpenCode!"
echo ""
echo "Try it out:"
echo "  opencode --model venice/llama-3.3-70b"
echo ""
echo "Available models:"
echo "  - llama-3.3-70b (recommended)"
echo "  - llama-3.1-405b-reasoning (complex tasks)"
echo "  - codestral-22b-instruct (code generation)"
echo "  - llama-3.1-8b-instant (fast responses)"
echo ""
echo "For more information, see the Venice Integration Guide."
