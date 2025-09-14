#!/bin/bash
set -e

echo "🔧 Installing dependencies..."

# Try frozen lockfile first, fallback to regular install
if ! yarn install --frozen-lockfile --non-interactive --production=false; then
    echo "⚠️  Frozen lockfile failed, trying regular install..."
    yarn install --non-interactive --production=false
fi

echo "✅ Dependencies installed successfully"