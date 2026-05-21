# 📋 React-Redux Posts App

A fully typed React + Redux Toolkit application built with TypeScript fetch, display and add new posts from VITE_API_URL.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── PostForm.tsx
│   └── PostList.tsx
│
├── state/
│   ├── fetch/
│   │   └── fetchSlice.ts
│   ├── hook.ts
│   └── store.ts
│
├── App.tsx
└── main.tsx
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Slacker2519/BlueOC-task3.git
cd BlueOC-task3

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18 | UI library |
| `react-dom` | ^18 | DOM rendering |
| `@reduxjs/toolkit` | ^2 | Redux store, slices, thunks |
| `react-redux` | ^9 | React bindings for Redux |
| `typescript` | ^5 | Static typing |

### Install manually

```bash
npm install @reduxjs/toolkit react-redux
npm install -D typescript @types/react @types/react-dom
```

---

## 🏗️ Architecture Overview

```
index.tsx
└── <Provider store={store}>         ← Provides Redux store to entire app
    └── <App />
        ├── <PostForm />             ← Dispatches addNewPost thunk
        └── <PostsList />            ← Reads posts from Redux state
                │
                ▼
          postsSlice.ts
          ┌─────────────────────────────────┐
          │  state: {                       │
          │    items:  Post[]               │
          │    status: idle/loading/...     │
          │    error:  string | null        │
          │  }                              │
          │                                 │
          │  thunks:                        │
          │    fetchPosts   → GET  /posts   │
          │    addNewPost   → POST /posts   │
          └─────────────────────────────────┘
```

---

## 🧩 Core Concepts

### Store (`app/store.ts`)

The single source of truth for all application state. Exports `RootState` and `AppDispatch` types that are used throughout the app.

```ts
export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Typed Hooks (`app/hooks.ts`)

Pre-typed wrappers around `useSelector` and `useDispatch`. Use these instead of the raw hooks to get full TypeScript inference without repeating type annotations in every component.

```ts
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Posts Slice (`features/posts/postsSlice.ts`)

Manages all posts-related state. Contains:

- **`fetchPosts`** — async thunk that fetches all posts via `GET /posts`
- **`addNewPost`** — async thunk that creates a new post via `POST /posts`
- **`extraReducers`** — handles `pending`, `fulfilled`, and `rejected` states for both thunks
- **Selectors** — `selectAllPosts`, `selectPostStatus`, `selectPostError`

### PostsList (`features/posts/PostsList.tsx`)

Reads posts from Redux state and renders them. Triggers `fetchPosts` on first mount using a `status === 'idle'` guard to prevent duplicate API calls.

### PostForm (`features/posts/PostForm.tsx`)

Controlled form component with local state for `title`, `body`, and `userId`. Dispatches `addNewPost` on submit and uses `.unwrap()` for error handling.

---

## 🔄 Data Flow

### Fetching Posts

```
Component mounts
      │
      ▼
status === 'idle' → dispatch(fetchPosts())
      │
      ├── pending   → state.status = 'loading'   → shows "Loading..."
      ├── fulfilled → state.items  = Post[]       → renders post list
      └── rejected  → state.error  = string       → shows error message
```

### Adding a Post

```
User fills form & clicks "Add Post"
      │
      ▼
dispatch(addNewPost({ userId, title, body }))
      │
      ├── fulfilled → state.items.push(newPost)   → list updates instantly
      └── rejected  → setError(...)               → shows error in form
```

---

## 🗂️ Type Definitions

```ts
// A single post returned by the API
interface Post {
  userId: number;
  id:     number;
  title:  string;
  body:   string;
}

// The shape of the posts slice state
interface PostsState {
  items:  Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error:  string | null;
}
```

`addNewPost` accepts `Omit<Post, 'id'>` — the form sends `userId`, `title`, and `body`, while the API generates the `id`.

---

## 🛠️ Available Scripts

```bash
npm run dev        # Start development server at localhost:5173
npm run build    # Build for production into /build
```

---

## 🌐 API Reference

| Action | Method | Endpoint | Description |
|---|---|---|---|
| Fetch all posts | `GET` | `/posts` | Returns the array of all posts |
| Create a post | `POST` | `/posts` | Returns new post with generated `id` |

> **Note:** Create a .evn file and add `VITE_API_URL=https://jsonplaceholder.typicode.com/posts`

---

## 📈 Extending the App

### Add a new state slice

1. Create `state/yourState/yourStateSlice.ts`
2. Define the interface, `initialState`, thunks, and `extraReducers`
3. Register the reducer in `app/store.ts`:
   ```ts
   import yourStateReducer from '../state/yourState/yourStateSlice';

   export const store = configureStore({
     reducer: {
       posts:      postsReducer,
       yourState: yourStateReducer,
     },
   });
   ```
4. Create your components and use `useAppSelector` / `useAppDispatch`

### Add RTK Query (recommended for larger apps)

Replace manual thunks with RTK Query for automatic caching, polling, and invalidation:

```ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'VITE_API_URL' }),
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({ query: () => '/posts' }),
    addPost:  builder.mutation<Post, Omit<Post, 'id'>>({
      query: (body) => ({ url: '/posts', method: 'POST', body }),
    }),
  }),
});

export const { useGetPostsQuery, useAddPostMutation } = postsApi;
```

---

## 📄 License

MIT — free to use and modify.
