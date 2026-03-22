const express = require("express");
const router = express.Router();
const { joinCommunity } = require("../controllers/communityController");

router.post("/join", joinCommunity);

module.exports = router;