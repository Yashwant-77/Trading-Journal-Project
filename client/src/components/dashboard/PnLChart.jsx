
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function PnLChart({ trades }) {

  const sortedTrades = [...trades].sort(
    (a, b) =>
      new Date(a.entry_date) -
      new Date(b.entry_date)
  );

  let cumulative = 0;

  const data = sortedTrades.map((trade, index) => {

    cumulative += Number(trade.net_pnl || 0);

    return {
      trade: index + 1,
      date: trade.entry_date,
      pnl: cumulative,
    };
  });

  return (
    <div className="bg-[#1E1E1E] border border-zinc-800 rounded-xl p-5">

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">
          Cumulative P&L
        </h2>

        <p className="text-sm text-zinc-500 mt-1">
          Your cumulative net profit and loss over time
        </p>
      </div>

      <div className="h-[320px]">

        {data.length === 0 ? (

          <div className="h-full flex items-center justify-center text-zinc-500">
            No trades available for this period
          </div>

        ) : (

          <ResponsiveContainer width="100%" height="100%">

            <AreaChart data={data}>

              <defs>
                <linearGradient
                  id="pnlGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#6366f1"
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="95%"
                    stopColor="#6366f1"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
              />

              <XAxis
                dataKey="trade"
                stroke="#71717a"
                tick={{ fill: "#71717a", fontSize: 12 }}
              />

              <YAxis
                stroke="#71717a"
                tick={{ fill: "#71717a", fontSize: 12 }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value) => [
                  `$${Number(value).toFixed(2)}`,
                  "Net P&L",
                ]}
              />

              <Area
                type="monotone"
                dataKey="pnl"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#pnlGradient)"
              />

            </AreaChart>

          </ResponsiveContainer>

        )}

      </div>

    </div>
  );
}

export default PnLChart;

