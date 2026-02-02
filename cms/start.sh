#!/bin/sh

# NOTE: prisma db push removed - run migrations manually before deployment
# npx prisma db push should be run in CI/CD pipeline, not on every container start

echo "Starting server..."
exec node .output/server/index.mjs
