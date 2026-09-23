
import React from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

import { getSymbolPnL } from "../../utils/tradeAnalytics";

function SymbolPnLChart({ trades }) {

  const data = getSymbolPnL(trades);

  return (
    <div className="bg-[#1E1E1E] border border-zinc-800 rounded-xl p-5">

      <div className="mb-5">

        <h2 className="text-lg font-semibold text-white">
          P&L by Symbol
        </h2>

        <p className="text-sm text-zinc-500 mt-1">
          Performance across traded instruments
        </p>

      </div>


      <div className="h-[320px]">

        {data.length === 0 ? (

          <div className="h-full flex items-center justify-center text-zinc-500">
            No symbol data available
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
                dataKey="symbol"
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
                formatter={(value) => [
                  `$${Number(value).toFixed(2)}`,
                  "Net P&L",
                ]}
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

export default SymbolPnLChart;
