export function SettingsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-xl animate-pulse space-y-6 rounded-lg border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="h-6 w-1/3 rounded bg-gray-100 dark:bg-gray-800" />
      <div className="space-y-4">
        <div className="h-10 rounded bg-gray-100 dark:bg-gray-800" />
        <div className="h-10 rounded bg-gray-100 dark:bg-gray-800" />
      </div>
      <div className="h-12 rounded bg-gray-100 dark:bg-gray-800" />
    </div>
  );
}
