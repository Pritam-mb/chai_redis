import express from "express";
import Redis from "ioredis";
// import mongoose from "mongoose";

const app = express();
app.use(express.json());

// const redis = new Redis({ host: "redis", port: 6379 });
const redis = new Redis("redis://localhost:6379")
// const uri = "mongodb://mongo:27017/user_profile";

app.post("/user/:id/json", async (req, res) => {

    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
    res.json({ message: "user created" });
});

app.get("/user/:id/json", async (req, res) => {
    const user = await redis.get(`user:${req.params.id}:json`);
    res.json({ user: user ? JSON.parse(user) : "user not found" })
});

app.post("/user/:id/hash", async (req, res) => {
    // const user = await redis.get(`user:${req.params.id}:json`);
    await redis.hset(`user:${req.params.id}:hash`, req.body)
    res.json({ message: "user created" });
})
app.get("/user/:id/hash", async (req, res) => {
    const user = await redis.hgetall(`user:${req.params.id}:hash`);
    res.json({ user: user ? user : "user not found" })
})
app.listen(3003, () => {
    console.log("Server is running on port 3003");
});

// in set fn values cant be updated either it is deleted or the whole value will replaced by new one
// in hash fn values can be updated 