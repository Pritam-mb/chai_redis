import express from "express"
import Redis from "ioredis"

const app = express()
app.use(express.json())

const redis = new Redis()
const BANNER_KEY = "app:banner"
app.post("/banner", async (req, res) => {
    // const reply = await redis.get("banner")
    await redis.set(BANNER_KEY, req.body.message || "welcome to redis")
    res.json({ ok: true })
})
app.get("/banner", async (req, res) => {
    const reply = await redis.get(BANNER_KEY)
    res.json({ reply })
})
app.delete("/banner", async (req, res) => {
    await redis.del(BANNER_KEY)
    res.json({ ok: true })
})
app.get("/banner/exists", async (req, res) => {
    const exists = await redis.exists(BANNER_KEY)
    res.json({ exists: Boolean(exists) })
})
app.listen(3001, () => {
    console.log("Server is running on port 3001")
})