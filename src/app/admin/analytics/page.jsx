import { Suspense } from "react"
import Loading from "@/components/Loading"
import AnalyticsWrapper from "@/components/admin/analytics/AnalyticsWrapper"


export default function AnalyticsPage() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Analytics</h1>
        <p className="text-sm text-text2 mt-1 mb-5">
          Growth trends and engagement metrics.
        </p>

        <Suspense fallback={<Loading className={'mt-[50%] md:mt-[20%]'} />}>
          <AnalyticsWrapper />
        </Suspense>
      </div>
    </div>
  )
}
