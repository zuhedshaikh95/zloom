"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import foldersReducer from "./features/folders.slice";
import workspacesReducer from "./features/workspaces-slice";

const rootReducer = combineReducers({
  foldersReducer,
  workspacesReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
