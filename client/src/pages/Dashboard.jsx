import React from 'react'
import { useState , useEffect } from 'react';
import Header from '../components/Header';

function Dashboard() {
   const [trades, setTrades] = useState([]);
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
  return (
    <div className=''>
    <Header/>
    
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 ">
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
    </div>
  )
}

export default Dashboard