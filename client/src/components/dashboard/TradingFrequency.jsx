
import React, { useMemo } from "react";

import StatCard from "./StatCard";

import { getTradingFrequency } from "../../utils/tradeAnalytics";

function TradingFrequency({ trades }) {

  const stats = useMemo(
    () => getTradingFrequency(trades),
    [trades]
  );

  return (

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

      <StatCard
        title="Trading Days"
        value={stats.tradingDays}
        subtitle="Days with at least one trade"
        valueColor="text-white"
      />

      <StatCard
        title="Avg Trades / Day"
        value={stats.averageTradesPerDay.toFixed(2)}
        subtitle="Average trading frequency"
        valueColor="text-indigo-400"
      />

      <StatCard
        title="Avg Trades / Week"
        value={stats.averageTradesPerWeek.toFixed(2)}
        subtitle="Average weekly frequency"
        valueColor="text-purple-400"
      />

      <StatCard
        title="Max Trades / Day"
        value={stats.maxTradesInDay}
        subtitle="Highest daily activity"
        valueColor="text-orange-400"
      />

    </div>

  );
}

export default TradingFrequency;
