# Asset API Troubleshooting Guide

## Issue: 404 Error when fetching assets

### Changes Made
Updated all asset service files with:
- ✅ `"use server"` directive
- ✅ Proper error handling with try/catch
- ✅ Detailed error logging
- ✅ Specific populate fields instead of wildcard `*`

### Possible Causes & Solutions

#### 1. **Strapi Endpoint Not Available**
The `/assets` endpoint might not exist in your Strapi CMS.

**Check:**
- Is the Asset collection type created in Strapi?
- Is it published and accessible via API?

**Strapi Collection Name:** `api::asset.asset` (based on your schema)

#### 2. **API Permissions**
The endpoint might exist but not be publicly accessible.

**Fix in Strapi:**
1. Go to Settings → Users & Permissions Plugin → Roles
2. Select the appropriate role (Public or Authenticated)
3. Find "Asset" in the permissions
4. Enable: `find`, `findOne`, `create`, `update`, `delete`
5. Save

#### 3. **Endpoint URL Mismatch**
Check if the endpoint should be different.

**Current endpoint:** `/assets`

**Possible alternatives:**
- `/api/assets` (if using Strapi v4 with API prefix)
- Check your other working endpoints in the browser network tab

#### 4. **Verify Base URL**
Check your `.env` file:
```
NEXT_APP_API_BASE_URL=http://localhost:1337/api
```

Make sure it's pointing to the correct Strapi instance.

### Debugging Steps

1. **Check Browser Console**
   - Open DevTools → Network tab
   - Look for the failed request
   - Check the full URL being called
   - Check the response body for error details

2. **Test Endpoint Directly**
   Open in browser or Postman:
   ```
   GET http://localhost:1337/api/assets
   ```
   (Replace with your actual base URL)

3. **Check Strapi Logs**
   Look at your Strapi server console for any errors

4. **Verify Collection Exists**
   - Go to Strapi Admin → Content Manager
   - Look for "Assets" in the left sidebar
   - If it doesn't exist, you need to create the collection type

### Quick Test

Try fetching a working endpoint to confirm the connection:
```typescript
// In browser console on your admin page
fetch('http://localhost:1337/api/accounts')
  .then(r => r.json())
  .then(console.log)
```

If this works, the issue is specific to the assets endpoint.

### Next Steps

1. **Verify the endpoint exists** by testing it directly
2. **Check Strapi permissions** for the Asset collection
3. **Update the endpoint** in `fetchAssets.ts` if needed
4. **Create the collection** in Strapi if it doesn't exist

Let me know what you find and I can help adjust the code accordingly!
