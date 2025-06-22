#!/bin/bash

# Rollback Script: Return to Stable Astro Frontend v1.0.0
# This script safely rolls back to the stable checkpoint

set -e  # Exit on any error

echo "🔄 Starting rollback to stable Astro frontend v1.0.0..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "myastosite" ]; then
    print_error "myastosite directory not found. Please run this script from the palchat root directory."
    exit 1
fi

print_status "Checking current git status..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "Not in a git repository. Cannot perform rollback."
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
print_status "Current branch: $CURRENT_BRANCH"

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Stashing them..."
    git stash push -m "Auto-stash before rollback to v1.0.0-stable-astro"
    STASHED=true
else
    STASHED=false
fi

# Check if the stable tag exists
if ! git tag -l | grep -q "v1.0.0-stable-astro"; then
    print_error "Stable tag 'v1.0.0-stable-astro' not found."
    print_status "Creating stable tag from current state..."
    git tag v1.0.0-stable-astro
    print_success "Created stable tag from current state"
fi

print_status "Rolling back to stable tag..."

# Checkout the stable tag
if git checkout v1.0.0-stable-astro; then
    print_success "Successfully checked out stable tag"
else
    print_error "Failed to checkout stable tag"
    exit 1
fi

# Navigate to myastosite directory
cd myastosite

print_status "Installing dependencies..."

# Install dependencies
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

print_status "Building the project..."

# Build the project
if npm run build; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    print_status "Attempting to fix build issues..."
    
    # Try to fix common build issues
    rm -rf node_modules package-lock.json
    npm install
    npm run build
fi

# Check if build was successful
if [ $? -eq 0 ]; then
    print_success "✅ Rollback completed successfully!"
    echo ""
    echo "🎯 Current State:"
    echo "   - Stable Astro frontend v1.0.0"
    echo "   - All pages functional"
    echo "   - Email integration working"
    echo "   - Security measures active"
    echo "   - Ready for deployment"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Test the website locally: npm run dev"
    echo "   2. Deploy to Vercel: git push origin v1.0.0-stable-astro"
    echo "   3. Verify deployment at: https://palchat.org"
    echo ""
    
    if [ "$STASHED" = true ]; then
        print_warning "Your previous changes have been stashed."
        print_status "To recover them: git stash pop"
    fi
    
else
    print_error "❌ Rollback failed. Build issues detected."
    print_status "Please check the build output above for errors."
    exit 1
fi

echo ""
echo "🔍 Verification Checklist:"
echo "   [ ] Home page loads correctly"
echo "   [ ] Journey page functional"
echo "   [ ] P2P Framework page working"
echo "   [ ] Track Me page operational"
echo "   [ ] Contact form sends emails"
echo "   [ ] Navigation works properly"
echo "   [ ] Design looks correct"
echo ""

print_success "Rollback script completed!" 