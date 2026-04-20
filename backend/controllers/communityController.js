const CommunityLead = require("../models/CommunityLead");

exports.joinCommunity = async (req, res) => {
  try {
    const { story, intent, name, age, gender, email } = req.body;
    const lead = await CommunityLead.create({ story, intent, name, age, gender, email });
    res.status(201).json({ success: true, message: "Community lead saved successfully", data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to save community lead", error: error.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const { intent, search } = req.query;
    const query = {};
    if (intent) query.intent = intent;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const leads = await CommunityLead.find(query).sort({ createdAt: -1 }).limit(500);
    const total = await CommunityLead.countDocuments(query);
    res.json({ leads, total });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getStats = async (_req, res) => {
  try {
    const total = await CommunityLead.countDocuments();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const today = await CommunityLead.countDocuments({ createdAt: { $gte: startOfDay } });
    const intentAgg = await CommunityLead.aggregate([
      { $group: { _id: "$intent", count: { $sum: 1 } } },
    ]);
    const intents = {};
    intentAgg.forEach((i) => { intents[i._id] = i.count; });
    res.json({ total, today, intents });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.exportLeads = async (_req, res) => {
  try {
    const leads = await CommunityLead.find().sort({ createdAt: -1 });
    const header = ["Name", "Email", "Age", "Gender", "Intent", "Story", "Date Joined"];
    const rows = leads.map((l) => [
      `"${l.name}"`,
      `"${l.email}"`,
      l.age,
      `"${l.gender}"`,
      l.intent,
      `"${(l.story || "").replace(/"/g, '""')}"`,
      new Date(l.createdAt).toLocaleDateString(),
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=tangle-community-leads.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
