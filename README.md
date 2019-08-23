# pubnub-rabbitmq
A chat app that implements Pub/Sub Messaging with RabbitMQ and PubNub. Use this as a starting point for adding Pub/Sub to your applications - without building and monitoring your own infrastructure. 

## Set-up

Get your [PubNub free API keys](https://dashboard.pubnub.com/signup?devrel_gh=pubnubrabbitmq) and include your publish and subscribe keys `app.js` as well as `public/scripts.js`.

```
    var pubnub = new PubNub({
      subscribeKey: "YOUR_SUB_KEY"
      publishKey: "YOUR_PUB_KEY"
    });
```


## How to run

```npm i```

In another terminal, ensure rabbitmq-server is running.

```rabbitmq-server```

```node app```

The app should be available on http://localhost:3030.

