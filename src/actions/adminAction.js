'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectToDb from "@/lib/dbConnect";
import userModel from "@/models/userModel";
import postModel from "@/models/postModel";
import reportModel from "@/models/reportModel";
import commentModel from "@/models/commentModel";
import friendRequestModel from "@/models/friendRequestModel";

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
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)

        const [totalUsers, totalPosts, activeToday, pendingRequests, recentUsers] =
            await Promise.all([
                userModel.countDocuments(),
                postModel.countDocuments(),
                userModel.countDocuments({ lastSeen: { $gte: startOfDay } }),
                friendRequestModel.countDocuments({ status: "pending" }),
                userModel.find({isVerified: true})
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

export async function getFriendData() {
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
                .populate("sender", "firstNname lastName profileImageUrl")
                .populate("receiver", "firstNname lastName profileImageUrl")
                .lean(),
        ])

        return {
            stats: { pending, acceptedToday, declinedToday },
            requests: JSON.parse(JSON.stringify(requests)),
        }
    } catch (error) {
        console.error(`Error in getFriendData action : ${error.message || error}`)
        return {
            success: false,
            message: `Error in getFriendData action : ${error.message || error}`
        }
    }
}

export async function getPosts() {
    try {
        await getAdminSessionUser()
        const posts = await postModel.find()
            .sort({ createdAt: -1 })
            .populate("author", "firstNname lastName profileImageUrl")
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

export async function updateUserStatus() {
    try {
        await getAdminSessionUser()

        throw new Error('Updated it');

    } catch (error) {
        console.error(`Error in updateUserStatus action : ${error.message || error}`)
        return {
            success: false,
            message: `Error in updateUserStatus action : ${error.message || error}`
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