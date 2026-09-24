
const express = require("express");
const router = express.Router();

const Playbook = require("../models/Playbook");
const auth = require("../middleware/auth");

// =====================================================
// CREATE PLAYBOOK
// POST /api/playbooks/create
// =====================================================
router.post("/create", auth, async (req, res) => {
  try {
    const {
      name,
      description,
      entry_criteria,
      exit_criteria,
      market_conditions,
      notes,
    } = req.body;

    // Basic validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Playbook name is required",
      });
    }

    const playbook = new Playbook({
      user_id: req.user.id,
      name: name.trim(),
      description: description || "",
      entry_criteria: entry_criteria || [],
      exit_criteria: exit_criteria || [],
      market_conditions: market_conditions || [],
      notes: notes || "",
    });

    const savedPlaybook = await playbook.save();

    res.status(201).json({
      success: true,
      message: "Playbook created successfully",
      playbook: savedPlaybook,
    });
  } catch (error) {
    console.error("Create playbook error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// =====================================================
// GET ALL PLAYBOOKS
// GET /api/playbooks
// =====================================================
router.get("/", auth, async (req, res) => {
  try {
    const playbooks = await Playbook.find({
      user_id: req.user.id,
    }).sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      playbooks,
    });
  } catch (error) {
    console.error("Get playbooks error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// =====================================================
// GET SINGLE PLAYBOOK
// GET /api/playbooks/:id
// =====================================================
router.get("/:id", auth, async (req, res) => {
  try {
    const playbook = await Playbook.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!playbook) {
      return res.status(404).json({
        success: false,
        message: "Playbook not found",
      });
    }

    res.status(200).json({
      success: true,
      playbook,
    });
  } catch (error) {
    console.error("Get playbook error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// =====================================================
// UPDATE PLAYBOOK
// PUT /api/playbooks/:id
// =====================================================
router.put("/:id", auth, async (req, res) => {
  try {
    const {
      name,
      description,
      entry_criteria,
      exit_criteria,
      market_conditions,
      notes,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Playbook name is required",
      });
    }

    const updatedPlaybook = await Playbook.findOneAndUpdate(
      {
        _id: req.params.id,
        user_id: req.user.id,
      },
      {
        name: name.trim(),
        description: description || "",
        entry_criteria: entry_criteria || [],
        exit_criteria: exit_criteria || [],
        market_conditions: market_conditions || [],
        notes: notes || "",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPlaybook) {
      return res.status(404).json({
        success: false,
        message: "Playbook not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Playbook updated successfully",
      playbook: updatedPlaybook,
    });
  } catch (error) {
    console.error("Update playbook error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// =====================================================
// DELETE PLAYBOOK
// DELETE /api/playbooks/:id
// =====================================================
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedPlaybook = await Playbook.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!deletedPlaybook) {
      return res.status(404).json({
        success: false,
        message: "Playbook not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Playbook deleted successfully",
    });
  } catch (error) {
    console.error("Delete playbook error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;