const mongoose = require("mongoose");


const TimFeed = mongoose.model(
    "TimFeed",
    new mongoose.Schema({
        Device: {
            type: String,
            required: true,

        },
        DetectionID: {
            type: Array,
            default:[]
        },
        DatTim: {
            type: Array,
            default:[]
        },
        Detection:{
            type:Array,
            default:[]

        }





    },  {
        timestamps: true
      }));

module.exports = TimFeed;