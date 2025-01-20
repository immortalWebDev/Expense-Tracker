import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slice/authSlice';
import expensesReducer from '../store/slice/expensesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
  },
});
