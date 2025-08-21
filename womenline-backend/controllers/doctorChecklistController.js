const DoctorChecklist = require('../models/DoctorChecklist');

exports.submitChecklist = async (req, res) => {
  try {
    const { doctorName, specialization, availability, contact } = req.body;

    if (!doctorName || !specialization || !availability || !contact) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const checklist = new DoctorChecklist({
      doctorName,
      specialization,
      availability,
      contact,
      createdBy: req.user._id,
    });

    await checklist.save();

    res.status(201).json({ success: true, message: "Checklist submitted", checklist });
  } catch (error) {
    console.error("Submit checklist error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getChecklist = async (req, res) => {
  try {
    const checklists = await DoctorChecklist.find({ createdBy: req.user._id });
    res.status(200).json({ success: true, data: checklists });
  } catch (error) {
    console.error("Get checklist error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update checklist (admin only)
exports.updateChecklist = async (req, res) => {
  try {
    const checklistId = req.params.id;
    const updates = req.body;

    const checklist = await DoctorChecklist.findById(checklistId);
    if (!checklist) {
      return res.status(404).json({ success: false, message: "Checklist not found" });
    }

    Object.keys(updates).forEach(key => {
      checklist[key] = updates[key];
    });

    await checklist.save();

    res.status(200).json({ success: true, message: "Checklist updated", checklist });
  } catch (error) {
    console.error("Update checklist error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete checklist (admin only)
exports.deleteChecklist = async (req, res) => {
  try {
    const checklistId = req.params.id;

    const checklist = await DoctorChecklist.findById(checklistId);
    if (!checklist) {
      return res.status(404).json({ success: false, message: "Checklist not found" });
    }

    await DoctorChecklist.findByIdAndDelete(checklistId);

    res.status(200).json({ success: true, message: "Checklist deleted" });
  } catch (error) {
    console.error("Delete checklist error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};