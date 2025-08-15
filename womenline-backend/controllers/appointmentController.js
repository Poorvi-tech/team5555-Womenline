const Appointment = require('../models/Appointment');

// Book a new appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorName, date, timeSlot } = req.body;

    if (!doctorName || !date || !timeSlot) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Use userId from token instead of request body
    const newAppointment = new Appointment({
      doctorName,
      date,
      timeSlot,
      userId: req.user.id,
    });

    await newAppointment.save();

    res.status(201).json({ success: true, data: { appointmentId: newAppointment._id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all appointments for the logged-in user
exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from token

    const appointments = await Appointment.find({ userId });

    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cancel an appointment by ID
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Optional: check if the logged-in user owns this appointment
    if (appointment.userId.toString() !== req.user.id && req.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this appointment' });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Appointment cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
