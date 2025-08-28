"use client";

import { useState, useEffect } from "react";
import { instagramAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  Camera,
  Heart,
  MessageCircle,
  ExternalLink,
  RefreshCw,
  Calendar,
  Play,
  Image as ImageIcon,
  Grid3X3,
  Loader2,
} from "lucide-react";

interface InstagramPost {
  id: string;
  caption: string;
  author_id: string;
  created_at: string;
  like_count: number;
  comment_count: number;
  media_type: string;
  media?: Array<{
    type: string;
    url: string;
    thumbnail_url?: string;
    id: string;
  }>;
  permalink?: string;
  shortcode?: string;
  is_video: boolean;
  is_carousel: boolean;
  video_url?: string;
  video_thumbnail_url?: string;
}

interface InstagramPostsProps {
  className?: string;
}

export default function InstagramPosts({ className }: InstagramPostsProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (sync = false, after?: string) => {
    if (sync) {
      setIsSyncing(true);
    } else {
      setIsLoading(true);
    }

    try {
      console.log("Loading Instagram posts...", { sync, after });

      const params: any = {
        sync: sync ? "true" : "false",
        limit: 12,
      };

      if (after) {
        params.after = after;
      }

      const response = await instagramAPI.getPosts(params);
      console.log("Posts response:", response);

      if (response?.data) {
        if (after) {
          // Loading more posts
          setPosts((prev) => [...prev, ...response.data]);
        } else {
          // Initial load or refresh
          setPosts(response.data);
        }

        setNextCursor(response.next_cursor || null);
        setHasMore(!!response.next_cursor);

        if (sync) {
          toast.success(`Synced ${response.data.length} posts from Instagram!`);
        }
      } else {
        if (sync) {
          toast.info("No new posts found");
        }
      }
    } catch (error: any) {
      console.error("Error loading posts:", error);
      if (error.response?.status === 401) {
        toast.error("Please connect your Instagram account first");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to load Instagram posts"
        );
      }
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  const syncPosts = () => {
    loadPosts(true);
  };

  const loadMorePosts = () => {
    if (nextCursor && hasMore && !isLoading) {
      loadPosts(false, nextCursor);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getMediaIcon = (
    mediaType: string,
    isVideo: boolean,
    isCarousel: boolean
  ) => {
    if (isCarousel) return <Grid3X3 className="h-4 w-4" />;
    if (isVideo) return <Play className="h-4 w-4" />;
    return <ImageIcon className="h-4 w-4" />;
  };

  const getMediaUrl = (post: InstagramPost) => {
    if (post.video_thumbnail_url) return post.video_thumbnail_url;
    if (post.media && post.media.length > 0) {
      return post.media[0].thumbnail_url || post.media[0].url;
    }
    return null;
  };

  const truncateCaption = (caption: string, maxLength = 150) => {
    if (caption.length <= maxLength) return caption;
    return caption.substring(0, maxLength) + "...";
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className={cn("bg-white rounded-lg shadow-md p-6", className)}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          <span className="ml-2 text-gray-600">Loading Instagram posts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-lg shadow-md p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Camera className="h-6 w-6 mr-2 text-pink-500" />
          Instagram Posts
        </h2>
        <button
          onClick={syncPosts}
          disabled={isSyncing}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors",
            isSyncing && "opacity-50 cursor-not-allowed"
          )}
        >
          <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
          <span>{isSyncing ? "Syncing..." : "Sync Posts"}</span>
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Posts Found
          </h3>
          <p className="text-gray-600 mb-4">
            Connect your Instagram account and sync your posts to get started.
          </p>
          <button
            onClick={syncPosts}
            disabled={isSyncing}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
          >
            {isSyncing ? "Syncing..." : "Sync Posts"}
          </button>
        </div>
      ) : (
        <>
          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const mediaUrl = getMediaUrl(post);

              return (
                <div
                  key={post.id}
                  className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Media */}
                  {mediaUrl && (
                    <div className="relative aspect-square">
                      <img
                        src={mediaUrl}
                        alt="Instagram post"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />

                      {/* Media Type Indicator */}
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded">
                        {getMediaIcon(
                          post.media_type,
                          post.is_video,
                          post.is_carousel
                        )}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
                    {/* Caption */}
                    {post.caption && (
                      <p className="text-gray-800 text-sm mb-3 leading-relaxed">
                        {truncateCaption(post.caption)}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span>{post.like_count.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4 text-blue-500" />
                          <span>{post.comment_count.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <span className="capitalize">
                          {post.media_type.toLowerCase().replace("_", " ")}
                        </span>
                      </div>

                      {post.permalink && (
                        <a
                          href={post.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-pink-600 hover:text-pink-700 text-sm"
                        >
                          <span>View</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMorePosts}
                disabled={isLoading}
                className={cn(
                  "px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Load More Posts"
                )}
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Showing {posts.length} posts
              {hasMore && " • More available"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
