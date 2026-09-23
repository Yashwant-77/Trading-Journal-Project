
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

import { getDayOfWeekPnL } from "../../utils/tradeAnalytics";

function DayOfWeekChart({ trades }) {

  const data = getDayOfWeekPnL(trades);

  return (
    <div className="bg-[#1E1E1E] border border-zinc-800 rounded-xl p-5">

      <div className="mb-5">

        <h2 className="text-lg font-semibold text-white">
          P&L by Day
        </h2>

        <p className="text-sm text-zinc-500 mt-1">
          Performance based on the day you entered trades
        </p>

      </div>

      <div className="h-[320px]">

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
              dataKey="day"
              stroke="#71717a"
              tick={{
                fill: "#a1a1aa",
                fontSize: 11,
              }}
              tickFormatter={(value) =>
                value.substring(0, 3)
              }
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
                      ? "#34d399"
                      : "#f87171"
                  }
                />

              ))}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default DayOfWeekChart;

