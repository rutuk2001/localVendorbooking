import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: localStorage.getItem('lvb_theme_mode') || 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleThemeMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('lvb_theme_mode', state.mode);
    },
  },
});

export const { toggleThemeMode } = uiSlice.actions;
export default uiSlice.reducer;
