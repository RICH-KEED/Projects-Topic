# Project Topic Viewer

A beautiful, interactive web application for viewing and filtering project topics.

## 🚀 Hosting on GitHub Pages

This project is set up to automatically deploy to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically deploy your site

3. **Your site will be available at:**
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
   ```

### Files Included

- `index.html` - Main HTML file (renamed from project-viewer.html for GitHub Pages)
- `response.html` - Data file containing project information
- `.github/workflows/deploy.yml` - GitHub Actions workflow for automatic deployment

### How It Works

- The HTML file loads data from `response.html` using JavaScript
- GitHub Actions automatically builds and deploys your site when you push to the main branch
- No server-side code needed - it's all static files!

### Notes

- The proxy server (`proxy-server.js`) won't work on GitHub Pages since it requires Node.js
- Make sure `response.html` is included in your repository
- The site will automatically update whenever you push changes to the main branch

