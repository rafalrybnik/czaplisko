#!/bin/sh

echo "Running Prisma db push to sync schema..."
npx prisma db push || echo "Warning: prisma db push failed, continuing with existing schema..."

echo "Starting server..."
exec node .output/server/index.mjs
