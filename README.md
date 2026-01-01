# Project Topic Viewer

A beautiful, interactive web application for viewing and filtering project topics.

## 🚀 Hosting on GitHub Pages

This project is set up to automatically deploy to GitHub Pages using GitHub Actions.

### Setup Instructions (IMPORTANT - Follow in Order!)

#### Step 1: Enable GitHub Pages FIRST (Before Pushing Code)

**⚠️ CRITICAL: You must enable GitHub Pages BEFORE the workflow runs, or you'll get an error!**

1. Go to your GitHub repository on GitHub.com
2. Click **Settings** (top menu bar)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **"GitHub Actions"** (NOT "Deploy from a branch")
5. Click **Save** (if there's a save button)
6. **Do NOT close this page yet** - verify it says "GitHub Actions" is selected

#### Step 2: Push Your Code to GitHub

```bash
git init
git add .
git commit -m "Setup GitHub Pages"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

#### Step 3: Verify Deployment

1. Go to your repository → **Actions** tab
2. You should see "Deploy to GitHub Pages" workflow running
3. Wait for it to complete (green checkmark)
4. Go back to **Settings** → **Pages**
5. Your site URL will be shown at the top

#### Step 4: Access Your Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

### Troubleshooting

**If you get "Get Pages site failed" error:**

1. ✅ Make sure GitHub Pages is enabled in Settings → Pages
2. ✅ Make sure "GitHub Actions" is selected as the source (NOT a branch)
3. ✅ Make sure your repository is public (or you have GitHub Pro/Team for private repos)
4. ✅ Wait a few minutes after enabling Pages, then re-run the workflow
5. ✅ Check the Actions tab for any error messages

**To re-run the workflow:**
- Go to **Actions** tab → Click on the workflow → Click **"Re-run jobs"**

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

