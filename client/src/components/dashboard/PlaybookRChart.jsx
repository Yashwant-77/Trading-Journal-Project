
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

import { getPlaybookRPerformance } from "../../utils/tradeAnalytics";

function PlaybookRChart({ trades }) {

  const data =
    getPlaybookRPerformance(trades);


  return (

    <div className="bg-[#1E1E1E] border border-zinc-800 rounded-xl p-5">

      <div className="mb-5">

        <h2 className="text-lg font-semibold text-white">
          Average R by Playbook
        </h2>

        <p className="text-sm text-zinc-500 mt-1">
          Compare realized R performance across strategies
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
                width={120}
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
                  `${Number(value).toFixed(2)}R`,
                  "Average R",
                ]}
              />

              <ReferenceLine
                x={0}
                stroke="#52525b"
              />

              <Bar
                dataKey="averageR"
                radius={[0, 5, 5, 0]}
              >

                {data.map(
                  (entry, index) => (

                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.averageR >= 0
                          ? "#34d399"
                          : "#f87171"
                      }
                    />

                  )
                )}

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        )}

      </div>

    </div>
  );
}

export default PlaybookRChart;

