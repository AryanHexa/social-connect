# 📸 Instagram OAuth Setup Guide

## 🔗 **Redirect URLs for Instagram Developer Portal**

### **For Your Hosted Site (Vercel)**

```
https://your-app-name.vercel.app/auth/instagram/callback
```

### **For Local Development**

```
http://localhost:3000/auth/instagram/callback
```

### **Example URLs (Replace with your actual domain)**

```
https://social-connect-app.vercel.app/auth/instagram/callback
https://socialedge.vercel.app/auth/instagram/callback
```

## 🛠️ **Instagram Developer Portal Setup**

### **Step 1: Create Facebook App**

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Consumer" or "Business" type
4. Fill in app details:
   - **App Name**: Your app name
   - **App Contact Email**: Your email
   - **Purpose**: Describe your app

### **Step 2: Add Instagram Basic Display**

1. In your Facebook app dashboard
2. Click "Add Product"
3. Find "Instagram Basic Display" and click "Set Up"
4. Go to Instagram Basic Display → Settings

### **Step 3: Configure OAuth Settings**

1. **Client ID**: Copy this for your backend env
2. **Client Secret**: Copy this for your backend env
3. **OAuth Redirect URIs**: Add your redirect URL:
   ```
   https://your-app-name.vercel.app/auth/instagram/callback
   ```

### **Step 4: Configure Permissions**

Add these permissions in Instagram Basic Display:

- `instagram_graph_user_profile`
- `instagram_graph_user_media`

## 🔐 **Backend Environment Variables**

Your NestJS backend needs these environment variables:

```env
# Instagram OAuth Configuration
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_REDIRECT_URI=https://your-app-name.vercel.app/auth/instagram/callback

# Alternative for local development
# INSTAGRAM_REDIRECT_URI=http://localhost:3000/auth/instagram/callback
```

## 🚀 **Implementation Features**

### ✅ **OAuth Flow**

- Secure OAuth2 with PKCE
- State parameter for CSRF protection
- Automatic token exchange
- Error handling and validation

### ✅ **Components Created**

- `InstagramConnect` - OAuth connection component
- `InstagramPosts` - Display Instagram posts
- `InstagramUserProfile` - Show user profile
- OAuth callback handler page

### ✅ **API Routes**

- `GET /insta/auth/url` - Generate OAuth URL
- `POST /insta/auth/callback` - Handle OAuth callback
- `GET /insta/user` - Get user profile
- `GET /insta/posts` - Get user posts
- `GET /insta/analytics/*` - Analytics endpoints
- `POST /insta/logout` - Disconnect account

### ✅ **Dashboard Pages**

- `/dashboard/instagram` - Main Instagram dashboard
- `/dashboard/instagram/posts` - Posts management
- `/dashboard/instagram/profile` - Profile management
- `/auth/instagram/callback` - OAuth callback handler

## 🔄 **OAuth Flow Process**

1. **User clicks "Connect with Instagram"**
2. **Frontend calls** `GET /api/v1/insta/auth/url`
3. **Backend generates** OAuth URL with state/PKCE
4. **User redirects** to Instagram OAuth
5. **Instagram redirects** to callback URL with code
6. **Frontend handles** callback at `/auth/instagram/callback`
7. **Frontend calls** `POST /api/v1/insta/auth/callback`
8. **Backend exchanges** code for access token
9. **Backend saves** user account and token
10. **User redirected** to Instagram dashboard

## 🧪 **Testing the Integration**

### **Local Testing**

1. Set `INSTAGRAM_REDIRECT_URI=http://localhost:3000/auth/instagram/callback`
2. Add this URL to Instagram app settings
3. Start your Next.js app: `npm run dev`
4. Navigate to `/dashboard/instagram`
5. Click "Connect with Instagram"

### **Production Testing**

1. Deploy to Vercel
2. Set `INSTAGRAM_REDIRECT_URI=https://your-app.vercel.app/auth/instagram/callback`
3. Update Instagram app settings with production URL
4. Test OAuth flow on live site

## 🔍 **Troubleshooting**

### **Common Issues**

**Issue**: "Invalid redirect URI"
**Solution**: Ensure exact match between backend env and Instagram app settings

**Issue**: "Invalid state parameter"
**Solution**: Check localStorage and ensure state is properly stored/retrieved

**Issue**: "OAuth flow expired"
**Solution**: State expires after 10 minutes, start flow again

**Issue**: "User not authenticated"
**Solution**: Ensure user is logged in before starting OAuth flow

### **Debug Steps**

1. **Check browser console** for OAuth errors
2. **Verify environment variables** in backend
3. **Confirm redirect URI** matches exactly
4. **Test with Instagram Graph API Explorer**
5. **Check network requests** in developer tools

## 📋 **Checklist for Production**

- [ ] Instagram app created in Facebook Developers
- [ ] Instagram Basic Display product added
- [ ] Client ID and Secret configured in backend
- [ ] Redirect URI set correctly
- [ ] Production URL added to Instagram app
- [ ] SSL certificate valid (HTTPS required)
- [ ] Error handling implemented
- [ ] User feedback/loading states added

## 🔗 **Useful Links**

- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Facebook App Dashboard](https://developers.facebook.com/apps/)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [OAuth 2.0 Security Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics-16)

Your Instagram integration is now ready for production! 🎉
