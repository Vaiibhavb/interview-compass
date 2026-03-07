/**
 * =============================================
 * App Layout with Sidebar Navigation
 * Contains role-based sidebar menu items
 * Dark mode toggle, user info, and logout
 * =============================================
 */

import { Navigate, Outlet, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  LayoutDashboard, Users, UserCheck, ClipboardList,
  BarChart3, LogOut, Moon, Sun, Menu, X, FileText
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

/** Navigation item definition */
interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: string[]; // which roles can see this item
}

/** All navigation items with role-based visibility */
const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["admin", "technical", "hr"] },
  { label: "Candidates", path: "/candidates", icon: Users, roles: ["admin"] },
  { label: "Manage Users", path: "/users", icon: UserCheck, roles: ["admin"] },
  { label: "My Interviews", path: "/my-interviews", icon: ClipboardList, roles: ["technical"] },
  { label: "HR Reviews", path: "/hr-reviews", icon: FileText, roles: ["hr"] },
  { label: "Analytics", path: "/analytics", icon: BarChart3, roles: ["admin", "hr"] },
];

const AppLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Redirect to login if not authenticated */
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  /* Filter nav items based on user role */
  const visibleItems = navItems.filter((item) => item.roles.includes(user.role));

  /** Role display label */
  const roleLabel = user.role === "admin" ? "Administrator" : user.role === "technical" ? "Tech Interviewer" : "HR Manager";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ===== SIDEBAR (desktop: always visible, mobile: overlay) ===== */}
      <>
        {/* Mobile overlay backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar panel */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground
            transition-transform duration-300 lg:static lg:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Sidebar header — branding */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
            <span className="font-display text-lg text-sidebar-primary">InterviewTracker</span>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-sidebar-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {visibleItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                    ${isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar footer — user info + actions */}
          <div className="border-t border-sidebar-border p-4 space-y-3">
            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>

            {/* User info */}
            <div className="rounded-lg bg-sidebar-accent p-3">
              <p className="text-sm font-medium text-sidebar-accent-foreground">{user.name}</p>
              <p className="text-xs text-sidebar-muted">{roleLabel}</p>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-sidebar-accent transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </aside>
      </>

      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar (mobile menu button) */}
        <header className="flex h-16 items-center border-b border-border px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-3 text-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-medium text-foreground">
            {visibleItems.find((i) => i.path === location.pathname)?.label || "Dashboard"}
          </h2>
        </header>

        {/* Page content — scrollable */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
