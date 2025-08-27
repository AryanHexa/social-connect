# NGROK Troubleshooting Guide

## Common Issues & Solutions

### 1. **CORS Errors**

**Problem**: Browser blocks requests due to CORS policy
**Solution**:

```bash
# Backend CORS configuration (NestJS example)
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://your-ngrok-url.ngrok.io',
    'https://*.ngrok.io', // Allow all NGROK subdomains
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});
```

### 2. **SSL Certificate Issues**

**Problem**: SSL certificate warnings or errors
**Solutions**:

- **Option A**: Use HTTP instead of HTTPS for NGROK free tier
- **Option B**: Upgrade to NGROK Pro for custom domains
- **Option C**: Accept the certificate warning in browser

### 3. **Connection Refused**

**Problem**: Cannot connect to NGROK tunnel
**Solutions**:

```bash
# 1. Check if NGROK is running
ngrok http 3000

# 2. Verify the correct port
# Make sure your backend is running on port 3000 (or the port you specified)

# 3. Check NGROK status
# Visit http://localhost:4040 to see NGROK web interface
```

### 4. **Environment Variables**

**Problem**: Frontend not using correct NGROK URL
**Solution**:

```bash
# Create .env.local file
NEXT_PUBLIC_API_URL=https://your-ngrok-url.ngrok.io/api/v1

# Or set it in your deployment environment
```

### 5. **Backend Not Registering Requests**

**Problem**: Requests not reaching your backend
**Solutions**:

#### A. Check NGROK Web Interface

```bash
# Visit http://localhost:4040
# Check the "HTTP" tab to see incoming requests
```

#### B. Add Request Logging

```javascript
// In your backend (NestJS example)
@Controller()
export class AppController {
  @Get("*")
  logAllRequests(@Req() req: Request) {
    console.log("Incoming request:", {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    });
  }
}
```

#### C. Test Direct API Access

```bash
# Test your API directly
curl -X GET https://your-ngrok-url.ngrok.io/api/v1/health

# Or visit in browser
https://your-ngrok-url.ngrok.io/api/v1/health
```

## Step-by-Step Debugging

### Step 1: Verify NGROK Setup

```bash
# 1. Start your backend
npm run start:dev

# 2. Start NGROK
ngrok http 3000

# 3. Copy the HTTPS URL from NGROK output
# Example: https://abc123.ngrok.io
```

### Step 2: Update Environment Variables

```bash
# Create or update .env.local
echo "NEXT_PUBLIC_API_URL=https://abc123.ngrok.io/api/v1" > .env.local
```

### Step 3: Restart Frontend

```bash
# Stop and restart your Next.js app
npm run dev
```

### Step 4: Test Connection

1. Open browser console
2. Look for the NGROK debug information
3. Use the NGROK Debugger component in the dashboard
4. Check for any error messages

### Step 5: Verify Backend CORS

```javascript
// In your backend main.ts or app.module.ts
app.enableCors({
  origin: true, // Allow all origins for testing
  credentials: true,
});
```

## Advanced Solutions

### 1. **Custom NGROK Configuration**

```bash
# Create ngrok.yml configuration
authtoken: your_auth_token
tunnels:
  api:
    addr: 3000
    proto: http
    subdomain: your-custom-subdomain
    inspect: true
```

### 2. **Health Check Endpoint**

```javascript
// Add this to your backend
@Get('health')
health() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
}
```

### 3. **Request Interceptor for Debugging**

```javascript
// In your frontend api.ts
api.interceptors.request.use((config) => {
  console.log("🚀 API Request:", {
    method: config.method,
    url: config.url,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`,
    headers: config.headers,
  });
  return config;
});
```

## Common Error Messages & Solutions

| Error                   | Cause                                  | Solution                       |
| ----------------------- | -------------------------------------- | ------------------------------ |
| `CORS error`            | Browser blocking cross-origin requests | Configure CORS on backend      |
| `Connection refused`    | NGROK tunnel not active                | Start NGROK: `ngrok http 3000` |
| `SSL certificate error` | NGROK free tier limitation             | Use HTTP or upgrade to Pro     |
| `Network Error`         | Backend not running                    | Start backend server           |
| `404 Not Found`         | Wrong API endpoint                     | Check API routes and NGROK URL |

## Testing Checklist

- [ ] Backend server is running
- [ ] NGROK tunnel is active
- [ ] Environment variables are set correctly
- [ ] CORS is configured on backend
- [ ] API endpoints are accessible directly
- [ ] Frontend is using correct API URL
- [ ] No SSL certificate issues
- [ ] Network connectivity is stable

## Quick Fix Commands

```bash
# 1. Restart everything
pkill -f "ngrok"
pkill -f "node"
npm run start:dev &
ngrok http 3000

# 2. Update environment
export NEXT_PUBLIC_API_URL=https://$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')/api/v1

# 3. Test connection
curl -X GET $NEXT_PUBLIC_API_URL/health
```

## Still Having Issues?

1. **Check the NGROK Debugger** in your dashboard
2. **Review browser console** for detailed error messages
3. **Test API directly** in browser or with curl
4. **Check NGROK web interface** at http://localhost:4040
5. **Verify environment variables** are loaded correctly
6. **Restart all services** (backend, NGROK, frontend)

## Support

If you're still experiencing issues:

1. Check the browser console for error messages
2. Use the NGROK Debugger component
3. Test the API endpoints directly
4. Verify your backend CORS configuration
5. Check if NGROK tunnel is active and accessible
