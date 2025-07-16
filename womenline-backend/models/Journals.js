const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const Journals = new Schema({
    userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
    mood: {
  type: String,
  enum: ['happy', 'sad', 'angry', 'anxious', 'calm', 'tired', 'excited', 'stressed'],
  required: true
},
    note:{
    type:String,
    required:true
   },
   periodDay: {
  type: String,
  enum: ['pre-period', 'period-day', 'post-period', 'ovulation', 'none'],
  default: 'none'
}
}, { timestamps: true })

module.exports = mongoose.model("Journals",Journals);