import { useState } from "react";
import { useAppDispatch } from "../state/hook";
import { addNewPost } from "../state/fetch/fetchSlice";

export default function PostForm() {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState<number>(1);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  const isValid = title.trim() !== "" && body.trim() !== "";

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      setStatus("loading");
      setError(null);

      await dispatch(addNewPost({ userId, title, body })).unwrap();
      setTitle("");
      setBody("");
      setUserId(1);
    } catch (error) {
      setError(`Error: ${error}. Failed to add post, please try again.`);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Post</h2>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="userId" className="text-sm font-medium text-gray-600">
            User ID
          </label>
          <input
            id="UserId"
            type="number"
            min={1}
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="text-sm font-medium text-gray-600">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="body" className="text-sm font-medium text-gray-600">
            Body
          </label>
          <textarea
            id="body"
            rows={4}
            placeholder="Post content"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={!isValid || status === "loading"}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Submitting..." : "Add Post"}
        </button>
      </form>
    </div>
  );
}
