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

function RMultipleChart({ trades }) {

  const data = useMemo(() => {

    const sortedTrades = [...trades].sort(
      (a, b) =>
        new Date(a.entry_date) -
        new Date(b.entry_date)
    );

    return sortedTrades
      .filter(
        (trade) =>
          Number(trade.sl) > 0
      )
      .map((trade, index) => {

        const risk = Number(
          trade.sl
        );

        const netPnL = Number(
          trade.net_pnl || 0
        );

        const actualR =
          netPnL / risk;

        const plannedR =
          Number(trade.tp || 0) /
          risk;

        return {
          trade: index + 1,
          actualR,
          plannedR,
          symbol: trade.symbol,
          playbook: trade.playbook,
        };

      });

  }, [trades]);


  return (

    <div className="bg-[#1E1E1E] border border-zinc-800 rounded-xl p-5">

      <div className="mb-5">

        <h2 className="text-lg font-semibold text-white">
          R-Multiple Performance
        </h2>

        <p className="text-sm text-zinc-500 mt-1">
          Actual return relative to your planned risk
        </p>

      </div>


      <div className="h-[320px]">

        {data.length === 0 ? (

          <div className="h-full flex items-center justify-center text-zinc-500">
            No SL data available
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
                dataKey="trade"
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
                formatter={(value, name) => {

                  if (name === "actualR") {
                    return [
                      `${Number(value).toFixed(2)}R`,
                      "Actual R",
                    ];
                  }

                  return [
                    `${Number(value).toFixed(2)}R`,
                    "Planned R",
                  ];
                }}
              />

              <ReferenceLine
                y={0}
                stroke="#52525b"
              />


              <Bar
                dataKey="actualR"
                radius={[4, 4, 0, 0]}
              >

                {data.map(
                  (entry, index) => (

                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.actualR >= 0
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

export default RMultipleChart;