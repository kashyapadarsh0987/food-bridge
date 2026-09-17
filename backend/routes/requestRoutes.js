const express = require("express");
const Request = require("../models/Request");
const Donation = require("../models/Donation");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/:donationId", protect, authorize("receiver"), async (req, res) => {
  try {
    const receiver = await User.findById(req.user.id);
    if (!receiver.isVerified) {
      return res.status(403).json({ message: "Your account is not verified yet. Please wait for admin approval." });
    }

    const donation = await Donation.findById(req.params.donationId);
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    if (donation.status !== "available") {
      return res.status(400).json({ message: "This donation is no longer available for requests" });
    }
    const existing = await Request.findOne({ donation: donation._id, receiver: req.user.id });
    if (existing) return res.status(400).json({ message: "You already requested this donation" });

    const request = await Request.create({ donation: donation._id, receiver: req.user.id });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/donation/:donationId", protect, authorize("donor"), async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.donationId);
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    if (donation.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your donation" });
    }

    const requests = await Request.find({ donation: donation._id, status: "pending" })
      .populate("receiver", "name email phone");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.patch("/:requestId/approve", protect, authorize("donor"), async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId).populate("donation");
    if (!request) return res.status(404).json({ message: "Request not found" });

    const donation = request.donation;
    if (donation.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your donation" });
    }
    if (donation.status !== "available") {
      return res.status(400).json({ message: "Donation already claimed" });
    }

    
    request.status = "approved";
    await request.save();

    
    await Request.updateMany(
      { donation: donation._id, _id: { $ne: request._id } },
      { status: "rejected" }
    );

    // Mark the donation as claimed by this receiver
    await Donation.findByIdAndUpdate(donation._id, {
      status: "claimed",
      claimedBy: request.receiver,
    });

    res.json({ message: "Request approved, donation claimed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;