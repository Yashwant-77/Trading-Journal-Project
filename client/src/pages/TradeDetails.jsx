import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Target,
  ShieldAlert,
  DollarSign,
  Image as ImageIcon,
  X,
} from "lucide-react";

import Header from "../components/Header";
import API from "../api";

export default function TradeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const trades = useSelector((state) => state.trades.trades);

  const [trade, setTrade] = useState(
    trades.find((item) => item._id === id) || null,
  );

  const [loading, setLoading] = useState(!trade);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        setLoading(true);

        const response = await API.get(`/trades/${id}`);

        setTrade(response.data);
      } catch (error) {
        console.error("Error fetching trade:", error);

        if (error.response?.status === 404) {
          navigate("/view-trades");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrade();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="text-center text-zinc-400 py-20">
            Loading trade...
          </div>
        </main>
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="text-center text-zinc-400 py-20">
            Trade not found.
          </div>
        </main>
      </div>
    );
  }

  const netPnl = Number(trade.net_pnl || 0);
  const pnl = Number(trade.pnl || 0);
  const sl = Number(trade.sl || 0);
  const tp = Number(trade.tp || 0);

  const plannedRR = sl > 0 ? tp / sl : null;
  const realizedR = sl > 0 ? netPnl / sl : null;

  const followedRules =
    trade.checklist?.filter((item) => item.followed).length || 0;

  const totalRules = trade.checklist?.length || 0;

  const pnlPositive = netPnl >= 0;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatMoney = (value) => {
    return `₹${Math.abs(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/view-trades")}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-6"
        >
          <ArrowLeft size={18} />
          Back to Trade History
        </button>

        {/* Header */}
        <div className="bg-[#18181B] border border-zinc-800 rounded-xl p-5 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">
                  {trade.symbol}
                </h1>

                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    trade.type === "LONG"
                      ? "bg-emerald-400/10 text-emerald-400"
                      : "bg-red-400/10 text-red-400"
                  }`}
                >
                  {trade.type}
                </span>
              </div>

              <p className="text-sm text-zinc-500 mt-2">
                Trade ID: {trade._id}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm text-zinc-500">
                Net P&L
              </p>

              <p
                className={`text-2xl font-bold ${
                  pnlPositive
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {pnlPositive ? "+" : "-"}
                {formatMoney(netPnl)}
              </p>
            </div>

          </div>

          <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-zinc-800 text-sm text-zinc-400">

            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {formatDate(trade.entry_date)}
            </div>

            {trade.entry_time && (
              <div className="flex items-center gap-2">
                <Clock size={16} />
                {trade.entry_time}
              </div>
            )}

            {trade.playbook_id && (
              <div>
                Playbook:{" "}
                <span className="text-white">
                  {trade.playbook_id.name || "Playbook"}
                </span>
              </div>
            )}

          </div>
        </div>

        {/* Trade Metrics */}
        <section className="mb-5">
          <h2 className="text-lg font-semibold mb-3">
            Trade Performance
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <MetricCard
              label="Entry Price"
              value={`₹${Number(trade.entry_price).toLocaleString("en-IN")}`}
            />

            <MetricCard
              label="Exit Price"
              value={
                trade.exit_price
                  ? `₹${Number(trade.exit_price).toLocaleString("en-IN")}`
                  : "—"
              }
            />

            <MetricCard
              label="Quantity"
              value={trade.quantity}
            />

            <MetricCard
              label="Gross P&L"
              value={`${pnl >= 0 ? "+" : "-"}${formatMoney(pnl)}`}
              valueClass={
                pnl >= 0 ? "text-emerald-400" : "text-red-400"
              }
            />

            <MetricCard
              label="Entry Fees"
              value={formatMoney(Number(trade.entry_fees || 0))}
            />

            <MetricCard
              label="Exit Fees"
              value={formatMoney(Number(trade.exit_fees || 0))}
            />

            <MetricCard
              label="Stop Loss"
              value={formatMoney(sl)}
              icon={<ShieldAlert size={16} />}
            />

            <MetricCard
              label="Take Profit"
              value={formatMoney(tp)}
              icon={<Target size={16} />}
            />

          </div>
        </section>

        {/* Risk / Reward */}
        <section className="mb-5">
          <h2 className="text-lg font-semibold mb-3">
            Risk & Reward
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <MetricCard
              label="Planned R:R"
              value={plannedRR !== null ? `1:${plannedRR.toFixed(2)}` : "—"}
              icon={<Target size={16} />}
            />

            <MetricCard
              label="Realized R"
              value={
                realizedR !== null
                  ? `${realizedR >= 0 ? "+" : ""}${realizedR.toFixed(2)}R`
                  : "—"
              }
              valueClass={
                realizedR >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
              }
            />

            <MetricCard
              label="P&L Percentage"
              value={
                trade.pnl_percentage !== undefined
                  ? `${Number(trade.pnl_percentage).toFixed(2)}%`
                  : "—"
              }
            />

          </div>
        </section>

        {/* Trade Analysis */}
        <section className="mb-5">
          <h2 className="text-lg font-semibold mb-3">
            Trade Analysis
          </h2>

          <div className="bg-[#18181B] border border-zinc-800 rounded-xl p-5 space-y-5">

            <div>
              <p className="text-sm text-zinc-500 mb-1">
                Reason
              </p>

              <p className="text-zinc-200">
                {trade.reason || "No reason recorded."}
              </p>
            </div>

            {trade.tags?.length > 0 && (
              <div>
                <p className="text-sm text-zinc-500 mb-2">
                  Tags
                </p>

                <div className="flex flex-wrap gap-2">
                  {trade.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-zinc-800 rounded-md text-xs text-zinc-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm text-zinc-500 mb-1">
                Notes
              </p>

              <p className="text-zinc-300 whitespace-pre-wrap">
                {trade.notes || "No notes recorded."}
              </p>
            </div>

          </div>
        </section>

        {/* Checklist */}
        {totalRules > 0 && (
          <section className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">
                Trade Quality
              </h2>

              <div className="text-sm text-zinc-400">
                {followedRules} / {totalRules} rules followed
              </div>
            </div>

            <div className="bg-[#18181B] border border-zinc-800 rounded-xl p-5">

              <div className="mb-5">
                <p className="text-sm text-zinc-500">
                  Quality Rating
                </p>

                <p className="text-2xl font-bold text-emerald-400">
                  {trade.quality_rating || 0}/5
                </p>

                <p className="text-sm text-zinc-500 mt-1">
                  Checklist score:{" "}
                  {Number(trade.checklist_score || 0).toFixed(0)}%
                </p>
              </div>

              <div className="space-y-3">
                {trade.checklist.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-[#1E1E1E]"
                  >
                    <span
                      className={`mt-0.5 ${
                        item.followed
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {item.followed ? "✓" : "✕"}
                    </span>

                    <div>
                      <p className="text-xs text-zinc-500 capitalize">
                        {item.category}
                      </p>

                      <p
                        className={
                          item.followed
                            ? "text-white"
                            : "text-zinc-400"
                        }
                      >
                        {item.criterion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>
        )}

        {/* Screenshots */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon size={19} className="text-zinc-400" />

            <h2 className="text-lg font-semibold">
              Screenshots
            </h2>

            <span className="text-sm text-zinc-500">
              ({trade.screenshots?.length || 0})
            </span>
          </div>

          {!trade.screenshots ||
          trade.screenshots.length === 0 ? (
            <div className="bg-[#18181B] border border-zinc-800 rounded-xl p-10 text-center">
              <ImageIcon
                size={36}
                className="mx-auto text-zinc-700 mb-3"
              />

              <p className="text-zinc-500">
                No screenshots attached to this trade.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trade.screenshots.map((screenshot) => (
                <button
                  key={screenshot._id}
                  type="button"
                  onClick={() => setSelectedImage(screenshot.url)}
                  className="group relative bg-[#18181B] border border-zinc-800 rounded-xl overflow-hidden"
                >
                  <img
                    src={screenshot.url}
                    alt="Trade screenshot"
                    className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                </button>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Fullscreen Image */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
          >
            <X size={22} />
          </button>

          <img
            src={selectedImage}
            alt="Trade screenshot enlarged"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
}

function MetricCard({
  label,
  value,
  valueClass = "text-white",
  icon,
}) {
  return (
    <div className="bg-[#18181B] border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
        {icon}
        {label}
      </div>

      <p className={`text-lg font-semibold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}