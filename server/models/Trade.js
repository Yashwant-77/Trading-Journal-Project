const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema(
  {
    // User who owns this trade
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic trade information
    symbol: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    type: {
      type: String,
      enum: ["LONG", "SHORT"],
      required: true,
    },

    playbook: {
      type: String,
      required: true,
      trim: true,
    },

    // Prices
    entry_price: {
      type: Number,
      required: true,
      min: 0,
    },

    exit_price: {
      type: Number,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    // Entry information
    entry_date: {
      type: Date,
      required: true,
    },

    entry_time: {
      type: String,
      required: true,
    },

    // Exit information
    exit_date: {
      type: Date,
    },

    exit_time: {
      type: String,
    },

    // Risk management
    sl: {
      type: Number,
      required: true,
      min: 0,
    },

    tp: {
      type: Number,
      required: true,
      min: 0,
    },

    // Fees
    entry_fees: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    exit_fees: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    pnl: {
      type: Number,
      required: true,
    },

    net_pnl: {
      type: Number,
      default: 0,
    },

    pnl_percentage: {
      type: Number,
      default: 0,
    },

    // Trade analysis
    reason: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },

    notes: {
      type: String,
      trim: true,
    },

    // Trade status
    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },

    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

tradeSchema.pre("save", async function () {
  const entryFees = this.entry_fees || 0;
  const exitFees = this.exit_fees || 0;

  this.net_pnl = this.pnl - entryFees - exitFees;
});

module.exports = mongoose.model("Trade", tradeSchema);