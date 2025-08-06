const Appointment = require('../models/Appointment'); 

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorName, date, timeSlot, userId } = req.body;
    const newAppointment = new Appointment({ doctorName, date, timeSlot, userId });
    await newAppointment.save();
    res.status(201).json({ success: true, data: newAppointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.params.userId });
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
