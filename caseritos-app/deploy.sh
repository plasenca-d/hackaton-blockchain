#!/bin/bash

# Ensure we're in the caseritos-app directory
cd "$(dirname "$0")"

# Build the project using OpenNext
echo "Building the Next.js project with OpenNext..."
pnpm opennextjs-cloudflare build

# Deploy to Cloudflare Workers
echo "Deploying to Cloudflare Workers..."
pnpm wrangler deploy

echo "Deployment complete!"
