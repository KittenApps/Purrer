"use strict";
const webPush = require("web-push");
const { MongoClient } = require('mongodb');

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
  const URLregex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
  if (body.image && !URLregex.test(body.image))
    return {statusCode: 400, body: "Invalid header image url!" };
  if (body.icon && !URLregex.test(body.icon))
    return {statusCode: 400, body: "Invalid icon image url!" };
  if (body.actions && (body.actions.length > 2 || !URLregex.test(body.actions[0].url) ||
      (body.actions.length == 2 && !URLregex.test(body.actions[1].url))))
    return {statusCode: 400, body: "Invalid action buttons object!" };
  const payload = Object.assign({}, body, {timestamp: new Date().getTime()});
  console.log("send notification with payload:", payload);
  return getSubsColl().then(subsColl =>
    subsColl.find({ channels: body.channel })
      .map(sub =>
        webPush.sendNotification(sub, JSON.stringify(payload)).catch((err) => {
          console.log("removed expired subscription: ", sub);
          return subsColl.deleteOne({ _id: sub._id });
        })
      ).toArray())
    .then(wps => Promise.all(wps))
    .then(() => ({statusCode: 201, body: "Message send!" }));
}
