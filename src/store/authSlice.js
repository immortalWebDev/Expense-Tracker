import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: null,
    userEmail: null,
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userEmail = action.payload.email;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userEmail', action.payload.email);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userEmail = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName')
      localStorage.removeItem('tokenExpiry')
      localStorage.removeItem('refreshToken')

    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { login, logout, setIsAuthenticated } = authSlice.actions;
export default authSlice.reducer;