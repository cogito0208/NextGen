export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
      <div className="flex items-center gap-4">
        <button className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
          Profile
        </button>
      </div>
    </header>
  );
}
