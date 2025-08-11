const mongoose = require('mongoose');

const doctorChecklistSchema = new mongoose.Schema({
  doctorName: { type: String, required: true },
  specialization: { type: String, required: true },
  availability: { type: String, required: true },
  contact: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('DoctorChecklist', doctorChecklistSchema);
