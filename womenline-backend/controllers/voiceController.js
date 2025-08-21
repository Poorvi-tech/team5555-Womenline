const VoiceEntry = require("../models/VoiceEntry");

// Upload voice entry and save in DB
exports.uploadVoiceEntry = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No voice file uploaded" });
    }

    const { moodTag, duration, tags, audiotype, transcription } = req.body;

    // Validate required fields
    if (!moodTag || !duration || !tags || !audiotype) {
      return res.status(400).json({ 
        success: false, 
        message: "moodTag, duration, tags, and audiotype are required" 
      });
    }

    const newVoiceEntry = new VoiceEntry({
      userId: req.user.id,
      audioURL: req.file.path,
      moodTag,
      duration,
      tags,
      audiotype,
      transcription: transcription || "",
    });

    await newVoiceEntry.save();

    res.status(201).json({
      success: true,
      message: "Voice entry saved successfully",
      data: newVoiceEntry,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
