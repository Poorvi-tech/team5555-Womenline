// utils/leaderboardCalc.js
// Usage: calculateLeaderboard({ type:'macoin'|'posts', timeframe:'week'|'month'|'all', limit:10 })

const mongoose = require('mongoose');
const MaCoin = require('../models/MaCoins');      // adjust path if different
const ForumPost = require('../models/ForumPost'); // adjust path if different
const User = require('../models/User');           // adjust if User model file name different

function getStartDate(timeframe) {
  const now = new Date();
  if (timeframe === 'week') {
    const d = new Date(now); d.setDate(now.getDate() - 7); return d;
  }
  if (timeframe === 'month') {
    const d = new Date(now); d.setMonth(now.getMonth() - 1); return d;
  }
  return null; // 'all'
}

async function calculateLeaderboard({ type = 'macoin', timeframe = 'week', limit = 10, filters = {} } = {}) {
  limit = Math.max(1, Math.min(parseInt(limit, 10) || 10, 100));
  const startDate = getStartDate(timeframe);

  if (type === 'macoin') {
    const match = {};
    if (startDate) {
      match.$or = [
        { createdAt: { $gte: startDate } },
        { date: { $gte: startDate } } // in case schema uses `date`
      ];
    }
    // add optional filter props (e.g., tenantId) if passed
    if (filters.userId) match.userId = mongoose.Types.ObjectId(filters.userId);

    const pipeline = [
      { $match: match },
      { $group: {
          _id: '$userId',
          total: { $sum: { $ifNull: ['$amount', { $ifNull: ['$credits', 0] }] } }
      }},
      { $sort: { total: -1 } },
      { $limit: limit },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $project: {
    userId: '$_id',
    total: 1,
    'user.username': 1,
    'user.email': 1
}}
    ];

    const rows = await MaCoin.aggregate(pipeline).allowDiskUse(true);
    return rows.map((r, idx) => ({
      rank: idx + 1,
      userId: r.userId,
      total: r.total,
       name: r.user?.username || null,
      email: r.user?.email || null
    }));
  }

  if (type === 'posts') {
    const match = {};
    if (startDate) {
      match.$or = [
        { createdAt: { $gte: startDate } },
        { date: { $gte: startDate } }
      ];
    }
    if (filters.userId) match.author = mongoose.Types.ObjectId(filters.userId);

    const pipeline = [
      { $match: match },
      { $group: { _id: '$author', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $project: { userId: '$_id', total: '$count', 'user.username': 1, 'user.email':1 } }
    ];

    const rows = await ForumPost.aggregate(pipeline).allowDiskUse(true);
    return rows.map((r, idx) => ({
      rank: idx + 1,
      userId: r.userId,
      total: r.total,
      name: r.user?.username || null,
      email: r.user?.email || null
    }));
  }

  throw new Error('Unsupported leaderboard type: ' + type);
}

module.exports = { calculateLeaderboard };
