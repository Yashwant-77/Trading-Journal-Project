
const mongoose = require("mongoose");

const playbookSchema = new mongoose.Schema(
  {
    // =========================
    // USER
    // =========================

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },


    // =========================
    // BASIC INFORMATION
    // =========================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },


    // =========================
    // THREE RULE GROUPS
    // =========================

    entry_criteria: {
      type: [String],
      default: [],
    },

    exit_criteria: {
      type: [String],
      default: [],
    },

    market_conditions: {
      type: [String],
      default: [],
    },


    // =========================
    // NOTES
    // =========================

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },

  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);


module.exports = mongoose.model(
  "Playbook",
  playbookSchema
);

