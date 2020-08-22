"use strict";
const webPush = require("web-push");
const MongoClient = require('mongodb').MongoClient;

let subsColl = null;

function getSubsColl(){
  if (subsColl) return Promise.resolve(subsColl);
  return MongoClient.connect(process.env.MONGODB_URI).then(client => {
    subsColl = client.db("purrer").collection("subscriptions");
    return subsColl;
  });
}

exports.handler = async function(event, context) {
  webPush.setVapidDetails("https://purrer.netlify.app/", process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
  const body = JSON.parse(event.body);
  const payloads = body.payloads;
  return getSubsColl().then(subsColl =>
    subsColl.find({ channels: body.channel })
      .map(sub => {
        if (!payloads[sub._id]) return Promise.resolve();
        return webPush
          .sendNotification(sub, JSON.stringify(payloads[sub._id]))
          .catch(() => {
            console.log("removed expired subscription: ", sub);
            return subsColl.deleteOne({ _id: sub._id });
          });
      }).toArray())
    .then(wps => Promise.all(wps))
    .then(() => ({statusCode: 201, body: "Encrypted messages send!" }));
}
