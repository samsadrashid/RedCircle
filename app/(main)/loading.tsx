export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl mb-3" />
        <div className="h-4 w-64 bg-gray-100 dark:bg-gray-800/60 rounded-lg" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-5 h-44" />
        ))}
      </div>
    </div>
  )
}
