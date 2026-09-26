import express from "express";
import cors from "cors";
import redis from "./redis.js";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3004, () => {
    console.log("Server is running on port 3004");
});

// Top 10 leaderboard

app.get("/leaderboard", async (req, res) => {
    const data = await redis.zrevrange(
        "leaderboard",
        0,
        9,
        "WITHSCORES"
    );

    const leaderboard = [];

    for (let i = 0; i < data.length; i += 2) {
        leaderboard.push({
            rank: i / 2 + 1,
            username: data[i],
            score: Number(data[i + 1]),
        });
    }

    res.json({ leaderboard });
});

// Increase score
app.post("/leaderboard/:userId/increase", async (req, res) => {
    const { userId } = req.params;
    const { score } = req.body;

    const newScore = await redis.zincrby(
        "leaderboard",
        score,
        userId
    );
    const data = await redis.zrevrange(
        "leaderboard",
        0,
        9,
        "WITHSCORES"
    );
    const leaderboard = [];

    for (let i = 0; i < data.length; i += 2) {
        leaderboard.push({
            rank: i / 2 + 1,
            username: data[i],
            score: Number(data[i + 1]),
        });
    }

    res.json({ userId, newScore: Number(newScore), leaderboard });
});

// User rank
app.get("/leaderboard/:userId/details", async (req, res) => {
    const { userId } = req.params;

    const rank = await redis.zrevrank("leaderboard", userId);

    if (rank === null) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    const score = await redis.zscore("leaderboard", userId);

    res.json({
        userId,
        rank: rank + 1,
        score: Number(score),
    });
});