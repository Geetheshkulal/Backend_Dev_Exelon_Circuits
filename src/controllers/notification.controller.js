const Notification = require("../models/Notification");
const Subscription = require("../models/Subscription");

const { getChannel } = require("../config/rabbitmq");
const webpush = require("../services/push.service");

exports.createNotification = async (req, res) => {
  const { userId, message, scheduleAt } = req.body;

  if (scheduleAt) {
    await Notification.create({
      userId,
      message,
      scheduleAt,
    });

    return res.json({
      message: "Scheduled Successfully",
    });
  }

  const channel = getChannel();

  channel.sendToQueue(
    "notification_queue",

    Buffer.from(
      JSON.stringify({
        userId,
        message,
      })
    )
  );

  res.json({
    message: "Queued Successfully",
  });
};

exports.subscribeUser = async (req, res) => {
  try {
    const { userId, subscription } = req.body;

    await Subscription.findOneAndUpdate(
      { userId },
      { subscription },
      {
        upsert: true,
        new: true,
      }
    );

    res.status(200).json({
      message: "Subscription saved",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to save subscription",
    });
  }
};

exports.sendPushNotification = async (req, res) => {
  try {
    const { userId = "1", title = "Notification Service", message = "Hello from Node.js" } = req.body || {};

    const subscription = await Subscription.findOne({ userId });

    if (!subscription || !subscription.subscription) {
      return res.status(404).json({
        message: "No subscription found for this user",
      });
    }

    const { endpoint, keys } = subscription.subscription;

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return res.status(400).json({
        message: "Invalid subscription data",
      });
    }

    await webpush.sendNotification(
      subscription.subscription,
      JSON.stringify({ title, message })
    );

    res.json({
      message: "Push Sent",
    });
  } catch (error) {
    console.error("Push Error:", error);

    if (error.statusCode === 404 || error.statusCode === 410) {
      const { userId = "1" } = req.body || {};
      await Subscription.deleteOne({ userId });
      return res.status(410).json({
        message: "Subscription expired and removed",
      });
    }

    res.status(500).json({
      message: "Push Failed",
    });
  }
};
