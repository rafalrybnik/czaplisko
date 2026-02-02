#!/bin/bash
# Safe deployment script for Railway
# Prevents accidental deployment to wrong service (e.g., Postgres instead of cms)

set -e

EXPECTED_SERVICE="cms"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚂 Railway Safe Deploy Script"
echo "=============================="

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}Error: Railway CLI not installed${NC}"
    echo "Install with: npm install -g @railway/cli"
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo -e "${RED}Error: Not logged in to Railway${NC}"
    echo "Run: railway login"
    exit 1
fi

# Get current linked service
CURRENT_SERVICE=$(railway status 2>/dev/null | grep "Service:" | awk '{print $2}' || echo "")

if [ -z "$CURRENT_SERVICE" ]; then
    echo -e "${YELLOW}Warning: No service linked${NC}"
    echo "Linking to $EXPECTED_SERVICE..."
    railway link --service "$EXPECTED_SERVICE"
    CURRENT_SERVICE="$EXPECTED_SERVICE"
fi

# Verify correct service
if [ "$CURRENT_SERVICE" != "$EXPECTED_SERVICE" ]; then
    echo -e "${RED}ERROR: Wrong service linked!${NC}"
    echo "  Current:  $CURRENT_SERVICE"
    echo "  Expected: $EXPECTED_SERVICE"
    echo ""
    echo -e "${YELLOW}Switching to correct service...${NC}"
    railway link --service "$EXPECTED_SERVICE"
fi

# Final confirmation
echo ""
echo -e "${GREEN}Service verified: $EXPECTED_SERVICE${NC}"
echo ""

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}Warning: You have uncommitted changes${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
fi

# Deploy
echo "🚀 Starting deployment..."
railway up --detach

echo ""
echo -e "${GREEN}Deployment started!${NC}"
echo "Monitor with: railway logs"
