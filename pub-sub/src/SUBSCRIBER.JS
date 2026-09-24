import Redis from "ioredis";
import { forwardRef } from "react";

const subscriber = new Redis("redis://localhost:6379")


subscriber.subscribe("notfication", (err, count) => { // subscriber listing to the notification channel
    if (err) {
        console.log(err);

    }
    console.log("subscribed successfully");

})

subscriber.on("message", (channel, message) => { // when message is recive on channel print it 
    console.log(channel, JSON.parse(message));

})

// const subscriber = redis.duplicate();

// api req(publisher) -> sends to channel notification in redis -> redis see who listing to this channel and forward
// -> subscriber received by subscriber.on() 