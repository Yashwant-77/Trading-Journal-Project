const express = require("express");

const Trade = require("../models/Trade");
const auth = require("../middleware/auth");
const Playbook = require("../models/Playbook");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// =====================================================
// Get all trades for user
// GET /api/trades
// =====================================================

router.get("/", auth, async (req, res) => {
  try {
    const trades = await Trade.find({
      user_id: req.user.id,
    }).sort({
      created_at: -1,
    });

    res.json(trades);
  } catch (err) {
    console.error("GET TRADES ERROR:", err);

    res.status(500).json({
      msg: "Server error",
    });
  }
});

// =====================================================
// Get single trade
// GET /api/trades/:id
// =====================================================

router.get("/:id", auth, async (req, res) => {
  try {
    const trade = await Trade.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!trade) {
      return res.status(404).json({
        msg: "Trade not found",
      });
    }

    res.json(trade);
  } catch (err) {
    console.error("GET SINGLE TRADE ERROR:", err);

    res.status(500).json({
      msg: "Server error",
    });
  }
});

// =====================================================
// Create trade
// POST /api/trades
// =====================================================

router.post("/", auth, async (req, res) => {
  try {
    const {
      symbol,
      type,
      playbook_id,
      entry_price,
      exit_price,
      quantity,
      entry_date,
      entry_time,
      exit_date,
      exit_time,
      sl,
      tp,
      entry_fees,
      exit_fees,
      pnl,
      reason,
      tags,
      notes,
      checklist,
    } = req.body;

    // -------------------------------------------------
    // Check whether playbook exists and belongs to user
    // -------------------------------------------------

    const playbook = await Playbook.findOne({
      _id: playbook_id,
      user_id: req.user.id,
    });

    if (!playbook) {
      return res.status(400).json({
        msg: "Invalid playbook",
      });
    }

    // -------------------------------------------------
    // Validate checklist
    // -------------------------------------------------

    const tradeChecklist = Array.isArray(checklist)
      ? checklist
      : [];

    // -------------------------------------------------
    // Calculate checklist score
    // -------------------------------------------------

    let checklistScore = 0;
    let qualityRating = 0;

    if (tradeChecklist.length > 0) {
      const followedRules = tradeChecklist.filter(
        (item) => item.followed === true
      ).length;

      checklistScore =
        (followedRules / tradeChecklist.length) * 100;

      qualityRating =
        checklistScore === 0
          ? 0
          : Math.ceil(checklistScore / 20);
    }

    // -------------------------------------------------
    // Create trade
    // -------------------------------------------------

    const newTrade = new Trade({
      user_id: req.user.id,

      symbol,
      type,
      playbook_id,

      entry_price,
      exit_price,
      quantity,

      entry_date,
      entry_time,

      exit_date,
      exit_time,

      sl,
      tp,

      entry_fees,
      exit_fees,

      pnl,

      reason,
      tags,
      notes,

      checklist: tradeChecklist,
      checklist_score: checklistScore,
      quality_rating: qualityRating,
    });

    const trade = await newTrade.save();

    res.status(201).json(trade);
  } catch (err) {
    console.error("CREATE TRADE ERROR:", err);

    res.status(500).json({
      msg: err.message,
    });
  }
});

// =====================================================
// Update trade
// PUT /api/trades/:id
// =====================================================

router.put("/:id", auth, async (req, res) => {
  try {
    const trade = await Trade.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!trade) {
      return res.status(404).json({
        msg: "Trade not found",
      });
    }

    const {
      exit_price,
      exit_date,
      notes,
      checklist,
    } = req.body;

    // -------------------------------------------------
    // Existing fields
    // -------------------------------------------------

    if (exit_price !== undefined) {
      trade.exit_price = exit_price;
    }

    if (exit_date !== undefined) {
      trade.exit_date = exit_date;
    }

    if (notes !== undefined) {
      trade.notes = notes;
    }

    // -------------------------------------------------
    // Update checklist if provided
    // -------------------------------------------------

    if (Array.isArray(checklist)) {
      trade.checklist = checklist;

      if (checklist.length > 0) {
        const followedRules = checklist.filter(
          (item) => item.followed === true
        ).length;

        trade.checklist_score =
          (followedRules / checklist.length) * 100;

        trade.quality_rating =
          trade.checklist_score === 0
            ? 0
            : Math.ceil(trade.checklist_score / 20);
      } else {
        trade.checklist_score = 0;
        trade.quality_rating = 0;
      }
    }

    await trade.save();

    res.json(trade);
  } catch (err) {
    console.error("UPDATE TRADE ERROR:", err);

    res.status(500).json({
      msg: "Server error",
    });
  }
});

// =====================================================
// Delete trade
// DELETE /api/trades/:id
// =====================================================

router.delete("/:id", auth, async (req, res) => {
  try {
    const trade = await Trade.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!trade) {
      return res.status(404).json({
        msg: "Trade not found",
      });
    }

    res.json({
      msg: "Trade deleted",
    });
  } catch (err) {
    console.error("DELETE TRADE ERROR:", err);

    res.status(500).json({
      msg: "Server error",
    });
  }
});

// Upload screenshots for a trade
router.post(
  "/:id/screenshots",
  auth,
  (req, res, next) => {
    upload.array("screenshots", 5)(req, res, (err) => {
      if (err) {
        console.error("========== UPLOAD MIDDLEWARE ERROR ==========");
        console.error("Message:", err.message);
        console.error("Name:", err.name);
        console.error("Code:", err.code);
        console.error("Full error:", err);
        console.error("==============================================");

        return res.status(500).json({
          msg: err.message || "Screenshot upload failed",
        });
      }

      next();
    });
  },
  async (req, res) => {
    try {
      const trade = await Trade.findOne({
        _id: req.params.id,
        user_id: req.user.id,
      });

      if (!trade) {
        return res.status(404).json({
          msg: "Trade not found",
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          msg: "No screenshots uploaded",
        });
      }

      const screenshots = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
        uploaded_at: new Date(),
      }));

      trade.screenshots.push(...screenshots);

      await trade.save();

      res.status(201).json({
        message: "Screenshots uploaded successfully",
        screenshots: trade.screenshots,
      });
    } catch (err) {
      console.error("========== SCREENSHOT ROUTE ERROR ==========");
      console.error("Message:", err.message);
      console.error("Name:", err.name);
      console.error("Full error:", err);
      console.error("============================================");

      res.status(500).json({
        msg: err.message || "Failed to upload screenshots",
      });
    }
  }
);

// Delete a screenshot from a trade
router.delete(
  "/:id/screenshots/:screenshotId",
  auth,
  async (req, res) => {
    try {
      const { id, screenshotId } = req.params;

      const trade = await Trade.findOne({
        _id: id,
        user_id: req.user.id,
      });

      if (!trade) {
        return res.status(404).json({
          msg: "Trade not found",
        });
      }

      const screenshot = trade.screenshots.id(screenshotId);

      if (!screenshot) {
        return res.status(404).json({
          msg: "Screenshot not found",
        });
      }

      // Delete image from Cloudinary
      await cloudinary.uploader.destroy(screenshot.public_id);

      // Remove screenshot from MongoDB
      screenshot.deleteOne();

      await trade.save();

      res.json({
        message: "Screenshot deleted successfully",
        screenshots: trade.screenshots,
      });
    } catch (err) {
      console.error("DELETE SCREENSHOT ERROR:", err);

      res.status(500).json({
        msg: err.message || "Failed to delete screenshot",
      });
    }
  }
);

module.exports = router;