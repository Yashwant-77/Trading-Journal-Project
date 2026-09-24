import React from "react";
import Header from "../components/Header";

function Settings() {
  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Settings
          </h1>

          <p className="text-sm text-zinc-500 mt-1">
            Manage your account and trading preferences.
          </p>
        </div>

        {/* Account */}
        <section className="bg-[#181818] border border-zinc-800 rounded-xl p-5 mb-5">
          <h2 className="text-lg font-semibold text-white">
            Account
          </h2>

          <p className="text-sm text-zinc-500 mt-1">
            Manage your account information.
          </p>
        </section>

        {/* Trading Preferences */}
        <section className="bg-[#181818] border border-zinc-800 rounded-xl p-5 mb-5">
          <h2 className="text-lg font-semibold text-white">
            Trading Preferences
          </h2>

          <p className="text-sm text-zinc-500 mt-1">
            Configure your default trading settings.
          </p>
        </section>

        {/* Appearance */}
        <section className="bg-[#181818] border border-zinc-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white">
            Appearance
          </h2>

          <p className="text-sm text-zinc-500 mt-1">
            Customize how TradeLedger looks.
          </p>
        </section>

      </main>
    </div>
  );
}

export default Settings;