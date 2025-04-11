"use client";

import { ReactNode } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Award,
} from "lucide-react";
import ThemeToggle from "./components/ThemeToggle";
import DarkModeScript from "./DarkModeScript";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon, label, href, active }: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
        active
          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Initialize dark mode */}
      <DarkModeScript />

      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="h-full flex flex-col">
          <div className="p-6 flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Admin Panel
            </h1>
            <ThemeToggle />
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              href="/adoffice"
            />
            <SidebarItem
              icon={<Users size={20} />}
              label="Users"
              href="/adoffice/users"
            />
            <SidebarItem
              icon={<Award size={20} />}
              label="Creator Requests"
              href="/adoffice/creator-requests"
            />
            <SidebarItem
              icon={<FileText size={20} />}
              label="Content"
              href="/adoffice/content"
            />
            <SidebarItem
              icon={<Settings size={20} />}
              label="Settings"
              href="/adoffice/settings"
            />
          </nav>
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <SidebarItem
              icon={<LogOut size={20} />}
              label="Logout"
              href="/logout"
            />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
