import React, { useState } from 'react';
import API from '../api';

export default function TradeCard({ trade, onTradeUpdated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [exit_price, setExitPrice] = useState('');
  const [exit_date, setExitDate] = useState('');

  const handleCloseTradeSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/trades/${trade._id}`, {
        exit_price: parseFloat(exit_price),
        exit_date
      });
      setExitPrice('');
      setExitDate('');
      setIsOpen(false);
      onTradeUpdated();
    } catch (error) {
      console.error('Error closing trade:', error);
    }
  };

  const pnl = trade.pnl ? trade.pnl.toFixed(2) : 'N/A';
  const pnlPercentage = trade.pnl_percentage ? trade.pnl_percentage.toFixed(2) : 'N/A';
  const isProfitable = trade.pnl > 0;

  return (
    <div className={`p-4 rounded-lg shadow-md border-l-4 ${isProfitable ? 'border-green-500 bg-green-50' : trade.pnl < 0 ? 'border-red-500 bg-red-50' : 'border-gray-500 bg-[#1E1E1E]'}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold">{trade.symbol}</h3>
          <p className="text-sm text-gray-600">
            {trade.type} | Entry: ${trade.entry_price} | Qty: {trade.quantity}
          </p>
        </div>
        <div className={`text-lg font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
          P&L: ${pnl} ({pnlPercentage}%)
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <span className="text-gray-700">Entry Date: {new Date(trade.entry_date).toLocaleDateString()}</span>
        {trade.exit_date && <span className="text-gray-700">Exit Date: {new Date(trade.exit_date).toLocaleDateString()}</span>}
        <span className={`font-semibold ${trade.status === 'CLOSED' ? 'text-gray-600' : 'text-blue-600'}`}>Status: {trade.status}</span>
      </div>

      {trade.reason && <p className="text-sm text-gray-700 mb-2"><strong>Reason:</strong> {trade.reason}</p>}
      {trade.tags && trade.tags.length > 0 && (
        <div className="mb-2">
          {trade.tags.map((tag, idx) => (
            <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-1">
              {tag}
            </span>
          ))}
        </div>
      )}

      {trade.status === 'OPEN' && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
        >
          Close Trade
        </button>
      )}

      {isOpen && (
        <form onSubmit={handleCloseTradeSubmit} className="mt-3 p-3 bg-white rounded border border-gray-300">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="number"
              value={exit_price}
              onChange={(e) => setExitPrice(e.target.value)}
              placeholder="Exit Price"
              step="0.01"
              required
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <input
              type="date"
              value={exit_date}
              onChange={(e) => setExitDate(e.target.value)}
              required
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm mr-2"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}