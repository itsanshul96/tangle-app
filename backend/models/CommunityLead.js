const mongoose = require("mongoose");

const communityLeadSchema = new mongoose.Schema({
  story: { type: String, required: true },
  intent: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  source: { type: String, default: "website-chat-app" }
}, { timestamps: true });

module.exports = mongoose.model("CommunityLead", communityLeadSchema);