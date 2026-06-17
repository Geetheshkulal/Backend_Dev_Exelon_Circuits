const express = require("express");
require("dotenv").config();

const router = express.Router();

const controller = require("../controllers/notification.controller");

const rateLimiter = require("../middleware/rateLimiter");

const { addClient } = require("../services/sse.service");
const Subscription = require("../models/Subscription");

router.post("/", rateLimiter, controller.createNotification);
router.post("/subscribe", controller.subscribeUser);
router.post("/send-push", controller.sendPushNotification);
router.get("/vapid-public-key", (req, res) => {
  res.json({
    publicKey: process.env.VAPID_PUBLIC_KEY,
  });
});


router.get("/stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  res.write(
    `data: ${JSON.stringify({
      status: "connected",
    })}\n\n`
  );

  addClient(req, res);

  req.on("close", () => {
    console.log("Client disconnected");
  });
});

module.exports = router;
