
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
  Cell,
} from "recharts";

import { getHourlyPnL } from "../../utils/tradeAnalytics";

function HourlyPnLChart({ trades }) {

  const data = getHourlyPnL(trades);

  return (
    <div className="bg-[#1E1E1E] border border-zinc-800 rounded-xl p-5">

      <div className="mb-5">

        <h2 className="text-lg font-semibold text-white">
          P&L by Hour
        </h2>

        <p className="text-sm text-zinc-500 mt-1">
          Identify the hours where your trading performs best
        </p>

      </div>

      <div className="h-[320px]">

        {data.length === 0 ? (

          <div className="h-full flex items-center justify-center text-zinc-500">
            No entry-time data available
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
                  fill: "#a1a1aa",
                  fontSize: 11,
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
                formatter={(value, name) => {

                  if (name === "pnl") {
                    return [
                      `$${Number(value).toFixed(2)}`,
                      "Net P&L",
                    ];
                  }

                  return [value, "Trades"];
                }}
              />

              <ReferenceLine
                y={0}
                stroke="#52525b"
              />

              <Bar
                dataKey="pnl"
                radius={[5, 5, 0, 0]}
              >

                {data.map((entry, index) => (

                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.pnl >= 0
                        ? "#6366f1"
                        : "#f87171"
                    }
                  />

                ))}

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        )}

      </div>

    </div>
  );
}

export default HourlyPnLChart;

