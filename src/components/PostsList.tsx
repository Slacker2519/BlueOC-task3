import { useEffect } from "react";
import {
  fetchPosts,
  selectAllPosts,
  selectPostStatus,
  selectPostError,
} from "../state/fetch/fetchSlice.ts";
import { useAppDispatch, useAppSelector } from "../state/hook.ts";

export default function PostsList() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectAllPosts);
  const status = useAppSelector(selectPostStatus);
  const error = useAppSelector(selectPostError);

  useEffect(() => {
    if (status === "idle") dispatch(fetchPosts());
  }, [status, dispatch]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <small>User ID: {post.userId}</small>
        </li>
      ))}
    </ul>
  );
}
