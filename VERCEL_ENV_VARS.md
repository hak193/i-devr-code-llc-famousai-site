# 🔑 Vercel Environment Variables

Copy and paste these **EXACT** values into Vercel's Environment Variables section:

---

## Variable 1: VITE_SUPABASE_URL

**Name:**

```
VITE_SUPABASE_URL
```

**Value:**

```
https://lurugkublnupmqdftzxd.supabase.co
```

**Environments:** Production, Preview, Development (select all)

---

## Variable 2: VITE_SUPABASE_ANON_KEY

**Name:**

```
VITE_SUPABASE_ANON_KEY
```

**Value:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1cnVna3VibG51cG1xZGZ0enhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTQxNzEsImV4cCI6MjA4NjA3MDE3MX0.bRmU4ztBs_1X0o-fJTeA6r-K_nS8jm7M9AEUHK-75-w
```

**Environments:** Production, Preview, Development (select all)

---

## ⚠️ IMPORTANT SECURITY NOTES

### ✅ DO Add to Vercel:

- `VITE_SUPABASE_URL` - Public URL, safe to expose
- `VITE_SUPABASE_ANON_KEY` - Public anon key, protected by RLS

### ❌ DO NOT Add to Vercel:

- `SUPABASE_SERVICE_ROLE_KEY` - **NEVER** expose this in frontend!
- `SUPABASE_JWT_SECRET` - Backend only
- `POSTGRES_PASSWORD` - Backend only
- Any other secrets from your `.env` file

### Why is the Anon Key Safe?

The anon key is **designed to be public** and is protected by:

1. **Row Level Security (RLS)** policies in Supabase
2. **Rate limiting** on Supabase's edge
3. **Restricted permissions** (read-only for public data)

The service role key bypasses RLS and should **ONLY** be used in:

- Local development for seeding
- Backend API routes (never frontend)
- Server-side operations

---

## 📋 Quick Copy Format (for Vercel UI)

If Vercel allows bulk paste:

```env
VITE_SUPABASE_URL=https://lurugkublnupmqdftzxd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1cnVna3VibG51cG1xZGZ0enhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTQxNzEsImV4cCI6MjA4NjA3MDE3MX0.bRmU4ztBs_1X0o-fJTeA6r-K_nS8jm7M9AEUHK-75-w
```

---

## ✅ Verification Checklist

After adding variables to Vercel:

- [ ] Both variables added
- [ ] No typos in variable names
- [ ] Values copied exactly (no extra spaces)
- [ ] Applied to all environments (Production, Preview, Development)
- [ ] Clicked "Save" or "Add"
- [ ] Triggered a new deployment (or it happens automatically)

---

## 🔄 After Adding Variables

Vercel will automatically redeploy your site. If not:

1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Wait for build to complete (~2 minutes)
4. Visit your live URL to verify

---

**Last Updated:** 2026-02-15  
**Status:** Ready to Deploy ✅
