@echo off
title Data Analyst Portfolio - Deployment Script
color 0A

echo ============================================
echo   DATA ANALYST PORTFOLIO DEPLOYMENT
echo ============================================
echo.

:: Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

:: Check if we're in a git repository
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo.
)

echo Current directory: %cd%
echo.

:: Get user input for deployment type
echo Choose deployment option:
echo 1. GitHub Pages
echo 2. Netlify Drop
echo 3. Build Only
echo 4. Local Server Test
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto github_pages
if "%choice%"=="2" goto netlify
if "%choice%"=="3" goto build_only
if "%choice%"=="4" goto local_test
goto invalid_choice

:github_pages
echo.
echo ========================================
echo   DEPLOYING TO GITHUB PAGES
echo ========================================
echo.

:: Check if remote origin exists
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    set /p repo_url="Enter your GitHub repository URL: "
    git remote add origin !repo_url!
)

echo Adding files to Git...
git add .

set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message="Update portfolio"

echo Committing changes...
git commit -m "%commit_message%"

echo Pushing to GitHub...
git push -u origin main

echo.
echo ✅ Successfully deployed to GitHub!
echo.
echo Your portfolio will be available at:
echo https://yourusername.github.io/repository-name
echo.
echo Note: GitHub Pages may take a few minutes to update.
echo Don't forget to enable GitHub Pages in your repository settings!
echo.
goto end

:netlify
echo.
echo ========================================
echo   PREPARING FOR NETLIFY DEPLOYMENT
echo ========================================
echo.

echo Creating deployment package...
if exist "netlify-deploy" rmdir /s /q netlify-deploy
mkdir netlify-deploy

:: Copy website files
xcopy "website\*" "netlify-deploy\" /E /Y
xcopy "css" "netlify-deploy\css\" /E /Y
xcopy "js" "netlify-deploy\js\" /E /Y
xcopy "projects" "netlify-deploy\projects\" /E /Y
xcopy "assets" "netlify-deploy\assets\" /E /Y

echo.
echo ✅ Files prepared for Netlify deployment!
echo.
echo Next steps:
echo 1. Go to https://netlify.com
echo 2. Drag and drop the 'netlify-deploy' folder
echo 3. Your site will be live instantly!
echo.
goto end

:build_only
echo.
echo ========================================
echo   BUILDING PROJECT
echo ========================================
echo.

echo Checking project structure...
if not exist "website\index.html" (
    echo ERROR: website\index.html not found!
    goto end
)

if not exist "css\style.css" (
    echo ERROR: css\style.css not found!
    goto end
)

if not exist "js\script.js" (
    echo ERROR: js\script.js not found!
    goto end
)

echo ✅ All required files found!
echo.

echo Creating production build...
if exist "build" rmdir /s /q build
mkdir build

:: Copy all files to build directory
xcopy "website\*" "build\" /E /Y
xcopy "css" "build\css\" /E /Y
xcopy "js" "build\js\" /E /Y
xcopy "projects" "build\projects\" /E /Y
xcopy "assets" "build\assets\" /E /Y

echo.
echo ✅ Build completed successfully!
echo Build files are in the 'build' directory.
echo.
goto end

:local_test
echo.
echo ========================================
echo   STARTING LOCAL TEST SERVER
echo ========================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python not found. Checking for Node.js...
    
    :: Check if Node.js is installed
    node --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ERROR: Neither Python nor Node.js found!
        echo Please install Python or Node.js to run the local server.
        echo Python: https://python.org
        echo Node.js: https://nodejs.org
        goto end
    ) else (
        echo Node.js found. Installing dependencies...
        npm install
        echo.
        echo Starting Node.js server...
        echo.
        echo Your portfolio will be available at: http://localhost:3000
        echo Press Ctrl+C to stop the server.
        echo.
        npm start
    )
) else (
    echo Python found. Starting Python server...
    echo.
    echo Your portfolio will be available at: http://localhost:3000
    echo Press Ctrl+C to stop the server.
    echo.
    cd website
    python -m http.server 3000
)
goto end

:invalid_choice
echo.
echo Invalid choice. Please run the script again and choose 1-4.
echo.

:end
echo.
echo ============================================
echo   DEPLOYMENT SCRIPT COMPLETED
echo ============================================
echo.
pause
