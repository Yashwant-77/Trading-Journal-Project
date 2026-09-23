
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

import { getDailyPnL } from "../../utils/tradeAnalytics";

function DailyPnLChart({ trades }) {

  const data = getDailyPnL(trades);

  return (
    <div className="bg-[#1E1E1E] border border-zinc-800 rounded-xl p-5">

      <div className="mb-5">

        <h2 className="text-lg font-semibold text-white">
          Daily P&L
        </h2>

        <p className="text-sm text-zinc-500 mt-1">
          Net profit and loss by trading day
        </p>

      </div>


      <div className="h-[320px]">

        {data.length === 0 ? (

          <div className="h-full flex items-center justify-center text-zinc-500">
            No trading data available
          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart data={data}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                stroke="#71717a"
                tick={{
                  fill: "#71717a",
                  fontSize: 12,
                }}
              />

              <YAxis
                stroke="#71717a"
                tick={{
                  fill: "#71717a",
                  fontSize: 12,
                }}
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

              <ReferenceLine
                y={0}
                stroke="#52525b"
              />

              <Bar
                dataKey="pnl"
                radius={[4, 4, 0, 0]}
                fill="#6366f1"
              />

            </BarChart>

          </ResponsiveContainer>

        )}

      </div>

    </div>
  );
}

export default DailyPnLChart;

