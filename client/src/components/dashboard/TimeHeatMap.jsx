
import React, { useMemo } from "react";
import { getTimeHeatmapData } from "../../utils/tradeAnalytics";

function TimeHeatmap({ trades }) {

  const data = useMemo(
    () => getTimeHeatmapData(trades),
    [trades]
  );

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const getCellClass = (value) => {

    if (value > 0) {
      if (value >= 500) return "bg-emerald-500 text-white";
      if (value >= 250) return "bg-emerald-600/80 text-white";
      if (value >= 100) return "bg-emerald-700/70 text-emerald-100";

      return "bg-emerald-900/60 text-emerald-300";
    }

    if (value < 0) {
      if (value <= -500) return "bg-red-500 text-white";
      if (value <= -250) return "bg-red-600/80 text-white";
      if (value <= -100) return "bg-red-700/70 text-red-100";

      return "bg-red-900/60 text-red-300";
    }

    return "bg-zinc-900 text-zinc-600";
  };


  return (
    <div className="bg-[#1E1E1E] border border-zinc-800 rounded-xl p-5">

      {/* Header */}

      <div className="mb-5">

        <h2 className="text-lg font-semibold text-white">
          Trading Time Heatmap
        </h2>

        <p className="text-sm text-zinc-500 mt-1">
          Net P&L by day of week and entry hour
        </p>

      </div>


      {data.length === 0 ? (

        <div className="h-40 flex items-center justify-center text-zinc-500">
          No time data available
        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full border-separate border-spacing-1">

            <thead>

              <tr>

                <th className="text-left text-xs text-zinc-500 font-medium p-2">
                  Time
                </th>

                {days.map((day) => (

                  <th
                    key={day}
                    className="text-center text-xs text-zinc-500 font-medium p-2 min-w-[90px]"
                  >
                    {day.slice(0, 3)}
                  </th>

                ))}

              </tr>

            </thead>


            <tbody>

              {data.map((row) => (

                <tr key={row.hour}>

                  {/* Hour */}

                  <td className="text-xs text-zinc-400 font-medium p-2 whitespace-nowrap">
                    {row.label}
                  </td>


                  {/* Day cells */}

                  {days.map((day) => {

                    const value = row[day];

                    return (

                      <td
                        key={day}
                        className={`rounded-md text-center text-xs font-medium p-3 min-w-[90px] ${getCellClass(value)}`}
                        title={`${day} ${row.label}: ${
                          value >= 0 ? "+" : ""
                        }₹${value.toFixed(2)}`}
                      >
                        {value === 0
                          ? "—"
                          : `${value >= 0 ? "+" : ""}${value.toFixed(0)}`}
                      </td>

                    );

                  })}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}


      {/* Legend */}

      <div className="flex items-center justify-end gap-4 mt-5 text-xs text-zinc-500">

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-red-700/70"></span>
          Loss
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-zinc-900 border border-zinc-800"></span>
          No trades
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-emerald-700/70"></span>
          Profit
        </div>

      </div>

    </div>
  );
}

export default TimeHeatmap;

