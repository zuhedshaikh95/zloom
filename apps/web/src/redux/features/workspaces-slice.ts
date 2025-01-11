import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialStateT = {
  workspaces: {
    type: "PERSONAL" | "PUBLIC";
    name: string;
    id: string;
  }[];
};

const initialState: InitialStateT = {
  workspaces: [],
};

export const workspacesSlice = createSlice({
  name: "workspaces-slice",
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<InitialStateT>) => {
      return action.payload;
    },
  },
});

export const { setWorkspaces } = workspacesSlice.actions;

const workspacesReducer = workspacesSlice.reducer;

export { workspacesReducer as default };
