import React from "react";

function DashboardFilters({
  range,
  setRange,
  playbook,
  setPlaybook,
  playbooks,
}) {
  const filters = [
    { label: "All Time", value: "all" },
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "Last Month", value: "lastMonth" },
    { label: "Last 3 Months", value: "3months" },
    { label: "This Year", value: "year" },
  ];

  return (
    <div className="space-y-3">
      {/* ========================= */}
      {/* DATE FILTERS */}
      {/* ========================= */}

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setRange(filter.value)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition ${
              range === filter.value
                ? "bg-emerald-400 text-black"
                : "bg-[#1E1E1E] text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* ========================= */}
      {/* PLAYBOOK FILTER */}
      {/* ========================= */}

      <div className="flex items-center gap-3">
        <label className="text-sm text-zinc-400 whitespace-nowrap">
          Playbook
        </label>

        <select
          value={playbook}
          onChange={(e) => setPlaybook(e.target.value)}
          className="bg-[#1E1E1E] text-white border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 transition"
        >
          <option value="all">All Playbooks</option>

          {playbooks.map((playbook) => (
            <option key={playbook._id} value={playbook._id}>
              {playbook.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default DashboardFilters;
