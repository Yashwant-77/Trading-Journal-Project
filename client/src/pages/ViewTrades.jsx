import React , {useState} from 'react'
import Header from '../components/Header'

function ViewTrades() {
  const [loading, setLoading] = useState(second)
  
  const handleTradeAdded = ()=>{
    fetchTrades();
  }
  return (
    <div>
      <Header/>
        <div>
          <h2 className="text-2xl text-white font-bold mb-4">Your Trades</h2>
          {loading ? (
            <p className="text-center text-gray-600">Loading trades...</p>
          ) : trades.length === 0 ? (
            <p className="text-center text-white bg-[#1E1E1E] p-8 rounded-lg">No trades yet. Log your first trade!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trades.map(trade => (
                <TradeCard key={trade._id} trade={trade} onTradeUpdated={handleTradeAdded} />
              ))}
            </div>
          )}
        </div>
    </div>
  )
}

export default ViewTrades