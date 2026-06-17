# Backend_Dev_Exelon_Circuits

Notification Service

A scalable Notification Service built with Node.js that supports:

- Instant Notifications
- Scheduled Notifications
- Redis Rate Limiting
- RabbitMQ Queue Processing
- MongoDB Persistence
- Server-Sent Events (SSE)
- Web Push Notifications
- Retry Mechanism
- Dead Letter Queue (DLQ)

Environment Variables

Create a .env file:
```bash
PORT=5000

MONGO_URI=mongodb://localhost:27017/notificationdb

REDIS_URL=redis://localhost:6379

RABBITMQ_URL=amqp://localhost

VAPID_PUBLIC_KEY=YOUR_PUBLIC_KEY
VAPID_PRIVATE_KEY=YOUR_PRIVATE_KEY
```
generate keys using 
```bash
npx web-push generate-vapid-keys
```

Docker Setup
Start infrastructure services:
in Vscode terminal run below command
```bash
docker compose up -d
```

This starts:

- MongoDB
- Redis
- RabbitMQ

Verify:

docker ps

Install Dependencies

```bash
npm install
```

Run Application
```bash
 node src/app.js  
```
API Endpoints (test in post man)
Create Notification
- POST /notifications

Body:

{
  "userId": "1",
  "message": "Hello User"
}

Schedule Notification
- POST /notifications

Body:

{
  "userId": "1",
  "message": "Meeting Reminder",
  "scheduleAt": "2026-06-17T18:30:00Z"
}

SSE Stream <br>
- GET /notifications/stream

Send Push Notification <br>
- POST /notifications/send-push <br>

Body:

{
  "userId": "1",
  "title": "New Notification",
  "message": "Hello from Web Push"
}

Testing <br>
SSE <br>
Open: <br>

http://localhost:5000/sse.html

Send notification from Postman and observe real-time updates.

Web Push
- Open sse.html
- Click Subscribe
- Allow Notifications <br>
- Call /notifications/send-push

A browser notification should appear.

