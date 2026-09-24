import express from "express"
import Redis from "ioredis"

const app = express()
app.use(express.json())

const redis = new Redis("redis://localhost:6379")
const pub = redis.duplicate();
app.use("/notification", async (req, res) => { //send to channel
    const job = {
        title: req.body.title,
        description: req.body.description,
        createdAt: new Date().toISOString()
    }
    await pub.publish("notfication", JSON.stringify(job))
    return res.json({ ok: true, message: "notification sent" })
})
app.listen(3001, () => {
    console.log("server is running on port 3001")
})