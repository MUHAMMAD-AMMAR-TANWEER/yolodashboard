const mongoose = require("mongoose");


const Feed = mongoose.model(
    "Feed",
    new mongoose.Schema({
        Device: {
            type: String,
            required: true,

        },
        Car: {
            type: Number,
            default:0
        },
        Bicycle: {
            type: Number,
            default:0
        },
        Person: {
            type: Number,
            default:0
        },
        Bus: {
            type: Number,
            default:0
        },
        Motorcycle: {
            type: Number,
            default:0
        },
        Truck: {
            type: Number,
            default:0
        },






    },  {
        timestamps: true
      }));

module.exports = Feed;