const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  subscription: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
