
import React from "react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import { getWinLossData } from "../../utils/tradeAnalytics";

function WinLossChart({ trades }) {

  const data = getWinLossData(trades);

  const COLORS = [
    "#34d399",
    "#f87171",
    "#71717a",
  ];

  const totalTrades = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="bg-[#1E1E1E] border border-zinc-800 rounded-xl p-5">

      <div className="mb-4">

        <h2 className="text-lg font-semibold text-white">
          Win / Loss Distribution
        </h2>

        <p className="text-sm text-zinc-500 mt-1">
          Distribution of your trading results
        </p>

      </div>


      <div className="h-[320px]">

        {totalTrades === 0 ? (

          <div className="h-full flex items-center justify-center text-zinc-500">
            No trading data available
          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <PieChart>

              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={110}
                paddingAngle={3}
              >

                {data.map((entry, index) => (

                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index]}
                  />

                ))}

              </Pie>


              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />


              <Legend
                wrapperStyle={{
                  color: "#a1a1aa",
                  fontSize: "13px",
                }}
              />

            </PieChart>

          </ResponsiveContainer>

        )}

      </div>

    </div>
  );
}

export default WinLossChart;

