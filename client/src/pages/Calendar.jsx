import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import { useSelector } from "react-redux";

function Calendar() {
  const trades = useSelector((state) => state.trades.trades);
  const playbooks = useSelector((state) => state.playbooks.playbooks);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const [playbookFilter, setPlaybookFilter] = useState("all");
  const [symbolFilter, setSymbolFilter] = useState("all");

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // ===============================
  // PLAYBOOK MAP
  // ===============================

  const playbookMap = useMemo(() => {
    return Object.fromEntries(
      playbooks.map((playbook) => [playbook._id, playbook.name]),
    );
  }, [playbooks]);


// ===============================
// CALENDAR FILTERS
// ===============================

const symbols = useMemo(() => {
  return [...new Set(trades.map((trade) => trade.symbol).filter(Boolean))].sort();
}, [trades]);

const filteredTrades = useMemo(() => {
  return trades.filter((trade) => {
    const matchesPlaybook =
      playbookFilter === "all" ||
      trade.playbook_id === playbookFilter;

    const matchesSymbol =
      symbolFilter === "all" ||
      trade.symbol === symbolFilter;

    return matchesPlaybook && matchesSymbol;
  });
}, [trades, playbookFilter, symbolFilter]);



  // ===============================
  // MONTH NAVIGATION
  // ===============================

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    const today = new Date();

    setCurrentDate(today);
    setSelectedDate(
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(today.getDate()).padStart(2, "0")}`,
    );
  };

  // ===============================
  // CALENDAR DAYS
  // ===============================

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const daysInMonth = lastDay.getDate();

    const days = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    const remainingCells = 7 - (days.length % 7);

    if (remainingCells < 7) {
      for (let i = 0; i < remainingCells; i++) {
        days.push(null);
      }
    }

    return days;
  }, [year, month]);

  // ===============================
  // GROUP TRADES BY DATE
  // ===============================

  const tradesByDate = useMemo(() => {
    const grouped = {};

    filteredTrades.forEach((trade) => {
      if (!trade.entry_date) return;

      const dateKey =
        typeof trade.entry_date === "string"
          ? trade.entry_date.substring(0, 10)
          : new Date(trade.entry_date).toISOString().substring(0, 10);

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(trade);
    });

    return grouped;
  }, [filteredTrades]);

  // ===============================
  // DAILY STATS
  // ===============================

  const getDailyStats = (day) => {
    if (!day) return null;

    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;

    const dayTrades = tradesByDate[dateKey] || [];

    if (dayTrades.length === 0) {
      return null;
    }

    const netPnl = dayTrades.reduce(
      (total, trade) => total + Number(trade.net_pnl || 0),
      0,
    );

    const winningTrades = dayTrades.filter(
      (trade) => Number(trade.net_pnl || 0) > 0,
    ).length;

    const losingTrades = dayTrades.filter(
      (trade) => Number(trade.net_pnl || 0) < 0,
    ).length;

    const totalFees = dayTrades.reduce(
      (total, trade) =>
        total + Number(trade.entry_fees || 0) + Number(trade.exit_fees || 0),
      0,
    );

    const winRate =
      dayTrades.length > 0 ? (winningTrades / dayTrades.length) * 100 : 0;

    const rValues = dayTrades
      .filter((trade) => Number(trade.sl) > 0)
      .map((trade) => Number(trade.net_pnl || 0) / Number(trade.sl));

    const averageR =
      rValues.length > 0
        ? rValues.reduce((sum, r) => sum + r, 0) / rValues.length
        : null;

    const bestTrade = [...dayTrades].sort(
      (a, b) => Number(b.net_pnl || 0) - Number(a.net_pnl || 0),
    )[0];

    const worstTrade = [...dayTrades].sort(
      (a, b) => Number(a.net_pnl || 0) - Number(b.net_pnl || 0),
    )[0];

    return {
      trades: dayTrades,
      tradeCount: dayTrades.length,
      netPnl,
      winningTrades,
      losingTrades,
      totalFees,
      winRate,
      averageR,
      bestTrade,
      worstTrade,
    };
  };

  // ===============================
  // SELECTED DAY
  // ===============================

  const selectedDayStats = selectedDate
    ? {
        date: selectedDate,
        trades: tradesByDate[selectedDate] || [],
      }
    : null;

  const selectedTrades = selectedDayStats?.trades || [];

  const selectedNetPnl = selectedTrades.reduce(
    (total, trade) => total + Number(trade.net_pnl || 0),
    0,
  );

  const selectedWinningTrades = selectedTrades.filter(
    (trade) => Number(trade.net_pnl || 0) > 0,
  ).length;

  const selectedLosingTrades = selectedTrades.filter(
    (trade) => Number(trade.net_pnl || 0) < 0,
  ).length;

  const selectedWinRate =
    selectedTrades.length > 0
      ? (selectedWinningTrades / selectedTrades.length) * 100
      : 0;

  const selectedFees = selectedTrades.reduce(
    (total, trade) =>
      total + Number(trade.entry_fees || 0) + Number(trade.exit_fees || 0),
    0,
  );

  const selectedRValues = selectedTrades
    .filter((trade) => Number(trade.sl) > 0)
    .map((trade) => Number(trade.net_pnl || 0) / Number(trade.sl));

  const selectedAverageR =
    selectedRValues.length > 0
      ? selectedRValues.reduce((sum, r) => sum + r, 0) / selectedRValues.length
      : null;

  // ===============================
  // MONTHLY STATS
  // ===============================

  const monthlyStats = useMemo(() => {
    const monthTrades = filteredTrades.filter((trade) => {
      if (!trade.entry_date) return false;

      const dateKey =
        typeof trade.entry_date === "string"
          ? trade.entry_date.substring(0, 10)
          : new Date(trade.entry_date).toISOString().substring(0, 10);

      const [tradeYear, tradeMonth] = dateKey.split("-").map(Number);

      return tradeYear === year && tradeMonth === month + 1;
    });

    if (monthTrades.length === 0) {
      return {
        netPnl: 0,
        tradeCount: 0,
        tradingDays: 0,
        winRate: 0,
        averageR: null,
        bestDay: null,
        worstDay: null,
      };
    }

    // -------------------------------
    // Net P&L
    // -------------------------------

    const netPnl = monthTrades.reduce(
      (total, trade) => total + Number(trade.net_pnl || 0),
      0,
    );

    // -------------------------------
    // Winning trades
    // -------------------------------

    const winningTrades = monthTrades.filter(
      (trade) => Number(trade.net_pnl || 0) > 0,
    ).length;

    const winRate = (winningTrades / monthTrades.length) * 100;

    // -------------------------------
    // Trading days
    // -------------------------------

    const uniqueDates = new Set();

    monthTrades.forEach((trade) => {
      if (!trade.entry_date) return;

      const dateKey =
        typeof trade.entry_date === "string"
          ? trade.entry_date.substring(0, 10)
          : new Date(trade.entry_date).toISOString().substring(0, 10);

      uniqueDates.add(dateKey);
    });

    // -------------------------------
    // Average R
    // -------------------------------

    const rValues = monthTrades
      .filter((trade) => Number(trade.sl) > 0)
      .map((trade) => Number(trade.net_pnl || 0) / Number(trade.sl));

    const averageR =
      rValues.length > 0
        ? rValues.reduce((sum, r) => sum + r, 0) / rValues.length
        : null;

    // -------------------------------
    // Daily P&L
    // -------------------------------

    const dailyPnl = {};

    monthTrades.forEach((trade) => {
      const dateKey =
        typeof trade.entry_date === "string"
          ? trade.entry_date.substring(0, 10)
          : new Date(trade.entry_date).toISOString().substring(0, 10);

      if (!dailyPnl[dateKey]) {
        dailyPnl[dateKey] = 0;
      }

      dailyPnl[dateKey] += Number(trade.net_pnl || 0);
    });

    const dailyResults = Object.entries(dailyPnl).map(([date, pnl]) => ({
      date,
      pnl,
    }));

    const bestDay = dailyResults.reduce((best, current) =>
      current.pnl > best.pnl ? current : best,
    );

    const worstDay = dailyResults.reduce((worst, current) =>
      current.pnl < worst.pnl ? current : worst,
    );

    return {
      netPnl,
      tradeCount: monthTrades.length,
      tradingDays: uniqueDates.size,
      winRate,
      averageR,
      bestDay,
      worstDay,
    };
  }, [filteredTrades, year, month]);

  // ===============================
  // WEEK DAYS
  // ===============================

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // ===============================
  // TODAY
  // ===============================

  const today = new Date();

  const isToday = (day) => {
    return (
      day &&
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  };

  // ===============================
  // FORMAT SELECTED DATE
  // ===============================

  const formattedSelectedDate = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString("default", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* =============================== */}
        {/* PAGE HEADER */}
        {/* =============================== */}

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Trading Calendar
          </h1>

          <p className="text-sm text-zinc-500 mt-1">
            View your trading performance day by day
          </p>
        </div>

        {/* =============================== */}
        {/* CALENDAR HEADER */}
        {/* =============================== */}

        <div className="bg-[#181818] border border-zinc-800 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={previousMonth}
              className="px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              ←
            </button>

            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">
                {monthName} {year}
              </h2>

              <button
                type="button"
                onClick={goToToday}
                className="px-3 py-1.5 text-sm rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
              >
                Today
              </button>
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className="px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              →
            </button>

            
          </div>
          {/* =============================== */}
{/* CALENDAR FILTERS */}
{/* =============================== */}

<div className="flex flex-col sm:flex-row gap-3 mt-4">

  {/* Playbook Filter */}
  <select
    value={playbookFilter}
    onChange={(e) => {
      setPlaybookFilter(e.target.value);
      setSelectedDate(null);
    }}
    className="w-full sm:w-64 bg-[#121212] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-emerald-400"
  >
    <option value="all">All Playbooks</option>

    {playbooks.map((playbook) => (
      <option key={playbook._id} value={playbook._id}>
        {playbook.name}
      </option>
    ))}
  </select>

  {/* Symbol Filter */}
  <select
    value={symbolFilter}
    onChange={(e) => {
      setSymbolFilter(e.target.value);
      setSelectedDate(null);
    }}
    className="w-full sm:w-64 bg-[#121212] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-emerald-400"
  >
    <option value="all">All Symbols</option>

    {symbols.map((symbol) => (
      <option key={symbol} value={symbol}>
        {symbol}
      </option>
    ))}
  </select>

  {/* Clear Filters */}
  {(playbookFilter !== "all" || symbolFilter !== "all") && (
    <button
      type="button"
      onClick={() => {
        setPlaybookFilter("all");
        setSymbolFilter("all");
        setSelectedDate(null);
      }}
      className="px-4 py-2 rounded-lg text-sm text-zinc-400 border border-zinc-700 hover:bg-zinc-800 hover:text-white transition"
    >
      Clear Filters
    </button>
  )}

</div>

        </div>

        {/* =============================== */}
        {/* MONTHLY SUMMARY */}
        {/* =============================== */}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
          {/* Net P&L */}
          <div className="bg-[#181818] border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-500">Net P&L</div>

            <div
              className={`text-lg font-semibold mt-1 ${
                monthlyStats.netPnl >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {monthlyStats.netPnl >= 0 ? "+" : ""}₹
              {monthlyStats.netPnl.toFixed(2)}
            </div>
          </div>

          {/* Trades */}
          <div className="bg-[#181818] border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-500">Trades</div>

            <div className="text-lg font-semibold text-white mt-1">
              {monthlyStats.tradeCount}
            </div>
          </div>

          {/* Trading Days */}
          <div className="bg-[#181818] border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-500">Trading Days</div>

            <div className="text-lg font-semibold text-white mt-1">
              {monthlyStats.tradingDays}
            </div>
          </div>

          {/* Win Rate */}
          <div className="bg-[#181818] border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-500">Win Rate</div>

            <div className="text-lg font-semibold text-emerald-400 mt-1">
              {monthlyStats.winRate.toFixed(1)}%
            </div>
          </div>

          {/* Average R */}
          <div className="bg-[#181818] border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-500">Average R</div>

            <div
              className={`text-lg font-semibold mt-1 ${
                monthlyStats.averageR === null
                  ? "text-zinc-500"
                  : monthlyStats.averageR >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
              }`}
            >
              {monthlyStats.averageR === null
                ? "—"
                : `${
                    monthlyStats.averageR >= 0 ? "+" : ""
                  }${monthlyStats.averageR.toFixed(2)}R`}
            </div>
          </div>
        </div>

        {/* Best / Worst Trading Day */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {/* Best Day */}
          <div className="bg-[#181818] border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-500">Best Trading Day</div>

            {monthlyStats.bestDay ? (
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-zinc-300">
                  {new Date(
                    `${monthlyStats.bestDay.date}T00:00:00`,
                  ).toLocaleDateString("default", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </span>

                <span className="text-lg font-semibold text-emerald-400">
                  + ₹{monthlyStats.bestDay.pnl.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="text-sm text-zinc-600 mt-2">No trading data</div>
            )}
          </div>

          {/* Worst Day */}
          <div className="bg-[#181818] border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-500">Worst Trading Day</div>

            {monthlyStats.worstDay ? (
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-zinc-300">
                  {new Date(
                    `${monthlyStats.worstDay.date}T00:00:00`,
                  ).toLocaleDateString("default", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </span>

                <span className="text-lg font-semibold text-red-400">
                  {monthlyStats.worstDay.pnl >= 0 ? "+" : ""}₹
                  {monthlyStats.worstDay.pnl.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="text-sm text-zinc-600 mt-2">No trading data</div>
            )}
          </div>
        </div>

        {/* =============================== */}
        {/* CALENDAR */}
        {/* =============================== */}

        <div className="bg-[#181818] border border-zinc-800 rounded-xl overflow-hidden">
          {/* Week Days */}
          <div className="grid grid-cols-7 border-b border-zinc-800">
            {weekDays.map((day) => (
              <div
                key={day}
                className="px-3 py-3 text-center text-xs sm:text-sm font-medium text-zinc-500 border-r border-zinc-800"
              >
                <span className="hidden sm:inline">{day}</span>

                <span className="sm:hidden">{day.substring(0, 3)}</span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const dailyStats = getDailyStats(day);

              const dateKey =
                day !== null
                  ? `${year}-${String(month + 1).padStart(2, "0")}-${String(
                      day,
                    ).padStart(2, "0")}`
                  : null;

              const isSelected = selectedDate === dateKey;

              return day === null ? (
                <div
                  key={index}
                  className="min-h-[140px] sm:min-h-[150px] border-r border-b border-zinc-800"
                />
              ) : (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedDate(dateKey)}
                  className={`
      text-left
      min-h-[140px]
      sm:min-h-[150px]
      border-r border-b border-zinc-800
      p-2 sm:p-3
      hover:bg-zinc-800/50
      cursor-pointer
      transition
      ${isSelected ? "ring-2 ring-inset ring-emerald-400" : ""}
    `}
                >
                  {/* Date */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`
          flex items-center justify-center
          w-7 h-7
          rounded-full
          text-sm font-medium
          ${isToday(day) ? "bg-emerald-400 text-white" : "text-zinc-300"}
        `}
                    >
                      {day}
                    </span>
                  </div>

                  {/* Trading Data */}
                  {dailyStats ? (
                    <div className="mt-3 space-y-1.5">
                      {/* P&L */}
                      <div
                        className={`
            text-base sm:text-lg font-semibold
            ${
              dailyStats.netPnl > 0
                ? "text-emerald-400"
                : dailyStats.netPnl < 0
                  ? "text-red-400"
                  : "text-zinc-400"
            }
          `}
                      >
                        {dailyStats.netPnl >= 0 ? "+" : ""}₹
                        {dailyStats.netPnl.toFixed(2)}
                      </div>

                      {/* Trades */}
                      <div className="text-xs text-zinc-400">
                        {dailyStats.tradeCount}{" "}
                        {dailyStats.tradeCount === 1 ? "trade" : "trades"}
                      </div>

                      {/* Win Rate */}
                      <div className="text-xs text-zinc-500">
                        Win rate{" "}
                        <span className="text-zinc-300">
                          {dailyStats.winRate.toFixed(0)}%
                        </span>
                      </div>

                      {/* Average R */}
                      {dailyStats.averageR !== null && (
                        <div className="text-xs text-zinc-500">
                          Avg R{" "}
                          <span
                            className={
                              dailyStats.averageR >= 0
                                ? "text-emerald-400"
                                : "text-red-400"
                            }
                          >
                            {dailyStats.averageR >= 0 ? "+" : ""}
                            {dailyStats.averageR.toFixed(2)}R
                          </span>
                        </div>
                      )}

                      {/* Win / Loss */}
                      <div className="flex gap-2 text-xs pt-1">
                        {dailyStats.winningTrades > 0 && (
                          <span className="text-emerald-500">
                            W {dailyStats.winningTrades}
                          </span>
                        )}

                        {dailyStats.losingTrades > 0 && (
                          <span className="text-red-500">
                            L {dailyStats.losingTrades}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 text-xs text-zinc-700">No trades</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* =============================== */}
        {/* DAILY DETAIL */}
        {/* =============================== */}

        {selectedDate && (
          <div className="mt-6">
            {/* Daily Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {formattedSelectedDate}
                  </h2>

                  <p className="text-sm text-zinc-500 mt-1">
                    Daily trading performance
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  className="px-3 py-2 text-sm rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                >
                  Close
                </button>
              </div>
            </div>

            {selectedTrades.length === 0 ? (
              <div className="bg-[#181818] border border-zinc-800 rounded-xl p-8 text-center">
                <p className="text-zinc-400">No trades on this day.</p>
              </div>
            ) : (
              <>
                {/* =============================== */}
                {/* DAILY SUMMARY */}
                {/* =============================== */}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                  <SummaryCard
                    label="Net P&L"
                    value={`${
                      selectedNetPnl >= 0 ? "+" : ""
                    }₹${selectedNetPnl.toFixed(2)}`}
                    valueClass={
                      selectedNetPnl >= 0 ? "text-emerald-400" : "text-red-400"
                    }
                  />

                  <SummaryCard
                    label="Trades"
                    value={selectedTrades.length}
                    valueClass="text-white"
                  />

                  <SummaryCard
                    label="Win Rate"
                    value={`${selectedWinRate.toFixed(1)}%`}
                    valueClass="text-emerald-400"
                  />

                  <SummaryCard
                    label="Winning"
                    value={selectedWinningTrades}
                    valueClass="text-emerald-400"
                  />

                  <SummaryCard
                    label="Losing"
                    value={selectedLosingTrades}
                    valueClass="text-red-400"
                  />

                  <SummaryCard
                    label="Fees"
                    value={`₹${selectedFees.toFixed(2)}`}
                    valueClass="text-orange-400"
                  />
                </div>

                {/* Average R */}
                {selectedAverageR !== null && (
                  <div className="bg-[#181818] border border-zinc-800 rounded-xl p-4 mb-6">
                    <div className="text-sm text-zinc-500">Average R</div>

                    <div
                      className={`text-2xl font-bold mt-1 ${
                        selectedAverageR >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {selectedAverageR >= 0 ? "+" : ""}
                      {selectedAverageR.toFixed(2)}R
                    </div>
                  </div>
                )}

                {/* =============================== */}
                {/* TRADE LIST */}
                {/* =============================== */}

                <div className="bg-[#181818] border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="px-4 py-4 border-b border-zinc-800">
                    <h3 className="font-semibold text-white">Trades</h3>

                    <p className="text-xs text-zinc-500 mt-1">
                      {selectedTrades.length} trades executed on this day
                    </p>
                  </div>

                  <div className="divide-y divide-zinc-800">
                    {selectedTrades.map((trade) => {
                      const pnl = Number(trade.net_pnl || 0);

                      const r =
                        Number(trade.sl) > 0 ? pnl / Number(trade.sl) : null;

                      return (
                        <div
                          key={trade._id}
                          className="p-4 hover:bg-zinc-800/30 transition"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
                            {/* Symbol */}
                            <div>
                              <div className="text-sm font-semibold text-white">
                                {trade.symbol}
                              </div>

                              <div
                                className={`text-xs mt-1 ${
                                  trade.type === "LONG"
                                    ? "text-emerald-400"
                                    : "text-red-400"
                                }`}
                              >
                                {trade.type}
                              </div>
                            </div>

                            {/* Playbook */}
                            <div>
                              <div className="text-xs text-zinc-500">
                                Playbook
                              </div>

                              <div className="text-sm text-zinc-300 mt-1 truncate">
                                {playbookMap[trade.playbook_id] || "Unknown"}
                              </div>
                            </div>

                            {/* Entry */}
                            <div>
                              <div className="text-xs text-zinc-500">Entry</div>

                              <div className="text-sm text-zinc-300 mt-1">
                                {trade.entry_price}
                              </div>
                            </div>

                            {/* Exit */}
                            <div>
                              <div className="text-xs text-zinc-500">Exit</div>

                              <div className="text-sm text-zinc-300 mt-1">
                                {trade.exit_price ?? "—"}
                              </div>
                            </div>

                            {/* R */}
                            <div>
                              <div className="text-xs text-zinc-500">R</div>

                              <div
                                className={`text-sm font-medium mt-1 ${
                                  r === null
                                    ? "text-zinc-500"
                                    : r >= 0
                                      ? "text-emerald-400"
                                      : "text-red-400"
                                }`}
                              >
                                {r === null
                                  ? "—"
                                  : `${r >= 0 ? "+" : ""}${r.toFixed(2)}R`}
                              </div>
                            </div>

                            {/* P&L */}
                            <div>
                              <div className="text-xs text-zinc-500">
                                Net P&L
                              </div>

                              <div
                                className={`text-sm font-semibold mt-1 ${
                                  pnl >= 0 ? "text-emerald-400" : "text-red-400"
                                }`}
                              >
                                {pnl >= 0 ? "+" : ""}₹{pnl.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// =====================================
// SUMMARY CARD
// =====================================

function SummaryCard({ label, value, valueClass }) {
  return (
    <div className="bg-[#181818] border border-zinc-800 rounded-xl p-4">
      <div className="text-xs text-zinc-500">{label}</div>

      <div className={`text-lg font-semibold mt-1 ${valueClass}`}>{value}</div>
    </div>
  );
}

export default Calendar;
