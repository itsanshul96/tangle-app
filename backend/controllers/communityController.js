const CommunityLead = require("../models/CommunityLead");

exports.joinCommunity = async (req, res) => {
  try {
    const { story, intent, name, age, gender, email } = req.body;

    const lead = await CommunityLead.create({
      story,
      intent,
      name,
      age,
      gender,
      email
    });

    res.status(201).json({
      success: true,
      message: "Community lead saved successfully",
      data: lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save community lead",
      error: error.message
    });
  }
};