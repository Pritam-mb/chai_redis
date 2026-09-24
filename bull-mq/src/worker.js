// worker.js
import { Job, Worker } from "bullmq"
import { Connection } from "./queue.js"

const worker = new Worker(
    "emails",
    async (job) => {
        console.log("processing email job", job.id, job.name, job.data)
        await (new Promise((resolve) => setTimeout(resolve, 2000)))
        console.log("processed email job", job.id, job.name, job.data)
    },
    { connection: Connection }
)

worker.on("completed", (job, result) => {
    console.log("job completed", job.id, job.name, result)
})

worker.on("failed", (job, error) => {
    console.log("job failed", job.id, job.name, error)
})

// worker.run()

// in queue we pass the name of the queue and also the configuration of the redis
// in worker we pass the name of the queue and also the configuration of the redis

// API stays fast: The API just drops a message in Redis and immediately responds to the user.
// // Worker handles the load: The Worker pulls messages from Redis at its own pace and processes them in the background. If sending an email fails, the Worker can also automatically retry it based on your configuration (attempts: 3).
// Redis is the actual database (the physical storage) where the queue data is saved.
// BullMQ is just the Node.js code library you use to easily talk to Redis.
// So when you write emailQueue.add(...) in your API, BullMQ takes that job and saves it as a record inside your Redis database. Then, the Worker uses BullMQ to look inside Redis, sees the new record, and pulls it out to process it.

// When we say "BullMQ queue", we are actually talking about data stored inside Redis!