
import React, { useMemo } from "react";
import StatCard from "./StatCard";
import { getTradeQualityStats } from "../../utils/tradeAnalytics";

function TradeQualityMetrics({ trades }) {

  const stats = useMemo(
    () => getTradeQualityStats(trades),
    [trades]
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

      <StatCard
        title="Average R"
        value={`${stats.averageR >= 0 ? "+" : ""}${stats.averageR.toFixed(2)}R`}
        subtitle="Average realized R"
        valueColor={
          stats.averageR >= 0
            ? "text-emerald-400"
            : "text-red-400"
        }
      />

      <StatCard
        title="Average Win R"
        value={`+${stats.averageWinR.toFixed(2)}R`}
        subtitle="Average winning trade"
        valueColor="text-emerald-400"
      />

      <StatCard
        title="Average Loss R"
        value={`${stats.averageLossR.toFixed(2)}R`}
        subtitle="Average losing trade"
        valueColor="text-red-400"
      />

      <StatCard
        title="Planned R:R"
        value={
          stats.averagePlannedRR > 0
            ? `1:${stats.averagePlannedRR.toFixed(2)}`
            : "-"
        }
        subtitle="Average planned risk/reward"
        valueColor="text-indigo-400"
      />

    </div>
  );
}

export default TradeQualityMetrics;

