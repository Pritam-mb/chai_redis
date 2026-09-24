// api.js
import express from "express"
import { Connection } from "./queue.js"
import { emailQueue } from "./queue.js"
// import {Queue}

const app = express()
app.use(express.json())

app.listen(3000, () => {
    console.log("server is running on port 3000")
})

// now in frontend 
app.post("welcome-email", async (req, res) => {
    const job = emailQueue.add(
        "send-email",
        {
            to: req.body.to,
            subject: req.body.subject,
            text: req.body.text,
            createdAt: new Date().toISOString()
        }, {
        attempts: 3,
        backoff: { delay: 1000, type: "exponential" }
    }
    )
    return res.json({ message: "job added", job })
})