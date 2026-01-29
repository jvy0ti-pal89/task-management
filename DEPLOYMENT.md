# Deployment Guide - Railway

This task-management system is ready to deploy to **Railway** — a modern cloud platform for deploying full-stack applications.

## Quick Deploy (5 minutes)

### Prerequisites
1. GitHub account (Railway integrates with GitHub)
2. Railway account (free: railway.app)

### Step 1: Push to GitHub

```bash
# Initialize GitHub repo (if not already done)
git remote add origin https://github.com/YOUR-USERNAME/task-management.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click **New Project** → **Deploy from GitHub**
3. Connect your GitHub account and select `task-management` repository
4. Railway will auto-detect the monorepo structure
5. Add **Backend Service**:
   - Source: `task-management/backend`
   - Select "Node.js" as environment
6. Configure environment variables:
   ```
   NODE_ENV=production
   PORT=4000
   ACCESS_TOKEN_SECRET=generate_random_string_here
   REFRESH_TOKEN_SECRET=generate_random_string_here_different
   FRONTEND_URL=https://your-railway-frontend-url.railway.app
   ```
7. Railway will automatically build and deploy
8. Note the generated Backend URL (e.g., `https://task-api-prod.railway.app`)

### Step 3: Deploy Frontend to Railway

1. In the same Railway project, add **Frontend Service**:
   - Source: `task-management/frontend`
   - Select "Node.js" as environment
2. Configure environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app
   ```
3. Railway will build and deploy Next.js
4. Note the generated Frontend URL (e.g., `https://task-dashboard-prod.railway.app`)

### Step 4: Update CORS

Update backend `.env` on Railway:
```
FRONTEND_URL=https://your-railway-frontend-url.railway.app
```

## Architecture

```
┌─────────────────────────────────────────┐
│   Your Domain (optional)                │
└────────────┬────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼──────┐     ┌───▼──────┐
│ Frontend  │     │ Backend   │
│ (Next.js) │────▶│ (Express) │
│ Port 3000 │     │ Port 4000 │
└───────────┘     └─────┬─────┘
                        │
                   ┌────▼─────┐
                   │ SQLite DB │
                   │ (Prisma)  │
                   └───────────┘
```

## Production URLs

After deployment, you'll have:
- **Frontend:** `https://your-app-frontend.railway.app`
- **Backend API:** `https://your-app-backend.railway.app`
- **Access:** Share frontend URL with anyone to use the app

## Monitoring & Logs

In Railway dashboard:
1. Click on each service
2. View **Deployments** tab for build/deploy status
3. View **Logs** tab for real-time logs
4. View **Metrics** for CPU/Memory usage

## Custom Domain (Optional)

To add your own domain:
1. In Railway, go to service Settings
2. Add Custom Domain
3. Update DNS records as instructed
4. SSL certificate auto-generates

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check logs in Railway dashboard → Deployments |
| API not accessible | Verify `FRONTEND_URL` CORS setting on backend |
| Frontend can't reach API | Check `NEXT_PUBLIC_API_URL` in frontend env vars |
| Database errors | Railway provides 5GB free PostgreSQL (use if needed) |

## Cost

- **Free Tier:** $5/month credit, includes compute time
- **Payment:** Only pay for what you use beyond free tier
- Suitable for small projects

## Next Steps

1. **Custom Domain:** Add your domain in Railway Settings
2. **Database Upgrade:** Switch to Railway PostgreSQL for production data persistence
3. **Analytics:** Add monitoring tools like DataDog
4. **CI/CD:** Railway auto-deploys on git push to main

---

**Need help?** Visit [Railway Docs](https://docs.railway.app)
