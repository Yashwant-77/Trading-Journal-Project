import React, { useState, useEffect , useRef } from 'react';
import TradeForm from '../pages/TradeForm';
import TradeCard from '../pages/TradeCard';
import API from '../api';
import Header from '../components/Header';

export default function Home() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const response = await API.get('/trades');
      setTrades(response.data);
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTradeAdded = () => {
    fetchTrades();
  };

  const stats = {
    totalTrades: trades.length,
    openTrades: trades.filter(t => t.status === 'OPEN').length,
    closedTrades: trades.filter(t => t.status === 'CLOSED').length,
    totalPnL: trades.reduce((sum, t) => sum + (t.pnl || 0), 0),
    winRate: trades.length > 0 
      ? ((trades.filter(t => t.pnl > 0).length / trades.filter(t => t.status === 'CLOSED').length) * 100).toFixed(2) 
      : 0
  };

    const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };


  const formRef = useRef();

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header onNewTradeClick={scrollToForm} />
      
      <div className="bg-[#121212] max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-[#1E1E1E]  p-4 rounded-lg shadow text-center">
            <p className="text-white font-bold">Total Trades</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalTrades}</p>
          </div>
          <div className="bg-[#1E1E1E] p-4 rounded-lg shadow text-center">
            <p className="text-white font-bold">Open</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.openTrades}</p>
          </div>
          <div className="bg-[#1E1E1E] p-4 rounded-lg shadow text-center">
            <p className="text-white font-bold">Closed</p>
            <p className="text-3xl font-bold text-green-600">{stats.closedTrades}</p>
          </div>
          <div className="bg-[#1E1E1E] p-4 rounded-lg shadow text-center">
            <p className="text-white font-bold">Total P&L</p>
            <p className={`text-3xl font-bold ${stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${stats.totalPnL.toFixed(2)}
            </p>
          </div>
          <div className="bg-[#1E1E1E] p-4 rounded-lg shadow text-center">
            <p className="text-white font-bold">Win Rate</p>
            <p className="text-3xl font-bold text-purple-600">{stats.winRate}%</p>
          </div>
        </div>

           <div ref={formRef} className="scroll-mt-6"> 

        <TradeForm  onTradeAdded={handleTradeAdded} />
        </div>

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
    </div>
  );
}