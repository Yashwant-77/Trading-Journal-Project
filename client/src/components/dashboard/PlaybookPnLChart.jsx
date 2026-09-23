
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

import { getPlaybookPnL } from "../../utils/tradeAnalytics";

function PlaybookPnLChart({ trades }) {

  const data = getPlaybookPnL(trades);

  return (
    <div className="bg-[#1E1E1E] border border-zinc-800 rounded-xl p-5">

      <div className="mb-5">

        <h2 className="text-lg font-semibold text-white">
          P&L by Playbook
        </h2>

        <p className="text-sm text-zinc-500 mt-1">
          Compare performance across your strategies
        </p>

      </div>


      <div className="h-[320px]">

        {data.length === 0 ? (

          <div className="h-full flex items-center justify-center text-zinc-500">
            No playbook data available
          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={data}
              layout="vertical"
              margin={{
                left: 20,
                right: 20,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                horizontal={false}
              />

              <XAxis
                type="number"
                stroke="#71717a"
                tick={{
                  fill: "#71717a",
                  fontSize: 12,
                }}
              />

              <YAxis
                type="category"
                dataKey="playbook"
                width={100}
                stroke="#71717a"
                tick={{
                  fill: "#a1a1aa",
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
                radius={[0, 5, 5, 0]}
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

        )}

      </div>

    </div>
  );
}

export default PlaybookPnLChart;

