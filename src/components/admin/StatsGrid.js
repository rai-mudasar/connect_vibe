export default function StatsGrid({ stats }) {
  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      delta: "+12% this week",
      up: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      bg: "bg-blue-50 dark:bg-blue-900/20",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Total Posts",
      value: stats.totalPosts.toLocaleString(),
      delta: "+8% this week",
      up: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      bg: "bg-green-50 dark:bg-green-900/20",
      color: "text-green-600 dark:text-green-400",
    },
    {
      label: "Active Today",
      value: stats.activeToday.toLocaleString(),
      delta: "+5% vs yesterday",
      up: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      bg: "bg-purple-50 dark:bg-purple-900/20",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Pending Requests",
      value: stats.pendingRequests.toLocaleString(),
      delta: "awaiting action",
      up: false,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      color: "text-yellow-600 dark:text-yellow-400",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
            <div className={`w-9 h-9 rounded-lg ${card.bg} ${card.color} flex items-center justify-center`}>
              {card.icon}
            </div>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{card.value}</p>
          <p className={`text-xs mt-1 ${card.up ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
            {card.delta}
          </p>
        </div>
      ))}
    </div>
  )
}
