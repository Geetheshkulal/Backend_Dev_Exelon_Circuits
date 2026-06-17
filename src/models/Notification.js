const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: String,

    message: String,

    scheduleAt: Date,

    status: {
      type: String,
      default: "pending",
    },

    retryCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", NotificationSchema);
