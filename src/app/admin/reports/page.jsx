import { getReports } from "@/actions/adminActions"
import ReportsTable from "@/components/admin/report/ReportsTable"

export default async function ReportsPage() {
  const reports = await getReports()

  const pending = reports.filter((r) => r.status === "pending").length
  const resolved = reports.filter((r) => r.status === "resolved").length
  const dismissed = reports.filter((r) => r.status === "dismissed").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Reports</h1>
        <p className="text-sm text-text2 mt-1">
          Manage flagged and reported content.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending", value: pending, color: "    text-yellow-600 dark:text-yellow-400" },
          { label: "Resolved", value: resolved, color: "  text-green-600  dark:text-green-400" },
          { label: "Dismissed", value: dismissed, color: "text-gray-500   dark:text-gray-400" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-secondary">{s.label}</p>
            <p className={`text-2xl font-semibold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-secondary">All Reports</h2>
        </div>
        <ReportsTable initialReports={reports} />
      </div>
    </div>
  )
}
