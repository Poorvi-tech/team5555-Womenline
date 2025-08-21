const Appointment = require('../models/Appointment');
const User = require('../models/User');
const logEvent = require('../utils/logger');
const logAuditTrail = require('../utils/logAuditTrail');
const formatWhatsAppNumber = require("../utils/formatPhone");
const sendWhatsAppMessage = require('../utils/whatsappService');

// Book a new appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorName, date, timeSlot } = req.body;
    const userId = req.user.id;

    if (!doctorName || !date || !timeSlot) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newAppointment = new Appointment({
      doctorName,
      date,
      timeSlot,
      userId,
    });

    await newAppointment.save();

    // 📜 Logging
    logEvent(
      "BOOK_APPOINTMENT",
      `Appointment booked with Dr. ${doctorName} on ${date} at ${timeSlot}`,
      userId
    );

    await logAuditTrail(
      "BOOK_APPOINTMENT",
      JSON.stringify({ doctorName, date, timeSlot, appointmentId: newAppointment._id }),
      userId
    );

    // Fetch user to send WhatsApp
    const user = await User.findById(userId);
if (user && user.phone) {
  const formattedPhone = formatWhatsAppNumber(user.phone);
  const message = `Hi ${user.username}, your appointment with Dr. ${doctorName} on ${new Date(date).toDateString()} at ${timeSlot} has been booked successfully.`;
  await sendWhatsAppMessage(formattedPhone, message);
}

    res.status(201).json({ success: true, data: { appointmentId: newAppointment._id } });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get all appointments for the logged-in user
exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await Appointment.find({ userId });

    // 📜 Logging
    logEvent(
      "FETCH_APPOINTMENTS",
      `Fetched ${appointments.length} appointments`,
      userId
    );

    await logAuditTrail(
      "FETCH_APPOINTMENTS",
      JSON.stringify({ totalAppointments: appointments.length }),
      userId
    );

    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cancel an appointment by ID
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    const userId = req.user.id;

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.userId.toString() !== userId && req.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this appointment' });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    // 📜 Logging
    logEvent(
      "CANCEL_APPOINTMENT",
      `Appointment ${req.params.id} cancelled`,
      userId
    );

    await logAuditTrail(
      "CANCEL_APPOINTMENT",
      JSON.stringify({ appointmentId: req.params.id }),
      userId
    );
    
 // Fetch user to send WhatsApp notification
    const user = await User.findById(userId);
if (user && user.phone) {
  const formattedPhone = formatWhatsAppNumber(user.phone);
  const message = `Hi ${user.username}, your appointment on ${new Date(appointment.date).toDateString()} at ${appointment.timeSlot} has been cancelled.`;
  await sendWhatsAppMessage(formattedPhone, message);
}

    res.status(200).json({ success: true, message: 'Appointment cancelled' });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
