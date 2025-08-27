"use client";

import { useState, useEffect } from "react";
import { xAPI } from "@/lib/api";
import { formatDate, truncateText } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  MessageSquare,
  Heart,
  Repeat,
  Share,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author_id?: string;
  public_metrics?: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  entities?: {
    urls?: Array<{
      url: string;
      expanded_url: string;
      display_url: string;
    }>;
    hashtags?: Array<{
      tag: string;
    }>;
    mentions?: Array<{
      username: string;
    }>;
  };
}

interface TwitterPostsProps {
  limit?: number;
}

export default function TwitterPosts({ limit = 10 }: TwitterPostsProps) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [after, setAfter] = useState<string | undefined>();

  const fetchPosts = async (syncData = false, pageAfter?: string) => {
    setIsLoading(true);
    try {
      const response = await xAPI.getPosts({
        sync: syncData ? "true" : "false",
        limit: limit.toString(),
        skip: ((currentPage - 1) * limit).toString(),
        after: pageAfter,
      });

      if (response.data) {
        if (pageAfter) {
          setTweets((prev) => [...prev, ...response.data]);
        } else {
          setTweets(response.data);
        }

        // Check if there are more posts
        setHasMore(response.data.length === limit);

        if (syncData) {
          toast.success("Posts synced from Twitter!");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, limit]);

  const handleSync = () => {
    fetchPosts(true);
  };

  const handleLoadMore = () => {
    if (tweets.length > 0) {
      const lastTweet = tweets[tweets.length - 1];
      setAfter(lastTweet.id);
      fetchPosts(false, lastTweet.id);
    }
  };

  const handleLogoutTwitter = async () => {
    try {
      setIsLoading(true);
      const result = await xAPI.logout();

      if (result.success) {
        setTweets([]);
        toast.success("Successfully logged out from Twitter");
      } else {
        toast.error("Failed to logout from Twitter");
      }
    } catch (error) {
      console.error("Error logging out from Twitter:", error);
      toast.error("Failed to logout from Twitter");
    } finally {
      setIsLoading(false);
    }
  };

  const renderTweetText = (text: string, entities?: any) => {
    let processedText = text;

    // Replace URLs
    if (entities?.urls) {
      entities.urls.forEach((url: any) => {
        processedText = processedText.replace(
          url.url,
          `<a href="${url.expanded_url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${url.display_url}</a>`
        );
      });
    }

    // Replace hashtags
    if (entities?.hashtags) {
      entities.hashtags.forEach((hashtag: any) => {
        processedText = processedText.replace(
          `#${hashtag.tag}`,
          `<span class="text-blue-600">#${hashtag.tag}</span>`
        );
      });
    }

    // Replace mentions
    if (entities?.mentions) {
      entities.mentions.forEach((mention: any) => {
        processedText = processedText.replace(
          `@${mention.username}`,
          `<span class="text-blue-600">@${mention.username}</span>`
        );
      });
    }

    return processedText;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Twitter Posts</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSync}
            disabled={isLoading}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Sync</span>
          </button>
          <button
            onClick={handleLogoutTwitter}
            disabled={isLoading}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {isLoading && tweets.length === 0 ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : tweets.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No posts available</p>
          <button
            onClick={() => fetchPosts(true)}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Sync from Twitter
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <div
              key={tweet.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-gray-500">
                      {formatDate(tweet.created_at)}
                    </span>
                  </div>

                  <div
                    className="text-gray-900 mb-3"
                    dangerouslySetInnerHTML={{
                      __html: renderTweetText(tweet.text, tweet.entities),
                    }}
                  />

                  {tweet.public_metrics && (
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{tweet.public_metrics.reply_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Repeat className="w-4 h-4" />
                        <span>{tweet.public_metrics.retweet_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{tweet.public_metrics.like_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Share className="w-4 h-4" />
                        <span>{tweet.public_metrics.quote_count}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
