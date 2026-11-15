import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Files,
  CloudUpload,
  Search,
  CalendarDays,
  Bell,
  Sparkles,
  Clock,
  Settings,
  UserRound,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";

import "../styles/Sidebar.css";

function Sidebar() {
  const mainLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Documents", path: "/documents", icon: Files },
    { name: "Upload Files", path: "/upload", icon: CloudUpload },
    { name: "Smart Search", path: "/search", icon: Search },
    { name: "Expiry Calendar", path: "/calendar", icon: CalendarDays },
    { name: "Reminders", path: "/reminders", icon: Clock },
    { name: "Notifications", path: "/notifications", icon: Bell }
  ];

  const accountLinks = [
    { name: "AI Assistant", path: "/assistant", icon: Sparkles },
    { name: "My Profile", path: "/profile", icon: UserRound },
    { name: "Settings", path: "/settings", icon: Settings }
  ];

  return (
    <aside className="ll-sidebar">

      <div className="ll-brand">
        <div className="ll-brand-icon">
          <ShieldCheck size={25} />
        </div>

        <div className="ll-brand-text">
          <h2>LifeLedger</h2>
          <span>INTELLIGENT DOCUMENT VAULT</span>
        </div>
      </div>

      <div className="ll-sidebar-content">

        <p className="ll-menu-label">WORKSPACE</p>

        <nav className="ll-navigation">
          {mainLinks.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `ll-nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <p className="ll-menu-label ll-account-label">
          PERSONAL
        </p>

        <nav className="ll-navigation">
          {accountLinks.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `ll-nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

      </div>

      <div className="ll-sidebar-bottom">
        <div className="ll-security-card">
          <div className="ll-security-icon">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h4>Your Vault is Secure</h4>
            <p>Your documents stay protected.</p>
          </div>
        </div>

        <div className="ll-sidebar-footer">
          <span className="ll-footer-dot"></span>
          <span>LifeLedger v1.0</span>
          <span className="ll-footer-status">Online</span>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;