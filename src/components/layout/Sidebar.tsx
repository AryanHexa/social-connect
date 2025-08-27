"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Twitter,
  Users,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  MessageSquare,
  Camera,
  User,
  FileText,
  BarChart,
  Zap,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const twitterNavigation = [
  { name: "Profile", href: "/dashboard/twitter/profile", icon: User },
  { name: "Posts", href: "/dashboard/twitter/posts", icon: FileText },
  { name: "Analytics", href: "/dashboard/twitter/analytics", icon: BarChart },
  { name: "Content Generator", href: "/dashboard/twitter/content", icon: Zap },
];

const instagramNavigation = [
  { name: "Profile", href: "/dashboard/instagram/profile", icon: User },
  { name: "Posts", href: "/dashboard/instagram/posts", icon: FileText },
  { name: "Analytics", href: "/dashboard/instagram/analytics", icon: BarChart },
  {
    name: "Content Generator",
    href: "/dashboard/instagram/content",
    icon: Zap,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "bg-white shadow-lg transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-4">
          {/* Main Navigation */}
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn("w-5 h-5", collapsed ? "mx-auto" : "mr-3")}
                  />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>

          {/* Twitter Section */}
          <div className="space-y-2">
            {!collapsed && (
              <div className="flex items-center px-3 py-2">
                <Twitter className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Twitter
                </span>
              </div>
            )}
            {twitterNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn("w-5 h-5", collapsed ? "mx-auto" : "mr-3")}
                  />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>

          {/* Instagram Section */}
          <div className="space-y-2">
            {!collapsed && (
              <div className="flex items-center px-3 py-2">
                <Camera className="w-4 h-4 text-pink-500 mr-2" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Instagram
                </span>
              </div>
            )}
            {instagramNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-pink-100 text-pink-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn("w-5 h-5", collapsed ? "mx-auto" : "mr-3")}
                  />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {!collapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">SocialEdge v1.0.0</div>
          </div>
        )}
      </div>
    </div>
  );
}
