const { getIdb } = require("./util");

self.addEventListener("install", e => e.waitUntil(self.skipWaiting()));
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

// show notification when push received
self.addEventListener("push", event => {
  const json = event.data.json();
  let getPayload;
  if (json.publicKey) {
    const crypto = self.crypto.subtle;
    const iv = new Uint8Array(
      json.iv.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))
    );
    const data = new Uint8Array(
      json.payload.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))
    );
    getPayload = Promise.all([
      getIdb()
        .then(db => db.get("settings", "ECDHkeys"))
        .then(k =>
          crypto.importKey(
            "jwk",
            k.privateKey,
            { name: "ECDH", namedCurve: "P-256" },
            false,
            ["deriveKey"]
          )
        ),
      crypto.importKey(
        "jwk",
        json.publicKey,
        { name: "ECDH", namedCurve: "P-256" },
        false,
        []
      )
    ])
      .then(([priv, pub]) =>
        crypto.deriveKey(
          { name: "ECDH", namedCurve: "P-256", public: pub },
          priv,
          { name: "AES-GCM", length: 256 },
          false,
          ["decrypt"]
        )
      )
      .then(key =>
        crypto.decrypt({ name: "AES-GCM", iv, tagLength: 128 }, key, data)
      )
      .then(p => JSON.parse(new TextDecoder().decode(p)));
  } else {
    getPayload = Promise.resolve(json);
  }
  event.waitUntil(
    getPayload.then(payload => {
      let noptions = {
        body: payload.body,
        icon: payload.icon,
        image: payload.image,
        timestamp: payload.timestamp,
        data: { channel: payload.channel },
        requireInteraction: true,
        vibrate: [200, 100, 200, 100, 100, 50, 100, 50, 200]
      };
      if (payload.actions) {
        const icon = "http://purrer.netlify.app/link.png";
        let acts = [{ action: "Btn1", title: payload.actions[0].title, icon }];
        let d = { Btn1: payload.actions[0].url };
        if (payload.actions.length > 1) {
          acts.push({ action: "Btn2", title: payload.actions[1].title, icon });
          d["Btn2"] = payload.actions[1].url;
        }
        noptions.actions = acts;
        noptions.data.actions = d;
      }
      const dbdata = {
        title: payload.title,
        body: payload.body,
        icon: payload.icon,
        image: payload.image,
        actions: payload.actions,
        timestamp: payload.timestamp,
        channel: payload.channel,
        publicKey: json.publicKey
      };
      Promise.all([
        getIdb().then(db => db.add("notifications", dbdata)),
        self.clients.matchAll({ type: "window", includeUncontrolled: true })
      ]).then(([id, clients]) => {
        noptions.data.id = id;
        return Promise.all([
          self.registration.showNotification(payload.title, noptions),
          ...clients.map(c =>
            c.postMessage({
              type: "newNotification",
              data: { ...dbdata, id }
            })
          )
        ]);
      });
    })
  );
});

// resubscripe when subscriptions is due to expiration
self.addEventListener("pushsubscriptionchange", event =>
  event.waitUntil(
    self.registration.pushManager.subscribe({ userVisibleOnly: true })
    /*.then(sub =>
      fetch("register", {
        method: "post",
        headers: { "Content-type": "application/json" },
        // ToDo: Resubscribe to correct channels here
        body: JSON.stringify(Object.assign({}, sub.toJSON(), {channels: ["KittenNews"]}))
      })
    )*/
  )
);

self.addEventListener("notificationclick", event => {
  if (event.action === "Btn1" || event.action === "Btn2") {
    self.clients.openWindow(event.notification.data.actions[event.action]);
  } else {
    event.waitUntil(
      self.clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then(clients => {
          if (clients.length > 0) {
            return clients[0].focus().then(wc =>
              wc.postMessage({
                type: "changeChannel",
                channel: event.notification.data.channel,
                id: event.notification.data.id
              })
            );
          }
          return self.clients.openWindow(
            "/#" + event.notification.data.channel
          );
        })
    );
  }
});
