import { func } from "prop-types";

self.addEventListener("message", function (event) {
  console.log("message received", event.data, event.source.id);
  // sendMessage({ helloFromMessage: 'in SW' }, ev.source.id);
  // sendMessage(event.data, event.source.id);
  // clients.get(event.source.id).then((client) => {
  //   console.log("client:",client)
  //   client.postMessage(event.data);
  // });
  let form_data = new FormData();

  for (let key in event.data.data) {
    form_data.append(key, event.data.data[key]);
  }
  fetch(event.data.url, {
    method: event.data.method,
    body: form_data,
  })
    .then((response) => response.json())
    .then((data) => {
      console.error(">>>>>>>>>>>>>>>>>");
      console.log(data.data);
      console.log(event.source.id);
      clients.get(event.source.id).then((client) => {
        console.log("client:", client);
        client.postMessage(data.data);
      });
      console.error(">>>>>>>>>>>>>>>>>");
      // Handle data
    })
    .catch((err) => {
      console.log(err.message);
    });
});

function sendMessage(msg, clientid) {
  console.log("clientssss:", msg, clientid);
  let form_data = new FormData();

  for (let key in msg.data) {
    form_data.append(key, msg.data[key]);
  }
  fetch(msg.url, {
    method: msg.method,
    body: form_data,
  })
    .then((response) => response.json())
    .then((data) => {
      console.error(">>>>>>>>>>>>>>>>>");
      console.log(data.data);
      console.error(">>>>>>>>>>>>>>>>>");
      // Handle data
    })
    .catch((err) => {
      console.log(err.message);
    });
}

function handleRequest(data,clientId) {
  if ((data.type = "fetch")) {
    handleFetch(data,clientId);
  }
}
function handleFetch(dataFetch,clientId) {
  const { url, method, data } = dataFetch;
  let form_data = new FormData();

  for (let key in data.data) {
    form_data.append(key, data.data[key]);
  }
  fetch(url, {
    method: method,
    body: form_data,
  })
    .then((response) => response.json())
    .then((data) => {
      console.error(">>>>>>>>>>>>>>>>>");
      console.log(data.data);
      console.log(clientId);
      clients.get(clientId).then((client) => {
        console.log("client:", client);
        client.postMessage(data.data);
      });
      console.error(">>>>>>>>>>>>>>>>>");
      // Handle data
    })
    .catch((err) => {
      console.log(err.message);
    });
}
