
import React, { useMemo } from "react";

import StatCard from "./StatCard";

import {
  getPlaybookPerformance,
} from "../../utils/tradeAnalytics";

function PlaybookSummary({ trades }) {

  const data = useMemo(
    () =>
      getPlaybookPerformance(trades),
    [trades]
  );


  const bestPnl =
    data.length > 0
      ? [...data].sort(
          (a, b) =>
            b.netPnl - a.netPnl
        )[0]
      : null;


  const bestR =
    data.length > 0
      ? [...data].sort(
          (a, b) =>
            b.averageR - a.averageR
        )[0]
      : null;


  const bestWinRate =
    data.length > 0
      ? [...data].sort(
          (a, b) =>
            b.winRate - a.winRate
        )[0]
      : null;


  return (

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

      <StatCard
        title="Playbooks"
        value={data.length}
        subtitle="Strategies being tracked"
        valueColor="text-white"
      />


      <StatCard
        title="Highest Net P&L"
        value={
          bestPnl
            ? `${bestPnl.netPnl >= 0 ? "+" : "-"}$${Math.abs(
                bestPnl.netPnl
              ).toFixed(2)}`
            : "-"
        }
        subtitle={
          bestPnl
            ? bestPnl.playbook
            : "No data"
        }
        valueColor="text-emerald-400"
      />


      <StatCard
        title="Highest Avg R"
        value={
          bestR
            ? `${bestR.averageR >= 0 ? "+" : ""}${bestR.averageR.toFixed(2)}R`
            : "-"
        }
        subtitle={
          bestR
            ? bestR.playbook
            : "No data"
        }
        valueColor="text-indigo-400"
      />


      <StatCard
        title="Highest Win Rate"
        value={
          bestWinRate
            ? `${bestWinRate.winRate.toFixed(1)}%`
            : "-"
        }
        subtitle={
          bestWinRate
            ? bestWinRate.playbook
            : "No data"
        }
        valueColor="text-purple-400"
      />

    </div>

  );
}

export default PlaybookSummary;

