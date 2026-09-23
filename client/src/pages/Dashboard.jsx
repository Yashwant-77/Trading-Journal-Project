// import React from "react";
// import { useEffect } from "react";
// import Header from "../components/Header";
// import API from "../api";
// import { useDispatch, useSelector } from "react-redux";
// import { setTrades } from "../store/tradesSlice";

// function Dashboard() {
//   const trades = useSelector((state) => state.trades.trades)

// const stats = getTradeStats(filteredTrades);

//   return (
//     <div className="">
//       <Header />

//       <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 ">
//         <div className="bg-[#1E1E1E]  p-4 rounded-lg shadow text-center">
//           <p className="text-white font-bold">Total Trades</p>
//           <p className="text-3xl font-bold text-blue-600">
//             {stats.totalTrades}
//           </p>
//         </div>
//         <div className="bg-[#1E1E1E] p-4 rounded-lg shadow text-center">
//           <p className="text-white font-bold">Open</p>
//           <p className="text-3xl font-bold text-yellow-600">
//             {stats.openTrades}
//           </p>
//         </div>
//         <div className="bg-[#1E1E1E] p-4 rounded-lg shadow text-center">
//           <p className="text-white font-bold">Closed</p>
//           <p className="text-3xl font-bold text-green-600">
//             {stats.closedTrades}
//           </p>
//         </div>
//         <div className="bg-[#1E1E1E] p-4 rounded-lg shadow text-center">
//           <p className="text-white font-bold">Total P&L</p>
//           <p
//             className={`text-3xl font-bold ${stats.totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}
//           >
//             ${stats.totalPnL.toFixed(2)}
//           </p>
//         </div>
//         <div className="bg-[#1E1E1E] p-4 rounded-lg shadow text-center">
//           <p className="text-white font-bold">Win Rate</p>
//           <p className="text-3xl font-bold text-purple-600">{stats.winRate}%</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

// ----------------------------------------------------------------------------------------------

import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import { useSelector } from "react-redux";

import StatCard from "../components/dashboard/StatCard";
import DashboardFilters from "../components/dashboard/DashboardFilters";
import PnLChart from "../components/dashboard/PnLChart";
import DailyPnLChart from "../components/dashboard/DailyPnLChart";
import WinLossChart from "../components/dashboard/WinLossChart";
import PlaybookPnLChart from "../components/dashboard/PlaybookPnLChart";
import SymbolPnLChart from "../components/dashboard/SymbolPnLChart";
import DrawdownChart from "../components/dashboard/DrawndownChart";
import RiskMetrics from "../components/dashboard/RiskMetrics";
import RMultipleChart from "../components/dashboard/RMultipleChar";
import DayOfWeekChart from "../components/dashboard/DayOfWeekChart";
import HourlyPnLChart from "../components/dashboard/HourlyPnLChart";
import DirectionChart from "../components/dashboard/DirectionChart";
import TradingFrequency from "../components/dashboard/TradingFrequency";
import { getPlaybookPerformance } from "../utils/tradeAnalytics";
import PlaybookSummary from "../components/dashboard/PlaybookSummary";
import PlaybookPerformanceTable from "../components/dashboard/PlaybookPerformanceTable";
import PlaybookRChart from "../components/dashboard/PlaybookRChart";
import {
  getTradeQualityStats,
  getRDistribution,
} from "../utils/tradeAnalytics";
import TradeQualityMetrics from "../components/dashboard/TradeQualityMetrics";
import RDistributionChart from "../components/dashboard/RDistributionChart";

import { calculateStats } from "../utils/tradeAnalytics";

function Dashboard() {

  
  const trades = useSelector((state) => state.trades.trades);

  const [range, setRange] = useState("all");
  const [playbook, setPlaybook] = useState("all");

  const playbooks = useMemo(() => {
    return [
      ...new Set(trades.map((trade) => trade.playbook?.trim()).filter(Boolean)),
    ].sort();
  }, [trades]);

  // ===============================
  // FILTER TRADES
  // ===============================

  const filteredTrades = useMemo(() => {
    if (!trades.length) {
      return [];
    }

    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return trades.filter((trade) => {
      if (!trade.entry_date) {
        return false;
      }

      const tradeDate = new Date(trade.entry_date);

      switch (range) {
        case "today":
          return tradeDate >= today;

        case "week": {
          const startOfWeek = new Date(today);

          const day = startOfWeek.getDay();

          const diff = day === 0 ? 6 : day - 1;

          startOfWeek.setDate(startOfWeek.getDate() - diff);

          return tradeDate >= startOfWeek;
        }

        case "month": {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

          return tradeDate >= startOfMonth;
        }

        case "lastMonth": {
          const startOfLastMonth = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1,
          );

          const startOfThisMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1,
          );

          return tradeDate >= startOfLastMonth && tradeDate < startOfThisMonth;
        }

        case "3months": {
          const threeMonthsAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 3,
            now.getDate(),
          );

          return tradeDate >= threeMonthsAgo;
        }

        case "year": {
          const startOfYear = new Date(now.getFullYear(), 0, 1);

          return tradeDate >= startOfYear;
        }

        case "all":
        default:
          return true;
      }
    });
  }, [trades, range]);

  const strategyFilteredTrades = useMemo(() => {
    if (playbook === "all") {
      return filteredTrades;
    }

    return filteredTrades.filter(
      (trade) => trade.playbook?.trim() === playbook,
    );
  }, [filteredTrades, playbook]);

  // ===============================
  // CALCULATE STATS
  // ===============================

  const stats = useMemo(
    () => calculateStats(strategyFilteredTrades),
    [strategyFilteredTrades],
  );




  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Trading Dashboard
          </h1>

          <p className="text-sm text-zinc-500 mt-1">
            Analyze your trading performance
          </p>
        </div>
        {/* ========================= */}
        {/* FILTERS */}
        {/* ========================= */}
        <div className="mb-6">
          <DashboardFilters
            range={range}
            setRange={setRange}
            playbook={playbook}
            setPlaybook={setPlaybook}
            playbooks={playbooks}
          />
        </div>
        {/* ========================= */}
        {/* PRIMARY STATS */}
        {/* ========================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard
            title="Net P&L"
            value={`$${stats.netPnl.toFixed(2)}`}
            subtitle="After fees"
            valueColor={stats.netPnl >= 0 ? "text-emerald-400" : "text-red-400"}
          />

          <StatCard
            title="Win Rate"
            value={`${stats.winRate.toFixed(2)}%`}
            subtitle={`${stats.winningTrades} winning trades`}
            valueColor="text-indigo-400"
          />

          <StatCard
            title="Total Trades"
            value={stats.totalTrades}
            subtitle={`${stats.closedTrades} closed`}
            valueColor="text-white"
          />

          <StatCard
            title="Profit Factor"
            value={stats.profitFactor.toFixed(2)}
            subtitle="Gross profit / gross loss"
            valueColor="text-purple-400"
          />
        </div>
        {/* ========================= */}
        {/* SECONDARY STATS */}
        {/* ========================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Gross P&L"
            value={`$${stats.grossPnl.toFixed(2)}`}
            subtitle="Before fees"
            valueColor={
              stats.grossPnl >= 0 ? "text-emerald-400" : "text-red-400"
            }
          />

          <StatCard
            title="Total Fees"
            value={`$${stats.totalFees.toFixed(2)}`}
            subtitle="Entry + exit fees"
            valueColor="text-orange-400"
          />

          <StatCard
            title="Average Trade"
            value={`$${stats.averageTrade.toFixed(2)}`}
            subtitle="Per closed trade"
            valueColor={
              stats.averageTrade >= 0 ? "text-emerald-400" : "text-red-400"
            }
          />

          <StatCard
            title="Largest Loss"
            value={`$${stats.largestLoss.toFixed(2)}`}
            subtitle="Single trade"
            valueColor="text-red-400"
          />
        </div>
        {/* ========================= */}
        {/* P&L CHART */}
        {/* ========================= */}
        <div className="mb-6">
          <PnLChart trades={strategyFilteredTrades} />
        </div>
        {/* ========================= */}
        {/* PHASE 2 ANALYTICS */}
        {/* ========================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily P&L */}
          <DailyPnLChart trades={strategyFilteredTrades} />

          {/* Win / Loss */}
          <WinLossChart trades={strategyFilteredTrades} />

          {/* Playbook */}
          <PlaybookPnLChart trades={strategyFilteredTrades} />

          {/* Symbol */}
          <SymbolPnLChart trades={strategyFilteredTrades} />
        </div>
        {/* ========================= */}
        {/* WIN / LOSS SUMMARY */}
        {/* ========================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Winning Trades"
            value={stats.winningTrades}
            valueColor="text-emerald-400"
          />

          <StatCard
            title="Losing Trades"
            value={stats.losingTrades}
            valueColor="text-red-400"
          />

          <StatCard
            title="Average Win"
            value={`$${stats.averageWin.toFixed(2)}`}
            valueColor="text-emerald-400"
          />

          <StatCard
            title="Average Loss"
            value={`-$${stats.averageLoss.toFixed(2)}`}
            valueColor="text-red-400"
          />
        </div>
        {/* ========================= */}
        {/* PHASE 3 — RISK ANALYTICS */}
        {/* ========================= */}
        <div className="mt-8 mb-4">
          <h2 className="text-xl font-bold text-white">Risk & Performance</h2>

          <p className="text-sm text-zinc-500 mt-1">
            Analyze drawdown, risk, expectancy and consistency
          </p>
        </div>
        {/* Risk Metrics */}
        <div className="mb-6">
          <RiskMetrics trades={strategyFilteredTrades} />
        </div>
        {/* Drawdown Chart */}
        <div className="mb-6">
          <DrawdownChart trades={strategyFilteredTrades} />
        </div>
        {/* ========================= */}
        {/* R-MULTIPLE ANALYSIS */}
        {/* ========================= */}
        <div className="mb-6">
          <RMultipleChart trades={strategyFilteredTrades} />
        </div>
        {/* ========================= */}
        {/* PHASE 4 — TIME ANALYSIS */}
        {/* ========================= */}
        <div className="mt-10 mb-5">
          <h2 className="text-xl font-bold text-white">Trading Behavior</h2>

          <p className="text-sm text-zinc-500 mt-1">
            Understand when and how you trade
          </p>
        </div>
        {/* Trading Frequency */}
        <div className="mb-6">
          <TradingFrequency trades={strategyFilteredTrades} />
        </div>
        {/* Time Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DayOfWeekChart trades={strategyFilteredTrades} />

          <HourlyPnLChart trades={strategyFilteredTrades} />

          <DirectionChart trades={strategyFilteredTrades} />
        </div>
        {/* ========================= */}
        {/* PHASE 5 — STRATEGY ANALYSIS */}
        {/* ========================= */}
        <div className="mt-10 mb-5">
          <h2 className="text-xl font-bold text-white">Strategy Performance</h2>

          <p className="text-sm text-zinc-500 mt-1">
            Analyze the performance of each trading playbook
          </p>
        </div>
        {/* Strategy Summary */}
        <div className="mb-6">
          <PlaybookSummary trades={strategyFilteredTrades} />
        </div>
        {/* Strategy Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PlaybookRChart trades={strategyFilteredTrades} />

          <PlaybookPnLChart trades={strategyFilteredTrades} />
        </div>
        {/* Strategy Table */}
        <div className="mb-6">
          <PlaybookPerformanceTable trades={strategyFilteredTrades} />
        </div>
        {/* ========================= */}
{/* PHASE 6 — TRADE QUALITY */}
{/* ========================= */}

<div className="mt-10 mb-5">

  <h2 className="text-xl font-bold text-white">
    Trade Quality
  </h2>

  <p className="text-sm text-zinc-500 mt-1">
    Analyze how efficiently your trades convert risk into returns
  </p>

</div>


{/* Trade Quality Metrics */}

<div className="mb-6">

  <TradeQualityMetrics
    trades={strategyFilteredTrades}
  />

</div>


{/* R Distribution */}

<div className="mb-6">

  <RDistributionChart
    trades={strategyFilteredTrades}
  />

</div>
      </main>
    </div>
  );
}

export default Dashboard;
