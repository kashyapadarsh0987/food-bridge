const express = require("express");
const Donation = require("../models/Donation");
const { protect, authorize } = require("../middleware/auth");
const estimateMeals = require("../utils/estimateMeals");
const classifyUrgency = require("../utils/classifyUrgency");

const router = express.Router();


router.get("/", protect, async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("donor", "name email phone")
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/", protect, authorize("donor"), async (req, res) => {
  try {
    const { estimatedMeals, safetyTip } = await estimateMeals(req.body.foodType, req.body.quantity);
    const { urgency, reason } = await classifyUrgency(req.body.foodType, req.body.expiryTime);

    const donation = await Donation.create({
      ...req.body,
      donor: req.user.id,
      estimatedMeals,
      safetyTip,
      urgency,
      urgencyReason: reason,
    });
    const populated = await donation.populate("donor", "name email");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;