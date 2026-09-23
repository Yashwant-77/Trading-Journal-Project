import React, { useState } from 'react';
import API from '../api';

export default function TradeForm({ onTradeAdded }) {
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'LONG',
    entry_price: '',
    quantity: '',
    entry_date: new Date().toISOString().split('T')[0],
    reason: '',
    tags: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        entry_price: parseFloat(formData.entry_price),
        quantity: parseFloat(formData.quantity),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await API.post('/trades', payload);
      setFormData({
        symbol: '',
        type: 'LONG',
        entry_price: '',
        quantity: '',
        entry_date: new Date().toISOString().split('T')[0],
        reason: '',
        tags: '',
        notes: ''
      });
      onTradeAdded();
    } catch (error) {
      console.error('Error creating trade:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1E1E1E] text-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Log New Trade</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div>
          <label className="block text-sm font-medium mb-2">Symbol</label>
          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            placeholder="e.g., AAPL"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            <option value="LONG">LONG</option>
            <option value="SHORT">SHORT</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Entry Price</label>
          <input
            type="number"
            name="entry_price"
            value={formData.entry_price}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="0"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Entry Date</label>
          <input
            type="date"
            name="entry_date"
            value={formData.entry_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Reason</label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Why did you take this trade?"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., breakout, momentum"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes about this trade"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-emerald-400 hover:bg-emerald-300 text-black font-bold py-2 px-4 rounded"
        >
          {loading ? 'Creating...' : 'Log Trade'}
        </button>
      </form>
    </div>
  );
}