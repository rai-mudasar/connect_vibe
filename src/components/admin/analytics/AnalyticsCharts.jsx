"use client"

import { useEffect, useRef } from "react"

export default function AnalyticsCharts({ monthlyUsers, monthLabels, engagement }) {
  const growthRef = useRef(null)
  const donutRef = useRef(null)
  const instances = useRef([])

  useEffect(() => {
    if (typeof window === "undefined") return

    const load = async () => {
      const { Chart, registerables } = await import("chart.js")
      Chart.register(...registerables)

      instances.current.forEach((c) => c.destroy())
      instances.current = []

      const isDark = document.documentElement.classList.contains("dark")
      const gridColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"
      const tickColor = isDark ? "#9ca3af" : "#6b7280"

      if (growthRef.current) {
        const c1 = new Chart(growthRef.current, {
          type: "line",
          data: {
            labels: monthLabels,
            datasets: [{
              label: "New Users",
              data: monthlyUsers,
              borderColor: "#1877f2",
              backgroundColor: "rgba(24,119,242,0.08)",
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: "#1877f2",
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 } } },
              y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 } } },
            },
          },
        })
        instances.current.push(c1)
      }

      if (donutRef.current) {
        const c2 = new Chart(donutRef.current, {
          type: "doughnut",
          data: {
            labels: ["Posts", "Comments", "Likes"],
            datasets: [{
              data: [engagement.totalPosts, engagement.totalComments, engagement.totalLikes],
              backgroundColor: ["#1877f2", "#22c55e", "#ef4444"],
              borderWidth: 0,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "65%",
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  color: tickColor,
                  font: { size: 11 },
                  padding: 12,
                  boxWidth: 10,
                  boxHeight: 10,
                },
              },
            },
          },
        })
        instances.current.push(c2)
      }
    }

    load()
    return () => instances.current.forEach((c) => c.destroy())
  }, [monthlyUsers, monthLabels, engagement])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-7">
      <div className="bg-bg-white1 rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-text2 mb-4">User growth — monthly</h3>
        <div className="relative h-56">
          <canvas ref={growthRef} />
        </div>
      </div>
      <div className="bg-bg-white1 rounded-xl border border-border p-5 mt-3">
        <h3 className="text-sm font-semibold text-text2 mb-4">Content breakdown</h3>
        <div className="relative h-56">
          <canvas ref={donutRef} />
        </div>
      </div>
    </div>
  )
}
