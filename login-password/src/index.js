import express from "express"
import Redis from "ioredis"

const app = express()
app.use(express.json())

const redis = new Redis()

function otpKey(phone) {
    return `otp:${phone}`
}
app.post("/otp", async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000)
    await redis.set(otpKey(phone), otp, 'EX', 30)
    res.json({ message: "otp sent", otp })
})

app.post("/verify", async (req, res) => {
    const { phone, otp } = req.body
    const correctOtp = await redis.get(otpKey(phone))
    console.log(correctOtp)
    if (!correctOtp) {
        return res.json({ message: "otp expired" })
    }
    if (correctOtp === String(otp)) {
        await redis.del(otpKey(phone))
        res.json({ message: "otp verified" })
    }
    else {
        res.json({ message: "otp not verified" })
    }
})

app.get("/otp/:phone/ttl", async (req, res) => {
    const { phone } = req.params;
    const ttl = await redis.ttl(otpKey(phone))
    res.json({ ttl })
})

app.listen(3002, () => {
    console.log("server is running on port 3002")
})
//ttl is just a metadata that we can store in redis..in otpkey we just pass the key and get the corresponding value for this key