#!/bin/bash
set -e

echo "🚀 Starting Railway deployment..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is not set"
    exit 1
fi

echo "📊 Database URL found: ${DATABASE_URL:0:20}..."

# Run database migrations
echo "🔄 Running database migrations..."
yarn prisma:deploy

# Generate Prisma client (should already be done in build, but just in case)
echo "🔧 Generating Prisma client..."
yarn prisma:generate

# Optional: Run seeding if RAILWAY_SEED environment variable is set
if [ "$RAILWAY_SEED" = "true" ]; then
    echo "🌱 Seeding database..."
    yarn railway:seed
else
    echo "⏭️  Skipping database seeding (set RAILWAY_SEED=true to enable)"
fi

echo "✅ Railway setup complete, starting application..."

# Start the application
exec node dist/main.js