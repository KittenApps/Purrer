const express = require("express");
const staticGzip = require("express-static-gzip");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const webPush = require("web-push");
const { MongoClient } = require("mongodb");

// serve static files (js and css)
app.use("/", staticGzip("public", { enableBrotli: true }));
app.use(bodyParser.json());

webPush.setVapidDetails(
  "https://purrer.glitch.me/",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

MongoClient.connect(
  "mongodb+srv://" +
    process.env.MONGODB_USER +
    ":" +
    process.env.MONGODB_PASSWORD +
    "@purrer.nwxqr.mongodb.net/" +
    process.env.MONGODB_DBNAME +
    "?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true"
)
  .then(client => {
    const subcol = client.db("test").collection("subscriptions");

    app.post("/register", (req, res) => {
      let subscriptions = req.body.subscription;
      const channel = req.body.channel;
      const ECDHpublicKey = req.body.ECDHpublicKey;
      subcol.updateOne(
        { endpoint: subscriptions.endpoint },
        {
          $addToSet: { channels: channel },
          $set: { ECDHpublicKey: ECDHpublicKey },
          $setOnInsert: { keys: subscriptions.keys }
        },
        { upsert: true }
      )
        .then(({ upsertedCount }) =>
          upsertedCount
            ? res.status(201).send("New subscription registered!")
            : res.status(201).send("Subscribed to channel #" + channel + " !")
        )
        .catch(console.error);
    });

    app.post("/unregister", (req, res) => {
      const endpoint = req.body.subscription.endpoint;
      const channel = req.body.channel;
      subcol.findOneAndUpdate({ endpoint }, { $pull: { channels: channel } })
        .then(({ value }) => {
          if (value === null)
            return res.status(201).send("Already completly unsubscriped!");
          if (value.channels.length > 1 || value.channels[0] !== channel) {
            return res
              .status(201)
              .send("Unsubscriped from channel #" + channel + " !");
          } else {
            return subcol
              .deleteOne({ _id: value._id })
              .then(() =>
                res.status(201).send("Successfully unsubscriped completly!")
              );
          }
        })
        .catch(console.error);
    });

    const URLregex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;

    app.post("/sendNotification", (req, res) => {
      if (req.body.image && !URLregex.test(req.body.image))
        return res.sendStatus(400);
      if (req.body.icon && !URLregex.test(req.body.icon))
        return res.sendStatus(400);
      if (
        req.body.actions &&
        (!URLregex.test(req.body.actions[0].url) ||
          (req.body.actions.length > 1 &&
            !URLregex.test(req.body.actions[1].url)))
      )
        return res.sendStatus(400);
      const payload = Object.assign({}, req.body, {
        timestamp: new Date().getTime()
      });
      console.log("send notification with payload:", payload);
      subcol.find({ channels: req.body.channel })
        .map(sub =>
          webPush.sendNotification(sub, JSON.stringify(payload)).catch(() => {
            console.log("removed expired subscription: ", sub);
            return subcol.deleteOne({ endpoint: sub.endpoint });
          })
        )
        .toArray()
        .then(wps => Promise.all(wps))
        .then(() => res.sendStatus(201))
        .catch(err => {
          console.log(err);
          res.sendStatus(500);
        });
    });

    app.post("/sendE2EENotification", (req, res) => {
      const payloads = req.body.payloads;
      subcol.find({ channels: req.body.channel })
        .map(sub => {
          if (!payloads[sub._id]) return Promise.resolve();
          return webPush
            .sendNotification(sub, JSON.stringify(payloads[sub._id]))
            .catch(() => {
              console.log("removed expired subscription: ", sub);
              return subcol.deleteOne({ endpoint: sub.endpoint });
            });
        })
        .toArray()
        .then(wps => Promise.all(wps))
        .then(() => res.sendStatus(201))
        .catch(err => {
          console.log(err);
          res.sendStatus(500);
        });
    });

    app.post("/getSubscriptions", (req, res) =>
      subcol
        .find({ channels: req.body.channel })
        .project({ ECDHpublicKey: 1 })
        .toArray()
        .then(subs => res.json(subs))
        .catch(console.error)
    );

    app.post("/getSubscribedChannels", (req, res) =>
      subcol
        .findOne(
          { endpoint: req.body.endpoint },
          { projection: { channels: 1 } }
        )
        .then(sub => {
          if (!sub) return res.json({ channels: [] });
          res.json({ channels: sub.channels });
        })
        .catch(console.error)
    );

    // serve index.html for everything else
    app.get("/*", (req, res) => {
      if (
        req
          .header("Accept-Encoding")
          .split(", ")
          .includes("br")
      ) {
        return res
          .set("Content-Encoding", "br")
          .set("content-type", "text/html; charset=utf-8")
          .sendFile(path.join(__dirname, "app/index.html.br"));
      }
      res.sendFile(path.join(__dirname, "app/index.html"));
    });

    // starting the server listening on the assigned port
    const listener = app.listen(process.env.PORT, () => {
      console.log("Your app is listening on port " + listener.address().port);
    });
  })
  .catch(console.error);
