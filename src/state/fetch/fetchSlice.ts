import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface PostsState {
  items: Post[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PostsState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchPosts = createAsyncThunk<Post[]>(
  "posts/fetchAll",
  async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");

    if (!response.ok) throw new Error("Failed to fetch posts");

    return response.json();
  },
);

export const addNewPost = createAsyncThunk<Post, Omit<Post, "id">>(
  "posts/addNew",
  async (newPost) => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });
    if (!response.ok) throw new Error("Failed to add new post");
    return response.json();
  },
);

const fetchSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
      })
      .addCase(addNewPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.items.push(action.payload);
      });
  },
});

export const selectAllPosts = (state: { posts: PostsState }): Post[] =>
  state.posts.items;
export const selectPostStatus = (state: {
  posts: PostsState;
}): PostsState["status"] => state.posts.status;
export const selectPostError = (state: { posts: PostsState }): string | null =>
  state.posts.error;

export default fetchSlice.reducer;
