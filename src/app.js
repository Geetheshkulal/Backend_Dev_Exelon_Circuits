require("dotenv").config();

const express = require("express");
const path = require("path");

const connectDB = require("./config/db");

const { connectRabbitMQ } = require("./config/rabbitmq");
const { getChannel } = require("./config/rabbitmq");

const { sendEvent } = require("./services/sse.service");

const routes = require("./routes/notification.routes");

connectDB();

connectRabbitMQ();

require("./scheduler/notification.scheduler");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/notifications", routes);

// Wait for RabbitMQ connection
setTimeout(() => {
  const channel = getChannel();

  channel.consume("notification_queue", async (msg) => {
    const data = JSON.parse(msg.content.toString());

    try {
      console.log("Sending:", data.message);

      sendEvent({
        status: "sent",
        ...data,
      });

      channel.ack(msg);
    } catch (err) {
      console.error("Notification failed:", err.message);

      data.retryCount = (data.retryCount || 0) + 1;

      if (data.retryCount < 3) {
        console.log(`Retry ${data.retryCount}`);

        channel.sendToQueue(
          "notification_queue",
          Buffer.from(JSON.stringify(data))
        );
      } else {
        console.log("Moving to DLQ");

        channel.sendToQueue(
          "dead_letter_queue",
          Buffer.from(JSON.stringify(data))
        );
      }

      channel.ack(msg);
    }
  });

  console.log("RabbitMQ Consumer Started");
}, 2000);


app.listen(5000, () => {
  console.log("Server Running");
});
