# Analytics Integration Documentation

This document describes the analytics integration for the SocialEdge platform, which provides comprehensive Twitter analytics through a gateway architecture.

## Overview

The analytics system consists of:

- **Backend Gateway Service**: NestJS service that handles Twitter and Instagram API calls and data processing
- **Frontend API Routes**: Next.js API routes that proxy requests to the backend
- **React Components**: UI components for displaying analytics data
- **Error Handling**: Comprehensive error handling and user feedback

## Architecture

```
Frontend (Next.js) → API Routes → Backend Gateway → Twitter/Instagram API
```

### Components

1. **API Routes**

   - `src/app/api/v1/x/analytics/` - Twitter analytics
     - `tweets/route.ts` - Tweet-level analytics
     - `user/route.ts` - User-level analytics
   - `src/app/api/v1/insta/analytics/` - Instagram analytics
     - `posts/route.ts` - Post-level analytics
     - `user/route.ts` - User-level analytics

2. **React Components** (`src/components/analytics/`)

   - `AnalyticsDashboard.tsx` - Twitter overview analytics dashboard
   - `TweetAnalytics.tsx` - Specific tweet analysis
   - `InstagramAnalyticsDashboard.tsx` - Instagram overview analytics dashboard
   - `InstagramPostAnalytics.tsx` - Specific Instagram post analysis

3. **Utilities** (`src/lib/`)
   - `api.ts` - API client with analytics endpoints
   - `types/analytics.ts` - Twitter TypeScript interfaces
   - `types/instagram-analytics.ts` - Instagram TypeScript interfaces
   - `utils/errorHandler.ts` - Error handling utilities

## Features

### User Analytics

- Total impressions, reach, and engagement metrics
- Breakdown by interaction type (likes, retweets, replies, quotes)
- Profile clicks and URL clicks tracking
- Average engagement rate calculation
- Date range filtering

### Tweet Analytics

- Individual tweet performance analysis
- Support for up to 100 tweets per request
- Detailed metrics for each tweet
- Direct links to view tweets on Twitter
- Date range filtering

### Error Handling

- Authentication error handling
- Rate limit detection and user feedback
- Network error handling
- Graceful fallbacks and retry mechanisms

## API Endpoints

### User Analytics

```
GET /api/v1/x/analytics/user?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
```

**Headers:**

- `Authorization: Bearer <jwt_token>`
- `X-Twitter-Access-Token: <twitter_token>` (optional)

### Tweet Analytics

```
GET /api/v1/x/analytics/tweets?tweet_ids=123,456,789&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
```

**Headers:**

- `Authorization: Bearer <jwt_token>`
- `X-Twitter-Access-Token: <twitter_token>` (optional)

## Usage

### Frontend Integration

1. **Import the API client:**

```typescript
import { xAPI } from "@/lib/api";
```

2. **Fetch user analytics:**

```typescript
const userAnalytics = await xAPI.getUserAnalytics(
  {
    start_date: "2024-01-01",
    end_date: "2024-01-31",
  },
  twitterAccessToken
);
```

3. **Fetch tweet analytics:**

```typescript
const tweetAnalytics = await xAPI.getTweetAnalytics(
  {
    tweet_ids: "1234567890,9876543210",
    start_date: "2024-01-01",
    end_date: "2024-01-31",
  },
  twitterAccessToken
);
```

### Error Handling

The system provides comprehensive error handling:

```typescript
import {
  handleApiError,
  isAuthError,
  isRateLimitError,
} from "@/lib/utils/errorHandler";

try {
  const analytics = await xAPI.getUserAnalytics();
} catch (error) {
  const apiError = handleApiError(error);

  if (isAuthError(error)) {
    // Handle authentication errors
  } else if (isRateLimitError(error)) {
    // Handle rate limit errors
  }
}
```

## Data Types

### UserAnalyticsResponse

```typescript
interface UserAnalyticsResponse {
  data: UserAnalytics;
  summary: EngagementMetrics;
}

interface UserAnalytics {
  user_id: string;
  username: string;
  total_impressions: number;
  total_reach: number;
  total_likes: number;
  total_retweets: number;
  total_replies: number;
  total_quotes: number;
  total_profile_clicks: number;
  total_url_clicks: number;
  avg_engagement_rate: number;
  total_tweets: number;
  period_start: string;
  period_end: string;
}
```

### TweetAnalyticsResponse

```typescript
interface TweetAnalyticsResponse {
  data: TweetAnalytics[];
  summary: EngagementMetrics;
  result_count: number;
  period_start: string;
  period_end: string;
}

interface TweetAnalytics {
  tweet_id: string;
  impressions: number;
  reach: number;
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
  profile_clicks: number;
  url_clicks: number;
  detail_expands: number;
  engagement_rate: number;
  created_at: string;
}
```

## Environment Variables

Required environment variables for the backend:

```env
BACKEND_API_URL=http://localhost:3000
X_CLIENT_ID=your_twitter_client_id
X_CLIENT_SECRET=your_twitter_client_secret
X_REDIRECT_URI=your_oauth_redirect_uri
```

## Error Codes

Common error responses:

- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid JWT or Twitter token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (no analytics data available)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

The system respects Twitter API rate limits and provides appropriate feedback to users. When rate limits are exceeded:

1. The backend returns a 429 status code
2. The frontend displays a user-friendly message
3. Users are advised to try again later

## Security

- All API requests require JWT authentication
- Twitter access tokens are optional but recommended for better data access
- Input validation is performed on both frontend and backend
- Error messages are sanitized to prevent information leakage

## Performance

- API responses are cached where appropriate
- Pagination is supported for large datasets
- Loading states provide user feedback
- Error boundaries prevent application crashes

## Testing

To test the analytics integration:

1. Ensure the backend service is running
2. Connect a Twitter account through OAuth
3. Navigate to the analytics dashboard
4. Test both user and tweet analytics features
5. Verify error handling with invalid inputs

## Troubleshooting

### Common Issues

1. **"Twitter access token not found"**

   - Ensure the user has connected their Twitter account
   - Check that the OAuth flow completed successfully

2. **"Rate limit exceeded"**

   - Wait for the rate limit window to reset
   - Consider implementing request caching

3. **"No analytics data found"**

   - Verify the user has posted tweets in the specified date range
   - Check that the tweets are accessible with the provided token

4. **"Invalid tweet ID format"**
   - Ensure tweet IDs are numeric
   - Check for extra spaces or invalid characters

### Debug Mode

Enable debug logging by setting the log level in the backend:

```typescript
// In backend service
this.logger.setLogLevels(["debug", "log", "warn", "error"]);
```

## Future Enhancements

- Real-time analytics updates
- Export functionality (CSV, PDF)
- Advanced filtering and segmentation
- Comparative analytics (period-over-period)
- Custom date range presets
- Analytics alerts and notifications
