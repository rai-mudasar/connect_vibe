"use client"

import { useState } from "react"
import { updateReportStatus } from "@/actions/adminAction"

export default function ReportsTable({ initialReports }) {
  const [reports, setReports] = useState(initialReports)
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(null)

  const filtered = filter === "all" ? reports : reports.filter((r) => r.status === filter)

  const handleAction = async (reportId, status) => {
    setLoading(reportId + status)
    try {
      await updateReportStatus(reportId, status)
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status } : r))
      )
    } catch {
      alert("Failed to update report")
    } finally {
      setLoading(null)
    }
  }

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    dismissed: "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
  }

  const reasonLabels = {
    spam: "Spam",
    hate_speech: "Hate Speech",
    misinformation: "Misinformation",
    inappropriate: "Inappropriate",
    fake_account: "Fake Account",
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex gap-2">
        {["all", "pending", "resolved", "dismissed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition ${
              filter === f
                ? "bg-[#1877f2] text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Reporter</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Type</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden md:table-cell">Reason</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden lg:table-cell">Description</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400 dark:text-gray-500">No reports found</td>
              </tr>
            ) : (
              filtered.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xs font-semibold text-blue-600 dark:text-blue-400 shrink-0">
                        {report.reporter?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {report.reporter?.name || "Deleted user"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
                      {report.contentType}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">
                    {reasonLabels[report.reason] || report.reason}
                  </td>
                  <td className="px-6 py-3 text-gray-500 dark:text-gray-400 hidden lg:table-cell max-w-xs">
                    <p className="truncate">{report.description || "—"}</p>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusStyles[report.status]}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {report.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(report._id, "resolved")}
                          disabled={!!loading}
                          className="text-xs px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 disabled:opacity-40 transition"
                        >
                          {loading === report._id + "resolved" ? "..." : "Resolve"}
                        </button>
                        <button
                          onClick={() => handleAction(report._id, "dismissed")}
                          disabled={!!loading}
                          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition"
                        >
                          {loading === report._id + "dismissed" ? "..." : "Dismiss"}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-500">Done</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
