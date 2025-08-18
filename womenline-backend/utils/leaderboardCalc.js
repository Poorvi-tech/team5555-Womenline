const mongoose = require("mongoose");
const MaCoin = require("../models/MaCoins");
const ForumPost = require("../models/ForumPost");
const User = require("../models/User");

// Get start date for filtering by week or month
function getStartDate(timeframe) {
  const now = new Date();
  if (timeframe === "week") {
    const d = new Date(now);
    d.setDate(now.getDate() - 7);
    return d;
  }
  if (timeframe === "month") {
    const d = new Date(now);
    d.setMonth(now.getMonth() - 1);
    return d;
  }
  return null;
}

// Calculate leaderboard based on type ('macoin' or 'posts')
async function calculateLeaderboard({
  type = "macoin",
  timeframe = "week",
  limit = 10,
  filters = {},
} = {}) {
  limit = Math.max(1, Math.min(parseInt(limit, 10) || 10, 100));
  const startDate = getStartDate(timeframe);

  if (type === "macoin") {
    const match = {};
    if (startDate) {
      match.$or = [
        { createdAt: { $gte: startDate } },
        { "activityLog.date": { $gte: startDate } },
      ];
    }
    if (filters.userId) match.userId = mongoose.Types.ObjectId(filters.userId);

    // Aggregation to sum MaCoin credits per user
    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: "$userId",
          total: {
            $sum: { $ifNull: ["$amount", { $ifNull: ["$credits", 0] }] },
          },
        },
      },
      { $sort: { total: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userId: "$_id",
          total: 1,
          username: { $ifNull: ["$user.username", "Unknown"] },
          email: { $ifNull: ["$user.email", ""] },
        },
      },
    ];

    const rows = await MaCoin.aggregate(pipeline).allowDiskUse(true);
    return rows.map((r, idx) => ({
      rank: idx + 1,
      userId: r.userId,
      total: r.total,
      name: r.username,
      email: r.email,
    }));
  }

  if (type === "posts") {
    const match = {};
    if (startDate) {
      match.createdAt = { $gte: startDate };
    }
    if (filters.userId) match.userId = mongoose.Types.ObjectId(filters.userId);

    // Aggregation to count forum posts per user
    const pipeline = [
      { $match: match },
      { $group: { _id: "$userId", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userId: "$_id",
          total: 1,
          username: { $ifNull: ["$user.username", "Unknown"] },
          email: { $ifNull: ["$user.email", ""] },
        },
      },
    ];

    const rows = await ForumPost.aggregate(pipeline).allowDiskUse(true);
    return rows.map((r, idx) => ({
      rank: idx + 1,
      userId: r.userId,
      total: r.total,
      name: r.username,
      email: r.email,
    }));
  }

  throw new Error("Unsupported leaderboard type: " + type);
}

module.exports = { calculateLeaderboard };
