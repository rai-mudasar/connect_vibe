import { getAnalyticsData } from "@/actions/adminActions"
import AnalyticsCharts from "@/components/admin/analytics/AnalyticsCharts"
import AnalyticsStatsGrid from "@/components/admin/analytics/AnalyticsStatsGrid"


export default async function AnalyticsPage() {
  const { engagement, monthlyUsers, monthLabels } = await getAnalyticsData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">Analytics</h1>
        <p className="text-sm text-label mt-1">
          Growth trends and engagement metrics.
        </p>
      </div>

      <AnalyticsStatsGrid engagement={engagement} />

      <AnalyticsCharts monthlyUsers={monthlyUsers} monthLabels={monthLabels} engagement={engagement} />
    </div>
  )
}
