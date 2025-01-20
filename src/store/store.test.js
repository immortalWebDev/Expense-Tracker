import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slice/authSlice';
import expensesReducer from '../store/slice/expensesSlice';

describe('Redux Store Configuration', () => {
  test('store configuration', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        expenses: expensesReducer,
      },
    });
    expect(store.getState()).toEqual({ auth: { isAuthenticated: null, userEmail: null }, expenses: { items: [], totalAmount: 0 } });
  });

  test('store dispatch', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        expenses: expensesReducer,
      },
    });
    store.dispatch({ type: 'auth/login', payload: { email: 'example@example.com', token: 'exampleToken' } });
    expect(store.getState().auth.isAuthenticated).toBe(true);
  });
});
