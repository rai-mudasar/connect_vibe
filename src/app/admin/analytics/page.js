import { getAnalyticsData } from "@/actions/adminAction"
import AnalyticsCharts from "@/components/admin/AnalyticsCharts"
import AnalyticsStatsGrid from "@/components/admin/AnalyticsStatsGrid"


export default async function AnalyticsPage() {
  const { engagement, monthlyUsers, monthLabels } = await getAnalyticsData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Growth trends and engagement metrics.
        </p>
      </div>

      <AnalyticsStatsGrid engagement={engagement} />

      <AnalyticsCharts monthlyUsers={monthlyUsers} monthLabels={monthLabels} engagement={engagement} />
    </div>
  )
}
