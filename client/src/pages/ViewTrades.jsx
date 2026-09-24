import Header from "../components/Header";
import { useSelector } from "react-redux";
import TradeCard from "../components/TradeCardNew";

function ViewTrades() {
  const trades = useSelector((state) => state.trades.trades);

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Trade History
          </h1>

          <p className="text-sm text-zinc-500 mt-1">
            View all your past trades
          </p>
        </div>
        {trades.length === 0 ? (
          <p className="text-center text-white bg-[#1E1E1E] p-8 rounded-lg">
            No trades yet. Log your first trade!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trades.map((trade) => (
              <TradeCard
                key={trade._id}
                trade={trade}
                // onTradeUpdated={handleTradeAdded}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ViewTrades;
