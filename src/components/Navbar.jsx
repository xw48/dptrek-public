export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
            🛡️
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              DP Trek
            </h1>
            <p className="text-sm text-gray-500">
              Dark Pattern Education
            </p>
          </div>
        </div>

        {/* Right Section - Menu Button */}
        <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
          <div className="space-y-1">
            <div className="w-6 h-0.5 bg-gray-700"></div>
            <div className="w-6 h-0.5 bg-gray-700"></div>
            <div className="w-6 h-0.5 bg-gray-700"></div>
          </div>
        </button>

      </div>
    </nav>
  );
}
