import { configureStore } from "@reduxjs/toolkit"
import counterReducer from "./slices/counterSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer //TODO: Delete when creating a real one and this one no longer serves as reference
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch