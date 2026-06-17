const clients = [];

const addClient = (req, res) => {
  clients.push(res);

  console.log("Client connected:", clients.length);

  req.on("close", () => {
    const index = clients.indexOf(res);

    if (index !== -1) {
      clients.splice(index, 1);
    }

    console.log("Client disconnected");
  });
};

const sendEvent = (data) => {
  console.log("SSE clients:", clients.length);

  clients.forEach((client) => {
    client.write(`data:${JSON.stringify(data)}\n\n`);
  });
};

module.exports = {
  addClient,
  sendEvent,
};
