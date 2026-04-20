const express = require("express");
const router = express.Router();
const { joinCommunity, getLeads, getStats, exportLeads } = require("../controllers/communityController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/join", joinCommunity);
router.get("/leads", protect, getLeads);
router.get("/stats", protect, getStats);
router.get("/export", protect, exportLeads);

module.exports = router;
