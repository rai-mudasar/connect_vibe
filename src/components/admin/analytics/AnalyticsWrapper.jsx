import AnalyticsCharts from './AnalyticsCharts'
import AnalyticsStatsGrid from './AnalyticsStatsGrid'
import { getAnalyticsData } from '@/actions/adminActions'

export default async function AnalyticsWrapper() {
  const { engagement, monthlyUsers, monthLabels } = await getAnalyticsData()

    return (
        <div>
            <AnalyticsStatsGrid engagement={engagement} />
            <AnalyticsCharts monthlyUsers={monthlyUsers} monthLabels={monthLabels} engagement={engagement} />
        </div>
    )
}