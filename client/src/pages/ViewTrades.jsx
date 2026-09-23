import Header from "../components/Header";
import { useSelector } from "react-redux";
import TradeCard from "../components/TradeCardNew";

function ViewTrades() {
  const trades = useSelector((state) => state.trades.trades);

  return (
    <div>
      <Header />
      <div className="bg-[#121212] max-w-7xl mx-auto px-4 py-8">
        <h2
          className="text-xl
font-bold bg-zinc-900 mb-4 rounded-lg border border-zinc-700 px-4 py-2 t  transition  text-emerald-400 sm:inline-flex text-center"
        >
          Trade History
        </h2>
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
      </div>
    </div>
  );
}

export default ViewTrades;
