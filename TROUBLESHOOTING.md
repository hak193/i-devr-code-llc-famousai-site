# 🔧 Troubleshooting Guide: "Failed to fetch" Error

## Problem Summary

You're seeing a `TypeError: Failed to fetch` error when trying to load products from Supabase. This is a network-level error that occurs before your application can process any response.

---

## 🎯 Most Likely Cause: Paused Supabase Project

**The #1 reason for this error is that your Supabase project is paused.**

Supabase free tier projects automatically pause after **7 days of inactivity** to save resources.

### ✅ Solution: Restore Your Project

1. **Go to Supabase Dashboard**
   - Visit: <https://supabase.com/dashboard>
   - Sign in with your account

2. **Check Project Status**
   - Look for your project: `lurugkublnupmqdftzxd`
   - If you see a "Paused" badge or "Restore" button, your project is paused

3. **Restore the Project**
   - Click the **"Restore"** or **"Resume"** button
   - Wait 1-2 minutes for the project to fully restore
   - Refresh your application

4. **Verify Connection**
   - Once restored, refresh your app at `http://localhost:8080`
   - Products should now load successfully

---

## 🔍 Other Possible Causes

### 1. Environment Variables Not Loaded

**Symptoms:**

- Error message mentions "Missing Supabase environment variables"
- Console shows `undefined` for `VITE_SUPABASE_URL`

**Solution:**

```bash
# 1. Verify .env file exists in project root
ls .env

# 2. Check contents (should have VITE_ prefix)
cat .env

# 3. Restart dev server (REQUIRED after .env changes)
# Stop current server (Ctrl+C)
npm run dev
```

**Important:** Vite only loads environment variables on startup. You MUST restart the dev server after changing `.env`.

---

### 2. Network Connectivity Issues

**Symptoms:**

- Error occurs intermittently
- Other websites also fail to load
- Timeout errors

**Solution:**

```bash
# Test Supabase connectivity
curl -I https://lurugkublnupmqdftzxd.supabase.co/rest/v1/products

# Expected: HTTP/1.1 200 OK or 401 Unauthorized (both mean server is reachable)
# Problem: Connection timeout, DNS errors, or no response
```

**Fixes:**

- Check your internet connection
- Disable VPN temporarily
- Check firewall settings
- Try a different network

---

### 3. CORS Configuration Issues

**Symptoms:**

- Console shows "CORS policy" error
- Works in Postman/curl but not in browser
- Error only occurs in browser, not in Node.js

**Solution:**

Supabase should handle CORS automatically, but if you see CORS errors:

1. **Check Supabase Dashboard**
   - Go to Settings → API
   - Verify "CORS Allowed Origins" includes your domain
   - For local dev, ensure `http://localhost:*` is allowed

2. **Verify API URL**
   - Ensure you're using the correct Supabase URL
   - Check for typos in `.env`

---

### 4. Browser Extensions Blocking Requests

**Symptoms:**

- Works in incognito mode
- Works in different browser
- Ad blocker or privacy extension installed

**Solution:**

1. Disable browser extensions temporarily
2. Check browser console for blocked requests
3. Whitelist `supabase.co` in your ad blocker

---

## 🧪 Diagnostic Tools

### Run Built-in Diagnostics

I've added diagnostic tools to your project. Open browser console and run:

```javascript
// Check environment variables
import { checkEnvVars } from "./src/diagnostics";
checkEnvVars();

// Test Supabase connection
import { testSupabaseConnection } from "./src/diagnostics";
await testSupabaseConnection();
```

### Manual API Test

Test the Supabase API directly:

```bash
# Test with curl (should return HTTP 200)
curl -I https://lurugkublnupmqdftzxd.supabase.co/rest/v1/products \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1cnVna3VibG51cG1xZGZ0enhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTQxNzEsImV4cCI6MjA4NjA3MDE3MX0.bRmU4ztBs_1X0o-fJTeA6r-K_nS8jm7M9AEUHK-75-w"
```

### Check Browser Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh the page
4. Look for failed requests to `supabase.co`
5. Click on the failed request to see details

**What to look for:**

- **Status: (failed)** → Network/connectivity issue
- **Status: 0** → CORS or network error
- **Status: 401** → Authentication issue (but server is reachable)
- **Status: 404** → Wrong URL or endpoint
- **Status: 500** → Server error

---

## 📋 Quick Checklist

Work through this checklist in order:

- [ ] **Check Supabase Dashboard** - Is project paused? → Restore it
- [ ] **Verify .env file exists** - Contains `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] **Restart dev server** - Stop (Ctrl+C) and run `npm run dev`
- [ ] **Check browser console** - Any specific error messages?
- [ ] **Test API with curl** - Does the API respond?
- [ ] **Try incognito mode** - Rules out browser extensions
- [ ] **Check internet connection** - Can you access other sites?

---

## 🎯 Expected Behavior After Fix

Once resolved, you should see:

1. **Homepage loads** with product grid
2. **8 sample products** displayed (from seed script)
3. **No console errors**
4. **Products are clickable** and open detail modals
5. **Filtering and search** work correctly

---

## 🆘 Still Having Issues?

### Verify Your Configuration

```bash
# 1. Check environment variables are loaded
npm run dev

# 2. Open browser console and check:
console.log(import.meta.env.VITE_SUPABASE_URL);
// Should output: https://lurugkublnupmqdftzxd.supabase.co

console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
// Should output: eyJhbGci... (long JWT token)
```

### Reset Everything

If nothing works, try a complete reset:

```bash
# 1. Stop dev server
# Press Ctrl+C

# 2. Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 3. Verify .env file
cat .env

# 4. Restart dev server
npm run dev

# 5. Check Supabase project status
# Visit: https://supabase.com/dashboard
```

---

## 📞 Additional Resources

- **Supabase Status**: <https://status.supabase.com>
- **Supabase Docs**: <https://supabase.com/docs>
- **Vite Env Variables**: <https://vitejs.dev/guide/env-and-mode.html>

---

**Last Updated:** 2026-02-15  
**Status:** Enhanced error handling implemented ✅
