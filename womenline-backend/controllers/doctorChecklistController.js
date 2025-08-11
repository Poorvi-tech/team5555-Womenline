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
