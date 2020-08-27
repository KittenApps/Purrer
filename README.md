# Purrer

_It's like Twitter but just for super amazing kittens._ 😸

A simple service worker based web push notification service, where sneaky kittens can write anonymous messages to channels (like `#KittenNews`). Every other kitten currently subscribed to the same channel will get a cute push notification delivered and the messages will appear in their feed. It supports end-to-end-encryption from the senders kittens browser to the browser of the feline recipients using the browsers Web Crypot API (using ECDH and AES-256-GCM). However note, that because of the anonymous nature of the server the identity of the recipients isn't authenticated in any way.
