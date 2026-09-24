
import React from "react";
import { useNavigate } from "react-router-dom";

export default function TradeCard({ trade }) {
  const grossPnl = Number(trade.pnl || 0);
  const entryFees = Number(trade.entry_fees || 0);
  const exitFees = Number(trade.exit_fees || 0);
  const netPnl = Number(trade.net_pnl || 0);
const navigate = useNavigate();
  const totalFees = entryFees + exitFees;

  const isProfit = netPnl > 0;
  const isLoss = netPnl < 0;

  // If exit price exists, consider the trade completed.
  const hasExit = trade.exit_price !== null && trade.exit_price !== undefined;

  const formatMoney = (value) => {
    const sign = value < 0 ? "-" : "";

    return `${sign}$${Math.abs(value).toFixed(2)}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-[#1E1E1E] border border-zinc-800 rounded-2xl overflow-hidden shadow-lg hover:border-zinc-700 transition-all duration-200">

      {/* ================= HEADER ================= */}
      <div className="p-5 border-b border-zinc-800">

        <div className="flex justify-between items-start gap-4">

          {/* Symbol + Type + Playbook */}
          <div className="min-w-0">

            <div className="flex items-center gap-3 flex-wrap">

              <h3 className="text-xl font-bold text-white">
                {trade.symbol}
              </h3>

              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                  trade.type === "LONG"
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-red-400/10 text-red-400"
                }`}
              >
                {trade.type}
              </span>

              <span className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-400">
                {hasExit ? "Closed" : "Open"}
              </span>

            </div>

            <p className="text-sm text-zinc-400 mt-2">
              {trade.playbook || "No playbook"}
            </p>

          </div>


          {/* Net P&L */}
          <div className="text-right shrink-0">

            <p className="text-xs text-zinc-500 uppercase tracking-wider">
              Net P&L
            </p>

            <p
              className={`text-2xl font-bold mt-1 ${
                isProfit
                  ? "text-emerald-400"
                  : isLoss
                  ? "text-red-400"
                  : "text-zinc-300"
              }`}
            >
              {formatMoney(netPnl)}
            </p>

          </div>

        </div>

      </div>


      {/* ================= PRICE INFORMATION ================= */}
      <div className="p-5">

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

          {/* Entry */}
          <div className="bg-[#161616] rounded-xl p-3">

            <p className="text-xs text-zinc-500 mb-1">
              Entry
            </p>

            <p className="text-sm font-semibold text-white">
              {trade.entry_price ?? "-"}
            </p>

            <p className="text-xs text-zinc-500 mt-1">
              {formatDate(trade.entry_date)}
              {trade.entry_time && ` • ${trade.entry_time}`}
            </p>

          </div>


          {/* Exit */}
          <div className="bg-[#161616] rounded-xl p-3">

            <p className="text-xs text-zinc-500 mb-1">
              Exit
            </p>

            <p className="text-sm font-semibold text-white">
              {hasExit ? trade.exit_price : "-"}
            </p>

            <p className="text-xs text-zinc-500 mt-1">
              {trade.exit_date
                ? `${formatDate(trade.exit_date)}${
                    trade.exit_time
                      ? ` • ${trade.exit_time}`
                      : ""
                  }`
                : "No exit"}
            </p>

          </div>


          {/* Quantity */}
          <div className="bg-[#161616] rounded-xl p-3">

            <p className="text-xs text-zinc-500 mb-1">
              Quantity
            </p>

            <p className="text-sm font-semibold text-white">
              {trade.quantity}
            </p>

          </div>


          {/* Fees */}
          <div className="bg-[#161616] rounded-xl p-3">

            <p className="text-xs text-zinc-500 mb-1">
              Total Fees
            </p>

            <p className="text-sm font-semibold text-red-400">
              {formatMoney(totalFees)}
            </p>

          </div>

        </div>


        {/* ================= RISK MANAGEMENT ================= */}
        <div className="mt-5">

          <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
            Risk Management
          </p>

          <div className="grid grid-cols-2 gap-3">

            <div className="bg-[#161616] rounded-xl px-4 py-3 flex justify-between items-center">

              <span className="text-sm text-zinc-400">
                Stop Loss
              </span>

              <span className="text-sm font-semibold text-red-400">
                {trade.sl ?? "-"}
              </span>

            </div>


            <div className="bg-[#161616] rounded-xl px-4 py-3 flex justify-between items-center">

              <span className="text-sm text-zinc-400">
                Take Profit
              </span>

              <span className="text-sm font-semibold text-emerald-400">
                {trade.tp ?? "-"}
              </span>

            </div>

          </div>

        </div>


        {/* ================= P&L BREAKDOWN ================= */}
        <div className="mt-5">

          <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
            P&L Breakdown
          </p>

          <div className="bg-[#161616] rounded-xl p-4">

            <div className="flex justify-between text-sm mb-2">

              <span className="text-zinc-400">
                Gross P&L
              </span>

              <span
                className={
                  grossPnl >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                }
              >
                {formatMoney(grossPnl)}
              </span>

            </div>


            <div className="flex justify-between text-sm mb-2">

              <span className="text-zinc-400">
                Entry Fees
              </span>

              <span className="text-red-400">
                -{formatMoney(entryFees)}
              </span>

            </div>


            <div className="flex justify-between text-sm mb-3">

              <span className="text-zinc-400">
                Exit Fees
              </span>

              <span className="text-red-400">
                -{formatMoney(exitFees)}
              </span>

            </div>


            <div className="border-t border-zinc-800 pt-3 flex justify-between">

              <span className="text-white font-semibold">
                Net P&L
              </span>

              <span
                className={`font-bold ${
                  netPnl >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {formatMoney(netPnl)}
              </span>

            </div>

          </div>

        </div>


        {/* ================= REASON ================= */}
        {trade.reason && (
          <div className="mt-5">

            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
              Trade Reason
            </p>

            <div className="bg-[#161616] rounded-xl p-4">

              <p className="text-sm text-zinc-300 leading-relaxed">
                {trade.reason}
              </p>

            </div>

          </div>
        )}


        {/* ================= TAGS ================= */}
        {trade.tags && trade.tags.length > 0 && (

          <div className="mt-4 flex flex-wrap gap-2">

            {trade.tags.map((tag, index) => (

              <span
                key={index}
                className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700"
              >
                #{tag}
              </span>

            ))}

          </div>

        )}


        {/* ================= NOTES ================= */}
        {trade.notes && (

          <div className="mt-5">

            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
              Notes
            </p>

            <div className="bg-[#161616] rounded-xl p-4">

              <p className="text-sm text-zinc-400 leading-relaxed">
                {trade.notes}
              </p>

            </div>

          </div>

        )}

      </div>
      <div className="px-5 pb-5">
  <button
    onClick={() => navigate(`/trades/${trade._id}`)}
    className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-white transition-colors"
  >
    View Trade Details
  </button>
</div>

    </div>
  );
}

