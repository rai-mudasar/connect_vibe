"use client"

import { useEffect, useRef } from "react"

export default function WeeklyCharts({ weeklyUsers, weeklyPosts }) {
  const usersRef = useRef(null)
  const postsRef = useRef(null)
  const chartInstances = useRef([])

  useEffect(() => {
    if (typeof window === "undefined") return

    const loadCharts = async () => {
      const { Chart, registerables } = await import("chart.js")
      Chart.register(...registerables)

      // Destroy old instances
      chartInstances.current.forEach((c) => c.destroy())
      chartInstances.current = []

      const isDark = document.documentElement.classList.contains("dark")
      const gridColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"
      const tickColor = isDark ? "#9ca3af" : "#6b7280"
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

      if (usersRef.current) {
        const c1 = new Chart(usersRef.current, {
          type: "bar",
          data: {
            labels: days,
            datasets: [{
              label: "New Users",
              data: weeklyUsers,
              backgroundColor: "#1877f2",
              borderRadius: 5,
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
        chartInstances.current.push(c1)
      }

      if (postsRef.current) {
        const c2 = new Chart(postsRef.current, {
          type: "line",
          data: {
            labels: days,
            datasets: [{
              label: "Posts",
              data: weeklyPosts,
              borderColor: "#22c55e",
              backgroundColor: "rgba(34,197,94,0.08)",
              tension: 0.4,
              pointRadius: 4,
              fill: true,
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
        chartInstances.current.push(c2)
      }
    }

    loadCharts()
    return () => chartInstances.current.forEach((c) => c.destroy())
  }, [weeklyUsers, weeklyPosts])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-bg-white1 rounded-xl border border-border dark:border-gray-700 p-5">
        <h3 className="text-sm font-semibold text-text1 mb-4">
          New users — last 7 days
        </h3>
        <div className="relative h-48">
          <canvas ref={usersRef} />
        </div>
      </div>
      <div className="bg-bg-white1 rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-text1 mb-4">
          Posts per day — last 7 days
        </h3>
        <div className="relative h-48">
          <canvas ref={postsRef} />
        </div>
      </div>
    </div>
  )
}
