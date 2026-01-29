import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import {
  MdHome,
  MdBuild,
  MdEngineering,
  MdCheckCircle,
  MdTune,
  MdSpeed,
  MdDashboard,
  MdSoap,
} from "react-icons/md";

import UserMenu from "../components/DropdownProfile";
import ThemeToggle from "../components/ThemeToggle";

function Header({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const routeConfig = {
    "/Home": { title: "Home", icon: MdHome },
    "/Line": { title: "Line", icon: MdBuild },
    "/Assembly": { title: "Assembly", icon: MdEngineering },
    "/DownTime": { title: "DownTime", icon: MdCheckCircle },
    "/CycleTime": { title: "Cycle Time", icon: MdTune },
    "/Quality": { title: "Quality", icon: MdSpeed },
  };

  const activeKey =
    Object.keys(routeConfig).find((path) =>
      location.pathname.startsWith(path)
    ) || null;

  const activeRoute = activeKey
    ? routeConfig[activeKey]
    : { title: "Dashboard", icon: MdDashboard };

  const ActiveIcon = activeRoute.icon;

  return (
    <header className="sticky top-0 z-40">
      {/* ===== Glass white background ===== */}
      <div className="relative bg-white/90 backdrop-blur-md border-b border-gray-200">

        {/* ===== Gradient Accent Line ===== */}
        <div />

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">

            {/* ================= LEFT ================= */}
            <div className="flex items-center gap-4">
              {/* Hamburger */}
              <button
                className="text-gray-500 hover:text-blue-600 transition lg:hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarOpen(!sidebarOpen);
                }}
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <rect x="4" y="5" width="16" height="2" />
                  <rect x="4" y="11" width="16" height="2" />
                  <rect x="4" y="17" width="16" height="2" />
                </svg>
              </button>

              {/* ===== Breadcrumb + Title ===== */}
              <div className="hidden lg:flex flex-col">

                {/* Animated Title */}
                <div
                  key={activeRoute.title}
                  className="flex items-center gap-2 text-2xl font-bold text-gray-900 animate-fadeSlide"
                >
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                    <ActiveIcon className="text-blue-600" />
                  </div>
                  <span>{activeRoute.title}</span>
                </div>
              </div>
            </div>

            {/* ================= RIGHT ================= */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="w-px h-6 bg-gray-200" />
              <UserMenu align="right" />
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
