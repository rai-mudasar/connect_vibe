'use server'

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectToDb from "@/lib/dbConnect";
import userModel from "@/models/userModel";
import postModel from "@/models/postModel";
import reportModel from "@/models/reportModel";
import commentModel from "@/models/commentModel";
import friendRequestModel from "@/models/friendRequestModel";
import { connection } from "next/server";

function formatNumber(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
    return String(n);
}

export async function getAdminSessionUser() {
    const [_, session] = await Promise.all([
        connectToDb(),
        getServerSession(authOptions),
    ])
    if (!session || !session.user) throw new Error("Unauthorized! You must logged In to perform such operation.");
    if (!session.user.role === 'admin') throw new Error("Unauthorized! You must have admin access to perform such operation.");
    return session.user;
}

export async function getDashboardData() {
    try {
        await getAdminSessionUser()

        const now = new Date()
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

        const [totalUsers, totalPosts, activeToday, pendingRequests, recentUsers] =
            await Promise.all([
                userModel.countDocuments(),
                postModel.countDocuments(),
                userModel.countDocuments({ lastSeen: { $gte: startOfDay } }),
                friendRequestModel.countDocuments({ status: "pending" }),
                userModel.find({ isVerified: true, createdAt: { $gte: sevenDaysAgo } })
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .select("firstName lastName profileImageUrl email isBanned createdAt")
                    .lean(),
            ])

        // Weekly data for charts (last 7 days)
        const weeklyUsers = []
        const weeklyPosts = []
        for (let i = 6; i >= 0; i--) {
            const dayStart = new Date(now - i * 24 * 60 * 60 * 1000)
            dayStart.setHours(0, 0, 0, 0)
            const dayEnd = new Date(dayStart)
            dayEnd.setHours(23, 59, 59, 999)

            const [uCount, pCount] = await Promise.all([
                userModel.countDocuments({ createdAt: { $gte: dayStart, $lte: dayEnd } }),
                postModel.countDocuments({ createdAt: { $gte: dayStart, $lte: dayEnd } }),
            ])
            weeklyUsers.push(uCount)
            weeklyPosts.push(pCount)
        }

        return {
            stats: { totalUsers, totalPosts, activeToday, pendingRequests },
            weeklyUsers,
            weeklyPosts,
            recentUsers: JSON.parse(JSON.stringify(recentUsers)),
        }
    } catch (error) {
        console.error(`Error in getDashboardData action : ${error.message || error}`)
        return {
            success: false,
            message: `Error in getDashboardData action : ${error.message || error}`
        }
    }
}

export async function getAnalyticsData() {
    try {
        await getAdminSessionUser()

        const now = new Date()

        const monthlyUsers = []
        const monthLabels = []
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)
            const count = await userModel.countDocuments({ createdAt: { $gte: d, $lte: end } })
            monthlyUsers.push(count)
            monthLabels.push(d.toLocaleString("default", { month: "short" }))
        }

        const [totalLikes, totalComments, totalPosts, totalUsers] = await Promise.all([
            postModel.aggregate([{ $project: { count: { $size: "$likes" } } }, { $group: { _id: null, total: { $sum: "$count" } } }]).then(r => r[0]?.total || 0),
            commentModel.countDocuments(),
            postModel.countDocuments(),
            userModel.countDocuments(),
        ])

        return {
            engagement: { totalLikes, totalComments, totalPosts, totalUsers },
            monthlyUsers,
            monthLabels,
        }
    } catch (error) {
        console.error(`Error in getAnalyticsData action : ${error.message || error}`)
        return {
            success: false,
            message: `Error in getAnalyticsData action : ${error.message || error}`
        }
    }
}

export async function getFriendsStatsData() {
    try {
        await getAdminSessionUser()

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const [pending, acceptedToday, declinedToday, requests] = await Promise.all([
            friendRequestModel.countDocuments({ status: "pending" }),
            friendRequestModel.countDocuments({ status: "accepted", updatedAt: { $gte: today } }),
            friendRequestModel.countDocuments({ status: "declined", updatedAt: { $gte: today } }),
            friendRequestModel.find()
                .sort({ createdAt: -1 })
                .limit(50)
                .populate("sender", "firstName lastName profileImageUrl")
                .populate("receiver", "firstName lastName profileImageUrl")
                .lean(),
        ])

        return {
            stats: { pending, acceptedToday, declinedToday },
            requests: JSON.parse(JSON.stringify(requests)),
        }
    } catch (error) {
        // console.error(`Error in getFriendsStatsData action : ${error.message || error}`)
        return {
            success: false,
            message: `Error in getFriendsStatsData action : ${error.message || error}`
        }
    }
}

export async function getPosts() {
    try {
        await getAdminSessionUser()
        const posts = await postModel.find()
            .sort({ createdAt: -1 })
            .populate("author", "firstName lastName profileImageUrl")
            .lean()
        return JSON.parse(JSON.stringify(posts))
    } catch (error) {
        console.error(`Error in getPosts action : ${error.message || error}`)
        return {
            success: false,
            message: `Error in getPosts action : ${error.message || error}`
        }
    }
}

export async function getReports() {
    try {
        await getAdminSessionUser()
        const reports = await reportModel.find()
            .sort({ createdAt: -1 })
            .populate("reporter", "firstNname lastName profileImageUrl")
            .lean()
        return JSON.parse(JSON.stringify(reports))
    } catch (error) {
        console.error(`Error in getReports action : ${error.message || error}`)
        return {
            success: false,
            message: `Error in getReports action : ${error.message || error}`
        }
    }
}

export async function updateReportStatus() {
    try {
        await getAdminSessionUser()

        throw new Error('Updated it');

    } catch (error) {
        console.error(`Error in updateReportStatus action : ${error.message || error}`)
        return {
            success: false,
            message: `Error in updateReportStatus action : ${error.message || error}`
        }
    }
}

export async function deleteUserById() {
    try {
        await getAdminSessionUser()

        throw new Error('Updated it');

    } catch (error) {
        console.error(`Error in deleteUserById action : ${error.message || error}`)
        return {
            success: false,
            message: `Error in deleteUserById action : ${error.message || error}`
        }
    }
}

export async function getUsers() {
    try {
        await getAdminSessionUser()
        const users = await userModel.find()
            .sort({ createdAt: -1 })
            .select("firstName lastName profileImageUrl email isBanned role postCount createdAt lastSeen")
            .lean()
        return JSON.parse(JSON.stringify(users))
    } catch (error) {
        console.error(`Error in getUsers action : ${error.message || error}`)
        return {
            success: false,
            message: `Error in getUsers action : ${error.message || error}`
        }
    }
}

export async function getUsersByFilter(cursor = "", search = "", role = "all", status = "all") {
    const limit = 10;
    let query = {};

    if (search) {
        query.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ]
    }

    if (role !== "all") {
        query.role = role
    }

    if (status !== "all") {
        query.status = status
    }

    if (cursor !== '') {
        query._id = { $gt: new ObjectId(cursor) }
    }

    try {
        await getAdminSessionUser()
        const users = await userModel
            .find(query)
            .select('username firstName lastName email isVerified profileImageUrl posts lastSeen role status createdAt')
            .sort({ _id: 1 })
            .limit(limit + 1)
            .lean()

        if (!users || users.length === 0) {
            return {
                success: true,
                message: "Users data is not found"
            }
        }
        const serializedUsers = JSON.parse(JSON.stringify(users))

        const hasNextPage = users.length > limit;
        if (hasNextPage) users.pop();

        const nextCursor = hasNextPage ? users[users.length - 1]._id.toString() : null;

        return {
            success: true,
            data: { 'users': serializedUsers, 'cursor': nextCursor, 'hasNextPage': hasNextPage }
        };
    } catch (error) {
        console.error(`Error in getUsersByFilter action : ${error.message || error}`)
        return {
            success: false,
            message: `Error in getUsersByFilter action : ${error.message || error}`
        }
    }
}

export async function activateUser(userId) {
    try {
        await getAdminSessionUser();
        const user = await userModel.findByIdAndUpdate(userId,
            { status: "active" },
            { new: true }
        );

        if (!user) throw new Error("User not found");

        revalidatePath("/admin/users");
        return {
            success: true,
            message: `${user.firstName} ${user.lastName} is now activated.`
        };
    } catch (error) {
        return {
            success: false,
            message: `Error in getUsersByFilter action : ${error.message || error}`
        };
    }
}

export async function suspendUser(userId) {
    try {
        await getAdminSessionUser();
        const user = await userModel.findByIdAndUpdate(userId,
            { status: "suspended" },
            { new: true }
        );

        if (!user) throw new Error("User not found");

        revalidatePath("/admin/users");
        return {
            success: true,
            message: `${user.firstName} ${user.lastName} is now suspended.`
        };
    } catch (error) {
        // console.log(`Error in suspendUser action : ${error.message || error}`);
        return {
            success: false,
            message: `Error in suspendUser action : ${error.message || error}`,
            status: user.status.toString()
        };
    }
}

export async function banUser(userId) {
    try {
        await getAdminSessionUser();
        const user = await userModel.findByIdAndUpdate(userId,
            { status: "banned" },
            { new: true }
        );

        if (!user) throw new Error("User not found");

        revalidatePath("/admin/users");
        return {
            success: true,
            message: `${user.firstName} ${user.lastName} is now banned.`
        };
    } catch (error) {
        return {
            success: false,
            message: `Error in banUser action : ${error.message || error}`
        };
    }
}

export async function bulkAction(userIds, action) {
    try {
        const results = await Promise.all(
            userIds.map(id => {
                if (action === "ban") return banUser(id);
                if (action === "suspend") return suspendUser(id);
                if (action === "activate") return activateUser(id);
                return Promise.resolve({ success: false, error: "Unknown action" });
            })
        );

        const failed = results.filter(r => !r.success);
        revalidatePath("/admin/users");
        return {
            success: true,
            message: `Bulk ${action}: ${userIds.length - failed.length} succeeded, ${failed.length} failed.`,
        };
    } catch (error) {
        return {
            success: false,
            message: `Error in bulAction action : ${error.message || error}`
        };
    }
}

export async function changeUserRole(userId, newRole) {
    try {
        await getAdminSessionUser();
        const user = await userModel.findByIdAndUpdate(
            userId,
            { role: newRole },
            { new: true }
        );
        if (!user) throw new Error("User not found");

        revalidatePath("/admin/users");
        return {
            success: true,
            message: `${user.firstName}'s role changed to ${newRole}.`
        };
    } catch (error) {
        return {
            success: false,
            message: `Error in changeUserRole action : ${error.message || error}`
        };
    }
}

export async function getAdminStats() {
    await connection();
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const [result] = await userModel.aggregate([
            {
                $facet: {
                    // 1. Current Live Totals
                    totals: [
                        {
                            $group: {
                                _id: null,
                                total: { $sum: 1 },
                                banned: { $sum: { $cond: [{ $eq: ["$isBanned", true] }, 1, 0] } },
                                active: { $sum: { $cond: [{ $eq: ["$isBanned", false] }, 1, 0] } },
                                verified: { $sum: { $cond: [{ $eq: ["$isVerified", true] }, 1, 0] } }
                            }
                        }
                    ],
                    // 2. Registrations Today
                    newToday: [
                        { $match: { createdAt: { $gte: todayStart } } },
                        { $count: "count" }
                    ],
                    // 3. Deep Matrix: Grouping by date windows and compiling statuses simultaneously
                    growthMatrix: [
                        { $match: { createdAt: { $gte: sixtyDaysAgo } } },
                        {
                            $group: {
                                _id: {
                                    period: {
                                        $cond: [
                                            { $gte: ["$createdAt", thirtyDaysAgo] },
                                            "last30",
                                            "prev30"
                                        ]
                                    }
                                },
                                totalJoined: { $sum: 1 },
                                bannedJoined: { $sum: { $cond: [{ $eq: ["$isBanned", true] }, 1, 0] } },
                                verifiedJoined: { $sum: { $cond: [{ $eq: ["$isVerified", true] }, 1, 0] } }
                            }
                        }
                    ],
                    // 4. Calculating standard historical velocity for "New Today" comparison 
                    // (Gets daily average registration volume from previous month window)
                    historicalDailyAverage: [
                        {
                            $match: {
                                createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                total: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                dailyAvg: { $round: [{ $divide: ["$total", 30] }, 0] }
                            }
                        }
                    ]
                }
            }
        ]);

        // Extract current global configurations
        const totals = result?.totals?.[0] || { total: 0, banned: 0, active: 0, verified: 0 };
        const newTodayCount = result?.newToday?.[0]?.count || 0;
        const baselineDailyAvg = result?.historicalDailyAverage?.[0]?.dailyAvg || 0;

        // Extract performance windows from Matrix
        const last30Data = result?.growthMatrix?.find(g => g._id.period === "last30") || { totalJoined: 0, bannedJoined: 0, verifiedJoined: 0 };
        const prev30Data = result?.growthMatrix?.find(g => g._id.period === "prev30") || { totalJoined: 0, bannedJoined: 0, verifiedJoined: 0 };
        
        // Uniform utility formatter
        const formatStat = (label, currentValue, monthlyChange) => {
            let changeType = "neutral";
            if (monthlyChange > 0) changeType = "positive";
            if (monthlyChange < 0) changeType = "negative";
            
            return {
                label,
                formatted: formatNumber(currentValue),
                change: monthlyChange,
                changeType
            };
        };
        
        // Calculate clear variance diff tracks
        const totalUsersChange = last30Data.totalJoined - prev30Data.totalJoined;
        const activeUsersChange = (last30Data.totalJoined - last30Data.bannedJoined) - (prev30Data.totalJoined - prev30Data.bannedJoined);
        const bannedUsersChange = last30Data.bannedJoined - prev30Data.bannedJoined;
        const verifiedUsersChange = last30Data.verifiedJoined - prev30Data.verifiedJoined;
        const growth30d = ((last30Data.totalJoined - prev30Data.totalJoined) / last30Data.totalJoined) * 100;
        
        const dailyVelocityChange = newTodayCount - baselineDailyAvg;

        return {
            success: true,
            data: JSON.parse(JSON.stringify({
                totalUsers: formatStat("Total Users", totals.total, totalUsersChange),
                activeUsers: formatStat("Active Users", totals.active, activeUsersChange),
                bannedUsers: formatStat("Banned Users", totals.banned, bannedUsersChange),
                verified: formatStat("Verified Users", totals.verified, verifiedUsersChange),
                newToday: formatStat("New Today", newTodayCount, dailyVelocityChange),
                growth30d: formatStat("Growth (30d)", prev30Data.totalJoined, growth30d)
            }))
        };

    } catch (error) {
        console.error(`Error in getAdminStats: ${error.message || error}`);
        return {
            success: false,
            message: `Failed to load dashboard metrics: ${error.message || error}`,
            data: null
        };
    }
}