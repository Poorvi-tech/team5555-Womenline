const express = require('express');
const router = express.Router();
const { bookAppointment, getUserAppointments, cancelAppointment } = require('../controllers/appointmentController');
const { protect, rolecheck } = require('../middleware/authMiddleware');

router.post('/appointments', protect, bookAppointment); // User only; assuming anyone logged in can book

router.get('/appointments', protect, rolecheck(['user', 'admin']), getUserAppointments);

router.delete('/appointments/:id', protect, rolecheck(['user', 'admin']), cancelAppointment);


module.exports = router;
