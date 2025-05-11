import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "theme",
  initialState: { mode: "light" as "light" | "dark" },
  reducers: {
    toggleMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light"; 
    },
  },
});

export const { toggleMode } = slice.actions;
export default slice.reducer;
