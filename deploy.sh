#!/bin/bash

# Data Analyst Portfolio - Deployment Script for Linux/Mac
# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}============================================"
echo -e "   DATA ANALYST PORTFOLIO DEPLOYMENT"
echo -e "============================================${NC}"
echo

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}ERROR: Git is not installed${NC}"
    echo "Please install Git first:"
    echo "  Ubuntu/Debian: sudo apt-get install git"
    echo "  macOS: Install Xcode Command Line Tools"
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing Git repository...${NC}"
    git init
    echo
fi

echo -e "${BLUE}Current directory: $(pwd)${NC}"
echo

# Deployment options
echo "Choose deployment option:"
echo "1. GitHub Pages"
echo "2. Netlify Drop"
echo "3. Build Only"
echo "4. Local Server Test"
echo
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo
        echo -e "${BLUE}========================================"
        echo -e "   DEPLOYING TO GITHUB PAGES"
        echo -e "========================================${NC}"
        echo
        
        # Check if remote origin exists
        if ! git remote get-url origin &> /dev/null; then
            read -p "Enter your GitHub repository URL: " repo_url
            git remote add origin "$repo_url"
        fi
        
        echo -e "${YELLOW}Adding files to Git...${NC}"
        git add .
        
        read -p "Enter commit message (or press Enter for default): " commit_message
        if [ -z "$commit_message" ]; then
            commit_message="Update portfolio"
        fi
        
        echo -e "${YELLOW}Committing changes...${NC}"
        git commit -m "$commit_message"
        
        echo -e "${YELLOW}Pushing to GitHub...${NC}"
        git push -u origin main
        
        echo
        echo -e "${GREEN}✅ Successfully deployed to GitHub!${NC}"
        echo
        echo "Your portfolio will be available at:"
        echo "https://yourusername.github.io/repository-name"
        echo
        echo -e "${YELLOW}Note: GitHub Pages may take a few minutes to update.${NC}"
        echo -e "${YELLOW}Don't forget to enable GitHub Pages in your repository settings!${NC}"
        ;;
        
    2)
        echo
        echo -e "${BLUE}========================================"
        echo -e "   PREPARING FOR NETLIFY DEPLOYMENT"
        echo -e "========================================${NC}"
        echo
        
        echo -e "${YELLOW}Creating deployment package...${NC}"
        rm -rf netlify-deploy
        mkdir netlify-deploy
        
        # Copy website files
        cp -r website/* netlify-deploy/
        cp -r css netlify-deploy/
        cp -r js netlify-deploy/
        cp -r projects netlify-deploy/
        cp -r assets netlify-deploy/
        
        echo
        echo -e "${GREEN}✅ Files prepared for Netlify deployment!${NC}"
        echo
        echo "Next steps:"
        echo "1. Go to https://netlify.com"
        echo "2. Drag and drop the 'netlify-deploy' folder"
        echo "3. Your site will be live instantly!"
        ;;
        
    3)
        echo
        echo -e "${BLUE}========================================"
        echo -e "   BUILDING PROJECT"
        echo -e "========================================${NC}"
        echo
        
        echo -e "${YELLOW}Checking project structure...${NC}"
        
        if [ ! -f "website/index.html" ]; then
            echo -e "${RED}ERROR: website/index.html not found!${NC}"
            exit 1
        fi
        
        if [ ! -f "css/style.css" ]; then
            echo -e "${RED}ERROR: css/style.css not found!${NC}"
            exit 1
        fi
        
        if [ ! -f "js/script.js" ]; then
            echo -e "${RED}ERROR: js/script.js not found!${NC}"
            exit 1
        fi
        
        echo -e "${GREEN}✅ All required files found!${NC}"
        echo
        
        echo -e "${YELLOW}Creating production build...${NC}"
        rm -rf build
        mkdir build
        
        # Copy all files to build directory
        cp -r website/* build/
        cp -r css build/
        cp -r js build/
        cp -r projects build/
        cp -r assets build/
        
        echo
        echo -e "${GREEN}✅ Build completed successfully!${NC}"
        echo "Build files are in the 'build' directory."
        ;;
        
    4)
        echo
        echo -e "${BLUE}========================================"
        echo -e "   STARTING LOCAL TEST SERVER"
        echo -e "========================================${NC}"
        echo
        
        # Check if Python is installed
        if command -v python3 &> /dev/null; then
            echo -e "${GREEN}Python 3 found. Starting server...${NC}"
            echo
            echo -e "${YELLOW}Your portfolio will be available at: http://localhost:3000${NC}"
            echo -e "${YELLOW}Press Ctrl+C to stop the server.${NC}"
            echo
            cd website
            python3 -m http.server 3000
        elif command -v python &> /dev/null; then
            echo -e "${GREEN}Python found. Starting server...${NC}"
            echo
            echo -e "${YELLOW}Your portfolio will be available at: http://localhost:3000${NC}"
            echo -e "${YELLOW}Press Ctrl+C to stop the server.${NC}"
            echo
            cd website
            python -m http.server 3000
        elif command -v node &> /dev/null; then
            echo -e "${GREEN}Node.js found. Installing dependencies...${NC}"
            npm install
            echo
            echo -e "${GREEN}Starting Node.js server...${NC}"
            echo
            echo -e "${YELLOW}Your portfolio will be available at: http://localhost:3000${NC}"
            echo -e "${YELLOW}Press Ctrl+C to stop the server.${NC}"
            echo
            npm start
        else
            echo -e "${RED}ERROR: Neither Python nor Node.js found!${NC}"
            echo "Please install Python or Node.js to run the local server."
            echo "  Python: https://python.org"
            echo "  Node.js: https://nodejs.org"
            exit 1
        fi
        ;;
        
    *)
        echo
        echo -e "${RED}Invalid choice. Please run the script again and choose 1-4.${NC}"
        exit 1
        ;;
esac

echo
echo -e "${BLUE}============================================"
echo -e "   DEPLOYMENT SCRIPT COMPLETED"
echo -e "============================================${NC}"
echo
