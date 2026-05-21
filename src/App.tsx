import PostsList from "./components/PostsList";
import PostForm from "./components/PostForm";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <h1 className="text-2xl font-bold text-gray-800">📋 Posts App</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <PostForm />
        <PostsList />
      </main>
    </div>
  );
}
