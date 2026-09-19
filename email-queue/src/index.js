import express from "express"
import Redis from "ioredis"

const app = express()
const EMAIL_KEY = "app:email:queue"
const redis = new Redis("redis://localhost:6379")
app.post("/mail", async (req, res) => {
    const job = {
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text,
        createdAt: new Date().toISOString()
    }
    await redis.lpush(EMAIL_KEY, JSON.stringify(job));
    return res.json({ ok: true, message: "job added" })
})
app.get("/mail/process-one", async (req, res) => {
    const data = await redis.rpop(EMAIL_KEY)
    if (!data) {
        return res.json({ ok: false, message: "No job found" })
    }
    const job = JSON.parse(data)
    // console.log(job)
    res.json({ "Processed Mail": job })
})
app.listen(3004, () => {
    console.log("server is running on port 3004")
})