#!/bin/sh
set -e

echo "Running Prisma db push to sync schema..."
npx prisma db push

echo "Starting server..."
exec node .output/server/index.mjs
