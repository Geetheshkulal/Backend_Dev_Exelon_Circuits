const { connectRabbitMQ, getChannel } = require("../config/rabbitmq");

const { sendEvent } = require("../services/sse.service");

(async () => {
  await connectRabbitMQ();

  const channel = getChannel();

  channel.consume(
    "notification_queue",

    async (msg) => {
      const data = JSON.parse(msg.content.toString());

      try {
        console.log("Sending:", data.message);

        sendEvent({
          status: "sent",
          ...data,
        });

        channel.ack(msg);
      } catch (err) {
        data.retryCount = (data.retryCount || 0) + 1;

        if (data.retryCount < 3) {
          channel.sendToQueue(
            "notification_queue",
            Buffer.from(JSON.stringify(data))
          );
        } else {
          channel.sendToQueue(
            "dead_letter_queue",
            Buffer.from(JSON.stringify(data))
          );
        }

        channel.ack(msg);
      }
    }
  );
})();
