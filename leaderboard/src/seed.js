import redis from "./redis.js";

async function seedLeaderboard() {
    // Optional: Clear old leaderboard
    await redis.del("leaderboard");

    const users = [
        ["alice", 120],
        ["bob", 180],
        ["charlie", 150],
        ["david", 90],
        ["eva", 210],
        ["frank", 75],
        ["grace", 160],
        ["henry", 110],
        ["ivy", 140],
        ["jack", 130],
    ];

    for (const [user, score] of users) {
        await redis.zadd("leaderboard", score, user);
    }

    console.log("✅ Leaderboard seeded!");

    process.exit(0);
}

seedLeaderboard().catch(console.error);