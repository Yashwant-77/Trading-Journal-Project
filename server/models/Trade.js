const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['LONG', 'SHORT'],
    required: true
  },
  entry_price: {
    type: Number,
    required: true
  },
  exit_price: {
    type: Number
  },
  quantity: {
    type: Number,
    required: true
  },
  entry_date: {
    type: Date,
    required: true
  },
  exit_date: {
    type: Date
  },
  reason: {
    type: String
  },
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED'],
    default: 'OPEN'
  },
  pnl: {
    type: Number,
    default: 0
  },
  pnl_percentage: {
    type: Number,
    default: 0
  },
  tags: [String],
  notes: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Calculate P&L before saving
tradeSchema.pre('save', function(next) {
  if (this.exit_price) {
    this.pnl = (this.exit_price - this.entry_price) * this.quantity;
    this.pnl_percentage = ((this.exit_price - this.entry_price) / this.entry_price) * 100;
    this.status = 'CLOSED';
  }
  next();
});

module.exports = mongoose.model('Trade', tradeSchema);