#!/bin/bash

# BNI LOS Frontend - Automated Rehost Script
# This script pulls latest code, rebuilds, and restarts the application

set -e  # Exit on error

echo "=========================================="
echo "BNI LOS Frontend - Rehost Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="bni-los-webapp"
PORT=8080
PROJECT_DIR="$HOME/bni-los-frontend/bni-los-webapp_v1"

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}➜ $1${NC}"
}

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    print_info "Navigating to project directory: $PROJECT_DIR"
    cd "$PROJECT_DIR" || {
        print_error "Failed to navigate to $PROJECT_DIR"
        exit 1
    }
fi

print_success "In project directory: $(pwd)"
echo ""

# Step 1: Stop existing process if running with PM2
print_info "Stopping existing application (if running)..."
if command -v pm2 &> /dev/null; then
    pm2 stop $APP_NAME 2>/dev/null || print_info "No existing PM2 process found"
    print_success "Existing process stopped"
else
    print_info "PM2 not installed, skipping process stop"
fi
echo ""

# Step 2: Pull latest code from GitHub
print_info "Pulling latest code from GitHub..."
git pull origin main || {
    print_error "Failed to pull latest code"
    exit 1
}
print_success "Code updated successfully"
echo ""

# Step 3: Install dependencies
print_info "Installing/updating dependencies..."
npm install || {
    print_error "Failed to install dependencies"
    exit 1
}
print_success "Dependencies installed"
echo ""

# Step 4: Build application
print_info "Building application..."
npm run build || {
    print_error "Build failed"
    exit 1
}
print_success "Application built successfully"
echo ""

# Step 5: Start/Restart application with PM2
if command -v pm2 &> /dev/null; then
    print_info "Starting application with PM2 on port $PORT..."
    
    # Check if process exists
    if pm2 list | grep -q $APP_NAME; then
        print_info "Restarting existing PM2 process..."
        pm2 restart $APP_NAME || {
            print_error "Failed to restart application"
            exit 1
        }
    else
        print_info "Starting new PM2 process..."
        pm2 start npm --name "$APP_NAME" -- run preview -- --port $PORT || {
            print_error "Failed to start application"
            exit 1
        }
    fi
    
    # Save PM2 configuration
    pm2 save
    
    print_success "Application started successfully"
    echo ""
    
    # Display status
    print_info "Application status:"
    pm2 status
    
    echo ""
    print_success "Deployment complete!"
    print_info "Access the application at: http://localhost:$PORT"
    echo ""
    print_info "To view logs, run: pm2 logs $APP_NAME"
else
    print_info "PM2 not installed. Starting application directly on port $PORT..."
    print_info "Note: This will run in the foreground. Press Ctrl+C to stop."
    echo ""
    PORT=$PORT npm run preview
fi
