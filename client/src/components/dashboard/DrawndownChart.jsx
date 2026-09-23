
import React from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

import { getDrawdownData } from "../../utils/tradeAnalytics";

function DrawdownChart({ trades }) {

  const data = getDrawdownData(trades);

  return (
    <div className="bg-[#1E1E1E] border border-zinc-800 rounded-xl p-5">

      <div className="mb-5">

        <h2 className="text-lg font-semibold text-white">
          Drawdown
        </h2>

        <p className="text-sm text-zinc-500 mt-1">
          How far your equity has fallen from its peak
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

            <AreaChart data={data}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
              />

              <XAxis
                dataKey="tradeNumber"
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
                  "Drawdown",
                ]}
              />

              <ReferenceLine
                y={0}
                stroke="#52525b"
              />

              <Area
                type="monotone"
                dataKey="drawdown"
                stroke="#f87171"
                fill="#f87171"
                fillOpacity={0.15}
                strokeWidth={2}
              />

            </AreaChart>

          </ResponsiveContainer>

        )}

      </div>

    </div>
  );
}

export default DrawdownChart;

