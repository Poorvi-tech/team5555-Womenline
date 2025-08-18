const express = require('express');
const router = express.Router();
const { bookAppointment, getUserAppointments, cancelAppointment } = require('../controllers/appointmentController');
const { protect, rolecheck } = require('../middleware/authMiddleware');

// Book an appointment
router.post('/appointments', protect, bookAppointment); 

// Get user appointments (user & admin)
router.get('/appointments', protect, rolecheck(['user', 'admin']), getUserAppointments);

// Cancel appointment (user & admin)
router.delete('/appointments/:id', protect, rolecheck(['user', 'admin']), cancelAppointment);


module.exports = router;
