import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialStateT = {
  folders: ({
    _count: {
      videos: number;
    };
  } & {
    id: string;
    name: string;
    createdAt: Date;
    workspaceId: string | null;
  })[];
};

const initialState: InitialStateT = {
  folders: [],
};

export const foldersSlice = createSlice({
  name: "folder-slice",
  initialState,
  reducers: {
    setFolders: (state, action: PayloadAction<InitialStateT>) => {
      return action.payload;
    },
  },
});

export const { setFolders } = foldersSlice.actions;

const foldersReducer = foldersSlice.reducer;

export { foldersReducer as default };
