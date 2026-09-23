const express = require('express');
const Trade = require('../models/Trade');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all trades for user
router.get('/', auth, async (req, res) => {
  try {
    const trades = await Trade.find({ user_id: req.user.id }).sort({ created_at: -1 });
    res.json(trades);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get single trade
router.get('/:id', auth, async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) {
      return res.status(404).json({ msg: 'Trade not found' });
    }
    res.json(trade);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create trade
router.post('/', auth, async (req, res) => {
  try {
    const { symbol, type, entry_price, quantity, entry_date, reason, tags, notes } = req.body;

    const newTrade = new Trade({
      user_id: req.user.id,
      symbol,
      type,
      entry_price,
      quantity,
      entry_date,
      reason,
      tags,
      notes
    });

    const trade = await newTrade.save();
    res.status(201).json(trade);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update trade
router.put('/:id', auth, async (req, res) => {
  try {
    let trade = await Trade.findById(req.params.id);
    if (!trade) {
      return res.status(404).json({ msg: 'Trade not found' });
    }

    const { exit_price, exit_date, status, notes } = req.body;

    if (exit_price) trade.exit_price = exit_price;
    if (exit_date) trade.exit_date = exit_date;
    if (notes) trade.notes = notes;

    await trade.save();
    res.json(trade);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete trade
router.delete('/:id', auth, async (req, res) => {
  try {
    const trade = await Trade.findByIdAndRemove(req.params.id);
    if (!trade) {
      return res.status(404).json({ msg: 'Trade not found' });
    }
    res.json({ msg: 'Trade deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;