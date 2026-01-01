# Quick Setup Guide for GitHub Pages

## ⚠️ IMPORTANT: Enable Pages BEFORE Running Workflow

The error "Get Pages site failed" happens when GitHub Pages isn't enabled yet. Follow these steps **in order**:

## Step-by-Step Setup

### 1. Enable GitHub Pages (Do This First!)

1. Go to your repository on GitHub.com: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`
2. Click **Settings** (top right of repository page)
3. In the left sidebar, click **Pages**
4. Under **"Build and deployment"** → **"Source"**, select:
   - ✅ **"GitHub Actions"** (NOT "Deploy from a branch")
5. Click **Save** if there's a button
6. **Verify** it shows "GitHub Actions" as the source

### 2. Push Your Code

```bash
# If you haven't initialized git yet
git init
git add .
git commit -m "Initial commit with GitHub Pages setup"
git branch -M main

# Add your remote (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 3. Check the Workflow

1. Go to the **Actions** tab in your repository
2. You should see "GitHub Pages" workflow running
3. Wait for it to complete (may take 1-2 minutes)
4. If it fails, see troubleshooting below

### 4. Find Your Site URL

After successful deployment:
- Go to **Settings** → **Pages**
- Your site URL will be shown at the top:
  ```
  https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
  ```

## Troubleshooting

### Error: "Get Pages site failed"

**Solution:**
1. ✅ Go to **Settings** → **Pages**
2. ✅ Make sure **"GitHub Actions"** is selected (not a branch)
3. ✅ If it's not selected, select it and save
4. ✅ Go to **Actions** tab → Click on failed workflow → **"Re-run jobs"**

### Error: "Not Found" or "404"

**Solution:**
- Wait 2-3 minutes after deployment completes
- GitHub Pages can take a few minutes to propagate
- Try accessing: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
- Make sure your repository is **public** (or you have GitHub Pro/Team)

### Workflow Not Running

**Solution:**
1. Check that you pushed to `main` or `master` branch
2. Go to **Actions** tab and manually trigger: **"Run workflow"** button
3. Make sure `.github/workflows/pages.yml` exists in your repo

### Still Having Issues?

1. Check repository visibility:
   - Public repos: Free GitHub Pages
   - Private repos: Requires GitHub Pro/Team/Enterprise

2. Verify files are in repository:
   - `index.html` should be in root
   - `response.html` should be in root
   - `.github/workflows/pages.yml` should exist

3. Check Actions permissions:
   - Go to **Settings** → **Actions** → **General**
   - Make sure "Workflow permissions" allows "Read and write permissions"

## Alternative: Manual Deployment (If Actions Don't Work)

If GitHub Actions continues to fail, you can use the traditional method:

1. Go to **Settings** → **Pages**
2. Under **Source**, select **"Deploy from a branch"**
3. Select branch: **main** or **master**
4. Select folder: **/ (root)**
5. Click **Save**
6. Your site will be at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

Note: With this method, you need to push to the branch to update the site (no automatic deployment).

