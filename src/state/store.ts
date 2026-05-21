import { configureStore } from "@reduxjs/toolkit";
import fetchReducer from "./fetch/fetchSlice";

export const store = configureStore({
  reducer: {
    posts: fetchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
