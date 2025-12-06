# Complete Hosting Guide for Your SAT Practice Test Website

This guide explains EXACTLY how to put your website on the internet so anyone can use it. I'll explain everything like you've never done this before.

---

## What You Need

1. A computer
2. A credit/debit card (hosting costs about $5-7/month)
3. About 1-2 hours of time
4. The website files (you already have these)

---

## Overview: What We're Doing

Your website has two parts:
1. **Frontend** - What users see (the pretty stuff)
2. **Backend** - The brain (handles data, login, etc.)

We need to put BOTH on the internet. Here's the plan:
- **Frontend** → Goes on **Vercel** (free!)
- **Backend** → Goes on **Railway** (cheap, ~$5/month)

---

## STEP 1: Create Accounts (10 minutes)

### 1.1 Create a GitHub Account
GitHub is where your code lives online. It's like Google Drive for code.

1. Go to https://github.com
2. Click "Sign Up"
3. Enter your email, create a password, pick a username
4. Verify your email

### 1.2 Create a Vercel Account
Vercel hosts your frontend for FREE.

1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to connect to your GitHub

### 1.3 Create a Railway Account
Railway hosts your backend (database + API).

1. Go to https://railway.app
2. Click "Login"
3. Choose "Login with GitHub"
4. Authorize Railway

---

## STEP 2: Put Your Code on GitHub (15 minutes)

### 2.1 Install Git
Git is a tool that uploads code to GitHub.

**On Mac:**
1. Open Terminal (press Cmd + Space, type "Terminal", press Enter)
2. Type: `git --version`
3. If it asks to install, click "Install"

**On Windows:**
1. Go to https://git-scm.com/download/win
2. Download and run the installer
3. Click "Next" through everything (default settings are fine)

### 2.2 Upload Your Code

Open Terminal (Mac) or Command Prompt (Windows), then type these commands ONE AT A TIME:

```bash
# Go to your project folder
cd ~/Downloads/sat-practice-app

# Set up git (replace with YOUR info)
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"

# Initialize the project
git init

# Add all files
git add .

# Save the files
git commit -m "Initial commit"
```

### 2.3 Create a GitHub Repository

1. Go to https://github.com
2. Click the "+" icon in the top right → "New repository"
3. Name it: `sat-practice-app`
4. Keep it "Public" (or Private if you want)
5. DON'T check any boxes
6. Click "Create repository"

### 2.4 Connect and Upload

After creating the repository, GitHub shows you commands. Run these in Terminal:

```bash
git remote add origin https://github.com/YOUR-USERNAME/sat-practice-app.git
git branch -M main
git push -u origin main
```

It will ask for your GitHub username and password. 

**Important:** For password, you need a "Personal Access Token":
1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name it anything, check "repo" box
4. Click "Generate token"
5. COPY the token (you won't see it again!)
6. Use this token as your password when pushing

---

## STEP 3: Deploy Backend on Railway (20 minutes)

### 3.1 Create New Project

1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Click "Deploy from GitHub repo"
4. Select your `sat-practice-app` repository
5. Railway will detect the code

### 3.2 Configure the Backend

Railway needs to know we only want the BACKEND folder:

1. Click on your project
2. Click "Settings"
3. Find "Root Directory" and set it to: `backend`
4. Find "Build Command" and set it to: `npm install`
5. Find "Start Command" and set it to: `npm run db:seed && npm start`

### 3.3 Add Environment Variable

1. Click "Variables"
2. Add this variable:
   - Name: `PORT`
   - Value: `3001`

### 3.4 Get Your Backend URL

1. Go to "Settings"
2. Click "Generate Domain"
3. Railway will give you a URL like: `sat-practice-app-production.up.railway.app`
4. **COPY THIS URL** - you need it for the frontend!

---

## STEP 4: Deploy Frontend on Vercel (15 minutes)

### 4.1 Import Project

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Find and select your `sat-practice-app` repository
4. Click "Import"

### 4.2 Configure the Frontend

1. Set "Root Directory" to: `frontend`
2. Framework Preset should auto-detect as "Vite"
3. Click "Environment Variables"
4. Add this variable:
   - Name: `VITE_API_URL`
   - Value: `https://YOUR-RAILWAY-URL` (the URL from Step 3.4)

### 4.3 Update Frontend Code for Production

Before deploying, we need to tell the frontend where the backend is.

1. Go back to your Terminal
2. Edit the file `frontend/src/api.ts`:

```bash
cd ~/Downloads/sat-practice-app/frontend/src
nano api.ts  # or open in any text editor
```

3. Change the beginning of the file to:

```typescript
const API_BASE = import.meta.env.VITE_API_URL || '';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
```

4. Save the file

5. Also update `frontend/src/pages/AdminPage.tsx` - find all `fetch('/admin/` and `fetch('/api/` and change them to `fetch(\`${API_BASE}/admin/\`` etc.

Actually, let me give you the simpler approach - update vite.config.ts for production:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/admin': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
```

For production, you need to set the VITE_API_URL environment variable in Vercel.

6. Push the changes:

```bash
cd ~/Downloads/sat-practice-app
git add .
git commit -m "Configure for production"
git push
```

### 4.4 Deploy!

1. Go back to Vercel
2. Click "Deploy"
3. Wait 2-3 minutes
4. Vercel will give you a URL like: `sat-practice-app.vercel.app`

**That's your live website!**

---

## STEP 5: Set Up Email Access (10 minutes)

### 5.1 Access Your Admin Panel

1. Go to: `https://your-vercel-url.vercel.app/admin`
2. This is where you manage approved emails

### 5.2 Add Approved Emails

When someone joins your Skool community:
1. Get their email address
2. Go to your admin panel
3. Type their email and click "Add"

Now they can log in to your site!

### 5.3 Bulk Add Emails

If you have many emails:
1. Put them in the bulk add box (one per line)
2. Click "Add All"

---

## How to Connect with Skool

Unfortunately, Skool doesn't have an automatic API to sync members. Here's what you do:

### Manual Method (Simple)
1. When someone joins your Skool, get their email
2. Add it to your admin panel
3. Tell them they can now access the practice tests

### Semi-Automated Method
1. Export your Skool member list (Skool → Settings → Members → Export)
2. Copy all emails
3. Paste into the "Bulk Add" section on your admin panel

---

## STEP 6: Get a Custom Domain (Optional, ~$12/year)

Want a professional URL like `satprep.com`?

### 6.1 Buy a Domain

1. Go to https://namecheap.com or https://porkbun.com
2. Search for your desired domain
3. Buy it (~$10-15/year)

### 6.2 Connect to Vercel

1. In Vercel, go to your project → Settings → Domains
2. Add your domain
3. Vercel will show you DNS records to add
4. Go to your domain registrar, find DNS settings
5. Add the records Vercel shows you
6. Wait 5-30 minutes

---

## Troubleshooting

### "The site isn't loading"
- Check if Railway backend is running (green status)
- Make sure the VITE_API_URL is correct in Vercel

### "Login isn't working"
- Make sure you added the email to the admin panel
- Check that backend is running on Railway

### "Tests aren't showing up"
- Go to Railway → your project → Logs
- Look for errors
- Make sure you ran the seed command

### "I messed something up"
- Railway: Click "Redeploy"
- Vercel: Push a new commit to GitHub, it auto-deploys

---

## Monthly Costs

- **Vercel**: FREE (for frontend)
- **Railway**: ~$5/month (for backend + database)
- **Domain** (optional): ~$12/year
- **Total**: About $5-7/month

---

## Quick Reference

| Service | What it does | URL |
|---------|--------------|-----|
| GitHub | Stores your code | github.com/you/sat-practice-app |
| Vercel | Hosts frontend | your-app.vercel.app |
| Railway | Hosts backend | your-app.up.railway.app |
| Admin Panel | Manage emails | your-app.vercel.app/admin |

---

## Need Help?

If you get stuck:
1. Copy the error message
2. Google it - someone probably had the same problem
3. Check Railway/Vercel documentation
4. Ask in their Discord communities (both have active ones)

Good luck! 🎉
