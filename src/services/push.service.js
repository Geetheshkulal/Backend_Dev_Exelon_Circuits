const webpush = require("web-push");

webpush.setVapidDetails(
  "mailto:test@test.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = webpush;

// exports.sendPush = async (subscription, payload) => {
//   return webpush.sendNotification(subscription, JSON.stringify(payload));
// };
