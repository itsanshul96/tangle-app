const express = require("express");
const router = express.Router();
const { joinCommunity, getLeads, getStats, exportLeads } = require("../controllers/communityController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");

router.post("/join", joinCommunity);
router.get("/leads", protect, adminOnly, getLeads);
router.get("/stats", protect, adminOnly, getStats);
router.get("/export", protect, adminOnly, exportLeads);

module.exports = router;
