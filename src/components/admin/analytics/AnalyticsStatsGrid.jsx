export default function AnalyticsStatsGrid({ engagement }) {
  const cards = [
    {
      label: "Total Likes",
      value: engagement.totalLikes.toLocaleString(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      bg: "bg-red-50 dark:bg-red-900/20",
      color: "text-red-500 dark:text-red-400",
    },
    {
      label: "Total Comments",
      value: engagement.totalComments.toLocaleString(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      bg: "bg-blue-50 dark:bg-blue-900/20",
      color: "text-blue-500 dark:text-blue-400",
    },
    {
      label: "Total Posts",
      value: engagement.totalPosts.toLocaleString(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      ),
      bg: "bg-green-50 dark:bg-green-900/20",
      color: "text-green-500 dark:text-green-400",
    },
    {
      label: "Total Users",
      value: engagement.totalUsers.toLocaleString(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        </svg>
      ),
      bg: "bg-purple-50 dark:bg-purple-900/20",
      color: "text-purple-500 dark:text-purple-400",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-bg-white1 rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-text2">{card.label}</p>
            <div className={`w-9 h-9 rounded-lg ${card.bg} ${card.color} flex items-center justify-center`}>
              {card.icon}
            </div>
          </div>
          <p className="text-2xl font-semibold text-text1">{card.value}</p>
        </div>
      ))}
    </div>
  )
}
