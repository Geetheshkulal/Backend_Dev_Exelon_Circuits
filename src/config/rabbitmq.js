const amqp = require("amqplib");

let channel;

const connectRabbitMQ = async () => {

    const connection =
        await amqp.connect(
            process.env.RABBITMQ_URL
        );

    channel =
        await connection.createChannel();

    await channel.assertQueue(
        "notification_queue"
    );

    await channel.assertQueue(
        "dead_letter_queue"
    );

    console.log("RabbitMQ Connected");
};

const getChannel = () => channel;

module.exports = {
    connectRabbitMQ,
    getChannel
};