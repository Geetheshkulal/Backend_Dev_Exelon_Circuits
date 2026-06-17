const cron = require("node-cron");

const Notification = require("../models/Notification");

const { getChannel } = require("../config/rabbitmq");

cron.schedule(
  "* * * * *",

  async () => {
    const notifications = await Notification.find({
      status: "pending",

      scheduleAt: {
        $lte: new Date(),
      },
    });

    const channel = getChannel();

    for (const n of notifications) {
      channel.sendToQueue(
        "notification_queue",

        Buffer.from(JSON.stringify(n))
      );

      n.status = "queued";

      await n.save();
    }
  }
);
