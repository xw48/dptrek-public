import { useParams, Link } from "react-router-dom";

export default function Module() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Module {id}</h1>
        <p className="mt-2 text-gray-600">
          This is a placeholder. Next we’ll build the real module content.
        </p>
        <Link to="/" className="inline-block mt-6 text-purple-700 font-semibold hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
