# Purrer

_It's like Twitter but just for super amazing kittens._ 😸

A simple service worker based push notification service, where sneaky kittens can write anonymous messages to channels (like `#KittenNews`). Every other kitten currently subscribed to the same channel will get a cute push notification delivers and the messages will appear in their feed for said channel.

## Roadmap

- ~~multi channel support: multiple push notification subscriptions channels seperated by the choosen hashtag from each other~~
- ~~message history feed: see your previously recieved push notifications (write to indexedDB in serviceWorker and read from it client side)~~
- ~~virtualisze feed for long list performance reasons: [https://material-ui.com/components/lists/#virtualized-list](https://material-ui.com/components/lists/#virtualized-list)~~
- ~~send messages from service worker to all clients on push message to update feeds of that channel (and all feed)~~
- ~~Action button links: `[label1](url1), [label2](url2)` (max 2, no Firefox, update virtulized feed list size helper, with icon set in notification)~~
- ~~automatic page refresh when service worker update pending~~
- ~~input validation: allow only `https?://` links (both client and server side)~~
- ~~useCallback optimisations~~
- ~~allow removing old notifications form indexedDB + use as template option copying text (only on feed not on normal preview, if props.setTemplate defined)~~
- ~~fully end-to-end-encrypted messages (fetch all public keys for the subscribtions of the current channel, encrypt messages client side (using WebCrypto API) and just send all encrypted messages to the server, which will pass it to the corresponding notification server)~~
- migrate to MongoDB reals (new VAPID data and wep push url))

## Made by [Glitch](https://glitch.com/)

**Glitch** is the friendly community where you'll build the app of your dreams. Glitch lets you instantly create, remix, edit, and host an app, bot or site, and you can invite collaborators or helpers to simultaneously edit code with you.

Find out more [about Glitch](https://glitch.com/about).

( ᵔ ᴥ ᵔ )
