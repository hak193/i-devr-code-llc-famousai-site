# 🚀 Production Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Fixed

- [x] Fixed `.env` file (corrected `NEXT_PUBLIC_SUPABASE_URL`)
- [x] Database seeded with sample products
- [x] Production build tested locally (`npm run build`)
- [x] Code committed and pushed to GitHub

### 2. Supabase Configuration

- [x] Database schema deployed (`schema.sql`)
- [x] Row Level Security (RLS) enabled
- [x] Products table created
- [x] Profiles table created

---

## 🌐 Deploy to Vercel (Recommended)

### Step 1: Access Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **"Add New..."** → **"Project"**

### Step 2: Import GitHub Repository

1. Select your repository: `hak193/i-devr-code-llc-famousai-site`
2. Vercel will auto-detect **Vite** framework
3. Click **"Import"**

### Step 3: Configure Project Settings

**Framework Preset:** Vite (auto-detected)

**Build & Development Settings:**

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

### Step 4: Add Environment Variables (CRITICAL!)

In the **Environment Variables** section, add the following:

```bash
# Required for Production
VITE_SUPABASE_URL=https://lurugkublnupmqdftzxd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1cnVna3VibG51cG1xZGZ0enhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTQxNzEsImV4cCI6MjA4NjA3MDE3MX0.bRmU4ztBs_1X0o-fJTeA6r-K_nS8jm7M9AEUHK-75-w
```

**Important Notes:**

- ⚠️ **DO NOT** add `SUPABASE_SERVICE_ROLE_KEY` to Vercel (security risk!)
- ✅ Only add the `VITE_*` prefixed variables
- ✅ These are safe to expose in the frontend (anon key has RLS protection)

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for build to complete
3. Vercel will provide a live URL: `https://your-project.vercel.app`

### Step 6: Verify Deployment

Visit your deployed site and check:

- ✅ Homepage loads correctly
- ✅ Products display from Supabase
- ✅ Filtering and search work
- ✅ Product modals open
- ✅ Admin dashboard accessible at `/admin`

---

## 🔒 Security Checklist

### Environment Variables

- [x] `.env` file is in `.gitignore` (never committed to git)
- [x] Service role key only used locally for seeding
- [x] Only anon key exposed in frontend
- [x] RLS policies protect database access

### Supabase Security

- [x] Row Level Security (RLS) enabled on all tables
- [x] Public can only read published products
- [x] Admin operations require service_role
- [x] User profiles have proper access controls

### Production Best Practices

- [ ] Enable HTTPS (Vercel does this automatically)
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring/analytics
- [ ] Configure error tracking (Sentry, etc.)

---

## 🎯 Post-Deployment Tasks

### 1. Custom Domain (Optional)

In Vercel Dashboard:

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

### 2. Environment-Specific Configurations

For staging/production environments:

**Staging:**

```bash
VITE_SUPABASE_URL=<staging-supabase-url>
VITE_SUPABASE_ANON_KEY=<staging-anon-key>
```

**Production:**

```bash
VITE_SUPABASE_URL=<production-supabase-url>
VITE_SUPABASE_ANON_KEY=<production-anon-key>
```

### 3. Performance Optimization

- [ ] Enable Vercel Analytics
- [ ] Configure caching headers
- [ ] Optimize images (use Vercel Image Optimization)
- [ ] Enable compression (automatic on Vercel)

### 4. Monitoring & Observability

**Recommended Tools:**

- **Error Tracking:** Sentry
- **Analytics:** Vercel Analytics, Plausible, or Umami
- **Uptime Monitoring:** UptimeRobot, Better Uptime
- **Performance:** Vercel Speed Insights

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel automatically builds and deploys
```

**Branch Previews:**

- Every branch gets a preview URL
- Pull requests get automatic preview deployments
- Production deploys only from `main` branch

---

## 🛠️ Troubleshooting

### Build Fails on Vercel

**Check:**

1. Node version compatibility (Vercel uses Node 18+ by default)
2. All dependencies in `package.json`
3. Build logs for specific errors
4. Environment variables are set correctly

**Solution:**

```bash
# Test build locally first
npm run build

# If successful, push to GitHub
git push origin main
```

### Environment Variables Not Working

**Check:**

1. Variables have `VITE_` prefix (required for Vite)
2. Redeploy after adding/changing variables
3. No typos in variable names
4. Values are properly quoted in Vercel UI

### Products Not Displaying

**Check:**

1. Supabase URL is correct
2. Anon key is valid
3. Database schema is deployed
4. Products are marked as `is_published = true`
5. RLS policies allow public read access

### Admin Dashboard Not Working

**Check:**

1. Route exists: `/admin`
2. Authentication is configured
3. User has proper permissions
4. Service role operations use backend/API routes (not frontend)

---

## 📊 Performance Benchmarks

**Expected Performance:**

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Lighthouse Score:** 90+
- **Bundle Size:** ~570KB (gzipped: ~165KB)

**Optimization Tips:**

1. Code splitting already configured (Vite default)
2. Lazy load routes with React.lazy()
3. Optimize images (WebP format, proper sizing)
4. Use Vercel Edge Network for global CDN

---

## 🎉 You're Live!

Your production deployment is complete. Your site is now accessible at:

**Vercel URL:** `https://i-devr-code-llc-famousai-site.vercel.app` (or similar)

**GitHub Repository:** `https://github.com/hak193/i-devr-code-llc-famousai-site`

### Next Steps:

1. Share your live URL
2. Test all features in production
3. Set up custom domain (if desired)
4. Configure analytics and monitoring
5. Start selling digital products! 🚀

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Vite Docs:** https://vitejs.dev
- **React Router:** https://reactrouter.com

---

**Deployment Date:** 2026-02-15  
**Build Status:** ✅ Ready for Production  
**Environment:** Fixed and Verified
