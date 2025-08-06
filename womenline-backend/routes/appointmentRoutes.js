const express = require('express');
const router = express.Router();
const { bookAppointment, getUserAppointments, cancelAppointment } = require('../controllers/appointmentController');

router.post('/appointments', bookAppointment);
router.get('/appointments/:userId', getUserAppointments);
router.delete('/appointments/:id', cancelAppointment);

module.exports = router;
