const express = require('express');
const router = express.Router();
const { bookAppointment, getUserAppointments, cancelAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/appointments', protect, bookAppointment);
router.get('/appointments', protect, getUserAppointments); 
router.delete('/appointments/:id', protect, cancelAppointment);

module.exports = router;
