const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const Journals = new Schema({
    userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
   activityLog:{
    type:{
        type:String,
        required:true
    },
    source:{
        type:String,
        required:true
    },
    coins:{
        type:Number,
        required:true
    },
    date:{
        date:Date,
        default:Date.now,
        required:true
    }
   },
    amount:{
    type:Number,
    required:true
   }
}, { timestamps: true })

module.exports = mongoose.model("Journals",Journals);