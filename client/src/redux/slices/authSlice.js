import { createSlice } from '@reduxjs/toolkit';

const storedUser = localStorage.getItem('lvb_user');
const storedAccessToken = localStorage.getItem('lvb_access_token');
const storedRefreshToken = localStorage.getItem('lvb_refresh_token');

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: storedAccessToken || null,
  refreshToken: storedRefreshToken || null,
  isAuthenticated: !!storedAccessToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem('lvb_user', JSON.stringify(user));
      localStorage.setItem('lvb_access_token', accessToken);
      if (refreshToken) localStorage.setItem('lvb_refresh_token', refreshToken);
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
      localStorage.setItem('lvb_access_token', action.payload.accessToken);
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem('lvb_refresh_token', action.payload.refreshToken);
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('lvb_user');
      localStorage.removeItem('lvb_access_token');
      localStorage.removeItem('lvb_refresh_token');
    },
  },
});

export const { setCredentials, updateAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
