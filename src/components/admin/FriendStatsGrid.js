export default function FriendStatsGrid({ stats }) {
  const cards = [
    { label: "Pending", value: stats.pending, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
    { label: "Accepted Today", value: stats.acceptedToday, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Declined Today", value: stats.declinedToday, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-xl border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-800`}>
          <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
          <p className={`text-2xl font-semibold mt-1 ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  )
}
