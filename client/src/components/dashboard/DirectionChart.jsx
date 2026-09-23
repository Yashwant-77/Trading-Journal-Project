
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

import { getDirectionStats } from "../../utils/tradeAnalytics";

function DirectionChart({ trades }) {

  const data =
    getDirectionStats(trades);

  return (
    <div className="bg-[#1E1E1E] border border-zinc-800 rounded-xl p-5">

      <div className="mb-5">

        <h2 className="text-lg font-semibold text-white">
          LONG vs SHORT
        </h2>

        <p className="text-sm text-zinc-500 mt-1">
          Compare performance by trade direction
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
              dataKey="direction"
              stroke="#71717a"
              tick={{
                fill: "#a1a1aa",
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
              radius={[6, 6, 0, 0]}
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


      {/* Direction Summary */}

      <div className="grid grid-cols-2 gap-3 mt-4">

        {data.map((item) => (

          <div
            key={item.direction}
            className="bg-[#161616] rounded-lg p-3"
          >

            <div className="flex justify-between items-center">

              <span className="text-sm font-semibold text-white">
                {item.direction}
              </span>

              <span
                className={`text-sm font-semibold ${
                  item.pnl >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                ${item.pnl.toFixed(2)}
              </span>

            </div>

            <div className="flex justify-between mt-2">

              <span className="text-xs text-zinc-500">
                Win Rate
              </span>

              <span className="text-xs text-zinc-300">
                {item.winRate.toFixed(1)}%
              </span>

            </div>

            <div className="flex justify-between mt-1">

              <span className="text-xs text-zinc-500">
                Avg R
              </span>

              <span className="text-xs text-zinc-300">
                {item.averageR >= 0 ? "+" : ""}
                {item.averageR.toFixed(2)}R
              </span>

            </div>

            <div className="flex justify-between mt-1">

              <span className="text-xs text-zinc-500">
                Trades
              </span>

              <span className="text-xs text-zinc-300">
                {item.trades}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default DirectionChart;

