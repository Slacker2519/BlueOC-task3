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

  const handleSubmit = async (e: React.FormEvent) => {
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
    <form onSubmit={handleSubmit}>
      <h2>Add New Post</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <label htmlFor="userId">User ID</label>
        <input
          id="userId"
          type="number"
          min="1"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
        />
      </div>

      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="body">Body</label>
        <textarea
          id="body"
          placeholder="Post body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <button type="submit" disabled={!isValid || status === "loading"}>
        {status === "loading" ? "Submitting..." : "Add Post"}
      </button>
    </form>
  );
}
