export interface TweetAnalytics {
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

export interface UserAnalytics {
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

export interface EngagementMetrics {
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
  total_engagement: number;
}

export interface TweetAnalyticsResponse {
  data: TweetAnalytics[];
  summary: EngagementMetrics;
  result_count: number;
  period_start: string;
  period_end: string;
}

export interface UserAnalyticsResponse {
  data: UserAnalytics;
  summary: EngagementMetrics;
}

export interface AnalyticsError {
  error: string;
  details?: string;
  status?: number;
}
