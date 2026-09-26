import Redis from "ioredis"

const redis = new Redis("redis://localhost:6379")
redis.on("connect", () => console.log("✅ Redis Connected"));
export default redis