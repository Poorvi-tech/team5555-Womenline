const Appointment = require('../models/Appointment');

// appointmentController.js
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorName, date, timeSlot, userId } = req.body;

    if (!doctorName || !date || !timeSlot || !userId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newAppointment = new Appointment({
      doctorName,
      date,
      timeSlot,
      userId
    });

    await newAppointment.save();

    res.status(201).json({ success: true, data: { appointmentId: newAppointment._id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from token in middleware

    const appointments = await Appointment.find({ userId });

    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Appointment cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
