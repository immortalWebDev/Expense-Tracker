import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const FIREBASE_URL = "https://expense-eagle-piyush-default-rtdb.firebaseio.com/expenses";

export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async () => {
  const userEmail = localStorage.getItem('userEmail')
  const formattedEmail = userEmail.replace('.','')
  const response = await axios.get(`${FIREBASE_URL}/${formattedEmail}.json`);
  const data = response.data;
  const loadedExpenses = [];

  for (const key in data) {
    loadedExpenses.push({
      id: key,
      amount: data[key].amount,
      description: data[key].description,
      category: data[key].category,
    });
    // const expense = data[key].newExpense || data[key]; // Access nested newExpense if it exists
    // console.log(data[key].newExpense)
    //   loadedExpenses.push({
    //     id: key,
    //     amount: expense.amount,
    //     description: expense.description,
    //     category: expense.category,
    //   });
  }

  return loadedExpenses;
});

export const addExpense = createAsyncThunk('expenses/addExpense', async (newExpense) => {
  const userEmail = localStorage.getItem('userEmail')
  const formattedEmail = userEmail.replace('.','')
  const response = await axios.post(`${FIREBASE_URL}/${formattedEmail}.json`, newExpense);
  return { id: response.data.name, ...newExpense };
});

export const editExpense = createAsyncThunk('expenses/editExpense', async (expense) => {
  const userEmail = localStorage.getItem('userEmail')
  const formattedEmail = userEmail.replace('.','')
  await axios.put(`${FIREBASE_URL}/${formattedEmail}/${expense.id}.json`, expense);
  return expense;
});

export const deleteExpense = createAsyncThunk('expenses/deleteExpense', async (id) => {
  const userEmail = localStorage.getItem('userEmail')
  const formattedEmail = userEmail.replace('.','')
  await axios.delete(`${FIREBASE_URL}/${formattedEmail}/${id}.json`);
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