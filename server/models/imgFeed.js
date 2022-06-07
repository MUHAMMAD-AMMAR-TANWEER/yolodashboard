const mongoose = require("mongoose");

const imgFeed = mongoose.model(
  "imgFeed",
  new mongoose.Schema(
    {
      Device: {
        type: String,
        required: true,
      },
      Tim: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = imgFeed;
