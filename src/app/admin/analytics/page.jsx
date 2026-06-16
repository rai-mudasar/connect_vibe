import { Suspense } from "react"
import Loading from "@/components/Loading"
import AnalyticsWrapper from "@/components/admin/analytics/AnalyticsWrapper"


export default function AnalyticsPage() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">Analytics</h1>
        <p className="text-sm text-label mt-1">
          Growth trends and engagement metrics.
        </p>

        <Suspense fallback={<Loading />}>
          <AnalyticsWrapper />
        </Suspense>
      </div>
    </div>
  )
}
