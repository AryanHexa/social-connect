export interface InstagramPostAnalytics {
  post_id: string;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  profile_visits: number;
  website_clicks: number;
  engagement_rate: number;
  created_at: string;
}

export interface InstagramUserAnalytics {
  user_id: string;
  username: string;
  total_impressions: number;
  total_reach: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_saves: number;
  total_profile_visits: number;
  total_website_clicks: number;
  avg_engagement_rate: number;
  total_posts: number;
  period_start: string;
  period_end: string;
}

export interface InstagramEngagementMetrics {
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  profile_visits: number;
  website_clicks: number;
  engagement_rate: number;
  total_engagement: number;
}

export interface InstagramPostAnalyticsResponse {
  data: InstagramPostAnalytics[];
  summary: InstagramEngagementMetrics;
  result_count: number;
  period_start: string;
  period_end: string;
}

export interface InstagramUserAnalyticsResponse {
  data: InstagramUserAnalytics;
  summary: InstagramEngagementMetrics;
}

export interface InstagramAnalyticsError {
  error: string;
  details?: string;
  status?: number;
}
