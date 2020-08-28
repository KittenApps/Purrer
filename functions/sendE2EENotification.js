"use strict";
const webPush = require("web-push");
const { MongoClient } = require('mongodb');

let subsColl = null;
webPush.setVapidDetails("https://purrer.netlify.app/", process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);

function getSubsColl(){
  if (subsColl) return Promise.resolve(subsColl);
  return MongoClient.connect(process.env.MONGODB_URI).then(client => {
    subsColl = client.db("purrer").collection("subscriptions");
    return subsColl;
  });
}

exports.handler = async function(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;
  const body = JSON.parse(event.body);
  const payloads = body.payloads;
  const subsColl = await getSubsColl();
  let promises = await subsColl.find({ channels: body.channel }).map(sub => !payloads[sub._id] ? false :
    webPush.sendNotification(sub, JSON.stringify(payloads[sub._id])).then(console.log).catch(() => subsColl.deleteOne({ _id: sub._id }))
  ).toArray();
  await Promise.all(promises);
  return {statusCode: 201, body: "Encrypted messages send!" };
}
