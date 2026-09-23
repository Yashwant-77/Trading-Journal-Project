
import React, { useMemo } from "react";

import StatCard from "./StatCard";

import {
  getMaxDrawdown,
  getStreaks,
  getExpectancy,
  getAverageRiskReward,
  getAverageRMultiple,
  getRecoveryFactor,
} from "../../utils/tradeAnalytics";

function RiskMetrics({ trades }) {

  const metrics = useMemo(() => {

    const maxDrawdown =
      getMaxDrawdown(trades);

    const streaks =
      getStreaks(trades);

    const expectancy =
      getExpectancy(trades);

    const averageRR =
      getAverageRiskReward(trades);

    const averageR =
      getAverageRMultiple(trades);

    const recoveryFactor =
      getRecoveryFactor(trades);

    const totalPlannedRisk =
      trades.reduce(
        (sum, trade) =>
          sum + Number(trade.sl || 0),
        0
      );

    return {
      maxDrawdown,
      ...streaks,
      expectancy,
      averageRR,
      averageR,
      recoveryFactor,
      totalPlannedRisk,
    };

  }, [trades]);


  return (

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Max Drawdown */}

      <StatCard
        title="Max Drawdown"
        value={`$${Math.abs(
          metrics.maxDrawdown
        ).toFixed(2)}`}
        subtitle="Largest equity decline"
        valueColor="text-red-400"
      />


      {/* Expectancy */}

      <StatCard
        title="Expectancy"
        value={`$${metrics.expectancy.toFixed(2)}`}
        subtitle="Average net P&L per trade"
        valueColor={
          metrics.expectancy >= 0
            ? "text-emerald-400"
            : "text-red-400"
        }
      />


      {/* Planned R:R */}

      <StatCard
        title="Avg. Planned R:R"
        value={`${metrics.averageRR.toFixed(2)}R`}
        subtitle="TP ÷ SL"
        valueColor="text-indigo-400"
      />


      {/* Average R */}

      <StatCard
        title="Average R"
        value={`${metrics.averageR >= 0 ? "+" : ""}${metrics.averageR.toFixed(2)}R`}
        subtitle="Realized net P&L ÷ SL"
        valueColor={
          metrics.averageR >= 0
            ? "text-emerald-400"
            : "text-red-400"
        }
      />


      {/* Recovery Factor */}

      <StatCard
        title="Recovery Factor"
        value={
          Number.isFinite(
            metrics.recoveryFactor
          )
            ? metrics.recoveryFactor.toFixed(2)
            : "∞"
        }
        subtitle="Net P&L ÷ max drawdown"
        valueColor="text-purple-400"
      />


      {/* Total Planned Risk */}

      <StatCard
        title="Total Planned Risk"
        value={`$${metrics.totalPlannedRisk.toFixed(2)}`}
        subtitle="Sum of SL across trades"
        valueColor="text-orange-400"
      />


      {/* Best Win Streak */}

      <StatCard
        title="Best Win Streak"
        value={metrics.maxWinStreak}
        subtitle="Consecutive winners"
        valueColor="text-emerald-400"
      />


      {/* Worst Loss Streak */}

      <StatCard
        title="Worst Loss Streak"
        value={metrics.maxLossStreak}
        subtitle="Consecutive losers"
        valueColor="text-red-400"
      />

    </div>

  );
}

export default RiskMetrics;



