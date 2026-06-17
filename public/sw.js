self.addEventListener("push", (event) => {
  const data = event.data
    ? event.data.json()
    : {
        title: "Default Title",
        message: "Default Message",
      };

  console.log("Push received:", data);

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: "/favicon.ico",
    })
  );
});

