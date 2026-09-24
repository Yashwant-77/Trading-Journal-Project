import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import API from "../api";
import { logout } from "../store/authSlice";

function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==============================
  // DEFAULT SETTINGS
  // ==============================

  const defaultSettings = {
    dashboardPeriod: "all",
    calendarView: "month",
    confirmDelete: true,
    theme: "dark",
    density: "comfortable",
  };

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("tradeledger_settings");

    return savedSettings
      ? { ...defaultSettings, ...JSON.parse(savedSettings) }
      : defaultSettings;
  });

  // ==============================
  // FETCH USER
  // ==============================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get("/auth/get-user");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ==============================
  // SAVE SETTINGS
  // ==============================

  useEffect(() => {
    localStorage.setItem(
      "tradeledger_settings",
      JSON.stringify(settings)
    );

    // Apply theme
    if (settings.theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [settings]);

  // ==============================
  // UPDATE SETTING
  // ==============================

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ==============================
  // RESET SETTINGS
  // ==============================

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = () => {
    localStorage.removeItem("token");

    dispatch(logout());

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* ==============================
            PAGE HEADER
        ============================== */}

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Settings
          </h1>

          <p className="text-sm text-zinc-500 mt-1">
            Manage your account, trading preferences and appearance.
          </p>
        </div>

        {/* ==============================
            ACCOUNT
        ============================== */}

        <section className="bg-[#181818] border border-zinc-800 rounded-xl p-5 mb-5">

          <h2 className="text-lg font-semibold text-white">
            Account
          </h2>

          <p className="text-sm text-zinc-500 mt-1 mb-5">
            Manage your account information.
          </p>

          {loading ? (
            <p className="text-sm text-zinc-500">
              Loading account information...
            </p>
          ) : user ? (
            <div className="space-y-4">

              {/* Username */}

              <div>
                <label className="text-xs text-zinc-500">
                  Username
                </label>

                <div className="mt-1 text-sm text-zinc-200">
                  {user.username || "—"}
                </div>
              </div>

              {/* Email */}

              <div>
                <label className="text-xs text-zinc-500">
                  Email
                </label>

                <div className="mt-1 text-sm text-zinc-200">
                  {user.email || "—"}
                </div>
              </div>

              {/* Logout */}

              <div className="pt-3 border-t border-zinc-800">

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/20 transition"
                >
                  Logout
                </button>

              </div>

            </div>
          ) : (
            <p className="text-sm text-red-400">
              Unable to load account information.
            </p>
          )}

        </section>

        {/* ==============================
            TRADING PREFERENCES
        ============================== */}

        <section className="bg-[#181818] border border-zinc-800 rounded-xl p-5 mb-5">

          <h2 className="text-lg font-semibold text-white">
            Trading Preferences
          </h2>

          <p className="text-sm text-zinc-500 mt-1 mb-5">
            Configure how TradeLedger behaves.
          </p>

          <div className="space-y-5">

            {/* Dashboard Period */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>
                <p className="text-sm text-zinc-200">
                  Default Dashboard Period
                </p>

                <p className="text-xs text-zinc-500 mt-1">
                  Select the period shown when opening the dashboard.
                </p>
              </div>

              <select
                value={settings.dashboardPeriod}
                onChange={(e) =>
                  updateSetting("dashboardPeriod", e.target.value)
                }
                className="w-full sm:w-48 bg-[#121212] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2  focus:ring-emerald-300"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="threeMonths">Last 3 Months</option>
                <option value="year">This Year</option>
              </select>

            </div>

            {/* Calendar View */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>
                <p className="text-sm text-zinc-200">
                  Default Calendar View
                </p>

                <p className="text-xs text-zinc-500 mt-1">
                  Choose the default calendar display.
                </p>
              </div>

              <select
                value={settings.calendarView}
                onChange={(e) =>
                  updateSetting("calendarView", e.target.value)
                }
                className="w-full sm:w-48 bg-[#121212] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <option value="month">Month</option>
              </select>

            </div>

            {/* Confirm Delete */}

            <div className="flex items-center justify-between gap-4 pt-2">

              <div>
                <p className="text-sm text-zinc-200">
                  Confirm Before Delete
                </p>

                <p className="text-xs text-zinc-500 mt-1">
                  Ask for confirmation before deleting a trade.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateSetting(
                    "confirmDelete",
                    !settings.confirmDelete
                  )
                }
                className={`relative w-11 h-6 rounded-full transition ${
                  settings.confirmDelete
                    ? "bg-emerald-400"
                    : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                    settings.confirmDelete
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>

            </div>

          </div>

        </section>

        {/* ==============================
            APPEARANCE
        ============================== */}

        <section className="bg-[#181818] border border-zinc-800 rounded-xl p-5 mb-5">

          <h2 className="text-lg font-semibold text-white">
            Appearance
          </h2>

          <p className="text-sm text-zinc-500 mt-1 mb-5">
            Customize how TradeLedger looks.
          </p>

          <div className="space-y-5">

            {/* Theme */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>
                <p className="text-sm text-zinc-200">
                  Theme
                </p>

                <p className="text-xs text-zinc-500 mt-1">
                  Choose the appearance of TradeLedger.
                </p>
              </div>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() => updateSetting("theme", "dark")}
                  className={`px-4 py-2 rounded-lg text-sm border transition ${
                    settings.theme === "dark"
                      ? "bg-emerald-400/10 border-emerald-400 text-emerald-400"
                      : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  Dark
                </button>

                <button
                  type="button"
                  onClick={() => updateSetting("theme", "light")}
                  className={`px-4 py-2 rounded-lg text-sm border transition ${
                    settings.theme === "light"
                      ? "bg-emerald-400/10 border-emerald-400 text-emerald-400"
                      : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  Light
                </button>

              </div>

            </div>

            {/* Density */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>
                <p className="text-sm text-zinc-200">
                  Interface Density
                </p>

                <p className="text-xs text-zinc-500 mt-1">
                  Control spacing throughout the application.
                </p>
              </div>

              <select
                value={settings.density}
                onChange={(e) =>
                  updateSetting("density", e.target.value)
                }
                className="w-full sm:w-48 bg-[#121212] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <option value="comfortable">
                  Comfortable
                </option>

                <option value="compact">
                  Compact
                </option>
              </select>

            </div>

          </div>

        </section>

        {/* ==============================
            RESET SETTINGS
        ============================== */}

        <section className="bg-[#181818] border border-zinc-800 rounded-xl p-5">

          <h2 className="text-lg font-semibold text-white">
            Reset Settings
          </h2>

          <p className="text-sm text-zinc-500 mt-1 mb-4">
            Restore all local TradeLedger preferences to their
            default values.
          </p>

          <button
            type="button"
            onClick={resetSettings}
            className="px-4 py-2 rounded-lg text-sm border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            Reset Preferences
          </button>

        </section>

      </main>
    </div>
  );
}

export default Settings;