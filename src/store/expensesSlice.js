import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const FIREBASE_URL = "https://expense-eagle-piyush-default-rtdb.firebaseio.com/expenses";

export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async () => {
  const response = await axios.get(`${FIREBASE_URL}.json`);
  const data = response.data;
  const loadedExpenses = [];

  for (const key in data) {
    loadedExpenses.push({
      id: key,
      amount: data[key].amount,
      description: data[key].description,
      category: data[key].category,
    });
  }

  return loadedExpenses;
});

export const addExpense = createAsyncThunk('expenses/addExpense', async (newExpense) => {
  const response = await axios.post(`${FIREBASE_URL}.json`, newExpense);
  return { id: response.data.name, ...newExpense };
});

export const editExpense = createAsyncThunk('expenses/editExpense', async (expense) => {
  await axios.put(`${FIREBASE_URL}/${expense.id}.json`, expense);
  return expense;
});

export const deleteExpense = createAsyncThunk('expenses/deleteExpense', async (id) => {
  await axios.delete(`${FIREBASE_URL}/${id}.json`);
  return id;
});

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: {
    items: [],
    totalAmount: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.items = action.payload;
        state.totalAmount = action.payload.reduce((total, expense) => total + parseFloat(expense.amount), 0);
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.totalAmount += parseFloat(action.payload.amount);
      })
      .addCase(editExpense.fulfilled, (state, action) => {
        const index = state.items.findIndex(expense => expense.id === action.payload.id);
        if (index !== -1) {
          state.totalAmount -= parseFloat(state.items[index].amount);
          state.items[index] = action.payload;
          state.totalAmount += parseFloat(action.payload.amount);
        }
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter(expense => expense.id !== action.payload);
        state.totalAmount = state.items.reduce((total, expense) => total + parseFloat(expense.amount), 0);
      });
  },
});

export default expensesSlice.reducer;
