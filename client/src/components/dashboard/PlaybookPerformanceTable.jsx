
import React, { useMemo } from "react";
import { getPlaybookPerformance } from "../../utils/tradeAnalytics";

function PlaybookPerformanceTable({ trades }) {

  const data = useMemo(
    () => getPlaybookPerformance(trades),
    [trades]
  );

  const formatMoney = (value) => {
    const number = Number(value || 0);

    return `${number >= 0 ? "+" : "-"}₹${Math.abs(number).toFixed(2)}`;
  };

  if (data.length === 0) {
    return (
      <div className="bg-[#1E1E1E] border border-zinc-800 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white">
          Playbook Performance
        </h2>

        <p className="text-sm text-zinc-500 mt-1">
          Detailed performance of each trading strategy
        </p>

        <div className="py-12 text-center text-zinc-500">
          No playbook data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1E1E1E] border border-zinc-800 rounded-xl p-5">

      {/* Header */}

      <div className="mb-5">

        <h2 className="text-lg font-semibold text-white">
          Playbook Performance
        </h2>

        <p className="text-sm text-zinc-500 mt-1">
          Detailed performance of each trading strategy
        </p>

      </div>


      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>

            <tr className="border-b border-zinc-800">

              <th className="text-left py-3 px-3 text-zinc-500 font-medium">
                Playbook
              </th>

              <th className="text-right py-3 px-3 text-zinc-500 font-medium">
                Trades
              </th>

              <th className="text-right py-3 px-3 text-zinc-500 font-medium">
                Win Rate
              </th>

              <th className="text-right py-3 px-3 text-zinc-500 font-medium">
                Net P&L
              </th>

              <th className="text-right py-3 px-3 text-zinc-500 font-medium">
                Avg P&L
              </th>

              <th className="text-right py-3 px-3 text-zinc-500 font-medium">
                Avg R
              </th>

              <th className="text-right py-3 px-3 text-zinc-500 font-medium">
                Planned R:R
              </th>

              <th className="text-right py-3 px-3 text-zinc-500 font-medium">
                Profit Factor
              </th>

            </tr>

          </thead>


          <tbody>

            {data.map((item) => (

              <tr
                key={item.playbook}
                className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition"
              >

                {/* Playbook */}

                <td className="py-4 px-3">

                  <span className="font-medium text-white">
                    {item.playbook}
                  </span>

                </td>


                {/* Trades */}

                <td className="py-4 px-3 text-right text-zinc-300">
                  {item.trades}
                </td>


                {/* Win Rate */}

                <td className="py-4 px-3 text-right">

                  <span
                    className={
                      item.winRate >= 50
                        ? "text-emerald-400"
                        : "text-red-400"
                    }
                  >
                    {item.winRate.toFixed(1)}%
                  </span>

                </td>


                {/* Net P&L */}

                <td
                  className={`py-4 px-3 text-right font-semibold ${
                    item.netPnl >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {formatMoney(item.netPnl)}
                </td>


                {/* Average P&L */}

                <td
                  className={`py-4 px-3 text-right ${
                    item.averagePnl >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {formatMoney(item.averagePnl)}
                </td>


                {/* Average R */}

                <td
                  className={`py-4 px-3 text-right font-medium ${
                    item.averageR >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {item.averageR >= 0 ? "+" : ""}
                  {item.averageR.toFixed(2)}R
                </td>


                {/* Planned R:R */}

                <td className="py-4 px-3 text-right text-indigo-400">

                  {item.plannedRR > 0
                    ? `1:${item.plannedRR.toFixed(2)}`
                    : "-"}

                </td>


                {/* Profit Factor */}

                <td className="py-4 px-3 text-right text-purple-400">

                  {Number.isFinite(item.profitFactor)
                    ? item.profitFactor.toFixed(2)
                    : "∞"}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default PlaybookPerformanceTable;

