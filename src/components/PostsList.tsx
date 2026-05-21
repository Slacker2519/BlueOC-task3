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

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (status === "failed") {
    return (
      <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Posts
        <span className="ml-2 text-sm font-normal text-gray-400">
          ({posts.length})
        </span>
      </h2>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5
                         hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-semibold text-gray-800 capitalize leading-snug">
                {post.title}
              </h3>
              <span className="shrink-0 text-xs bg-blue-50 text-blue-600 font-medium px-2 py-1 rounded-full">
                User {post.userId}
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
