import React, { useMemo } from "react";

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

import { getRDistribution } from "../../utils/tradeAnalytics";


function RDistributionChart({ trades }) {

  const data = useMemo(
    () => getRDistribution(trades),
    [trades]
  );


  return (
    <div className="bg-[#1E1E1E] border border-zinc-800 rounded-xl p-5">

      <div className="mb-5">

        <h2 className="text-lg font-semibold text-white">
          R-Multiple Distribution
        </h2>

        <p className="text-sm text-zinc-500 mt-1">
          Actual R achieved on each trade
        </p>

      </div>


      <div className="h-[320px]">

        {data.length === 0 ? (

          <div className="h-full flex items-center justify-center text-zinc-500">
            No R-multiple data available
          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >

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
                label={{
                  value: "Trade",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#71717a",
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
                  `${Number(value).toFixed(2)}R`,
                  "Actual R",
                ]}
              />

              <ReferenceLine
                y={0}
                stroke="#52525b"
              />

              <Bar
                dataKey="r"
                radius={[5, 5, 0, 0]}
              >

                {data.map((entry, index) => (

                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.r >= 0
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

export default RDistributionChart;

