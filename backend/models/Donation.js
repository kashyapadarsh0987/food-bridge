const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    foodType: { type: String, required: true },
    quantity: { type: String, required: true },
    description: { type: String },
    pickupAddress: { type: String, required: true },
    expiryTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["available", "claimed", "completed"],
      default: "available",
    },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    estimatedMeals: { type: Number, default: null },
    safetyTip: { type: String, default: null },
    urgency: { type: String, enum: ["Urgent", "Moderate", "Low"], default: "Moderate" },
    urgencyReason: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);