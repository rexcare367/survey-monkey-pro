export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-2">Welcome back!</h2>
        <p className="text-zinc-600 dark:text-zinc-400">You are successfully authenticated.</p>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">User Information</h3>
        <div className="space-y-2">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <strong className="text-black dark:text-zinc-50">Welcome to your dashboard!</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

