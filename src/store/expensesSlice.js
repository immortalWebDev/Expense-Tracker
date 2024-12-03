import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async () => {
  const userEmail = localStorage.getItem('userEmail')
  const formattedEmail = userEmail.replaceAll('.','')
  const response = await axios.get(`${import.meta.env.VITE_FB_RTDB_BASE_URL}expenses/${formattedEmail}.json`);
  // console.log(response)
  const data = response.data;
  // console.log(typeof data)
  const loadedExpenses = [];
  

  for (const key in data) {
    loadedExpenses.push({
      id: key,
      amount: data[key].amount,
      description: data[key].description,
      category: data[key].category,
    });

    
  }
  // console.log(loadedExpenses)
  return loadedExpenses; // async func returns promise, upon fullfiliing by createAsyncThunk returns action.payload
});

export const addExpense = createAsyncThunk('expenses/addExpense', async (newExpense) => {
  const userEmail = localStorage.getItem('userEmail')
  const formattedEmail = userEmail.replaceAll('.','')
  const response = await axios.post(`${import.meta.env.VITE_FB_RTDB_BASE_URL}expenses/${formattedEmail}.json`, newExpense);
  return { id: response.data.name, ...newExpense };
});

export const editExpense = createAsyncThunk('expenses/editExpense', async (expense) => {
  const userEmail = localStorage.getItem('userEmail')
  const formattedEmail = userEmail.replaceAll('.','')
  await axios.put(`${import.meta.env.VITE_FB_RTDB_BASE_URL}expenses/${formattedEmail}/${expense.id}.json`, expense);
  return expense;
});

export const deleteExpense = createAsyncThunk('expenses/deleteExpense', async (id) => {
  const userEmail = localStorage.getItem('userEmail')
  const formattedEmail = userEmail.replaceAll('.','')
  await axios.delete(`${import.meta.env.VITE_FB_RTDB_BASE_URL}expenses/${formattedEmail}/${id}.json`);
  // console.log('from server',id)
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
      .addCase(fetchExpenses.fulfilled, (state, action) => { //takes action.type and a reducer function which takes cuu state and action object
        state.items = action.payload;
        state.totalAmount = action.payload.reduce((total, expense) => total + parseFloat(expense.amount), 0);
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.totalAmount = state.totalAmount + parseFloat(action.payload.amount);
      })
      .addCase(editExpense.fulfilled, (state, action) => {
        // console.log('from server',action.payload)
        
        const index = state.items.findIndex(expense => expense.id === action.payload.id);
        if (index !== -1) {
          state.totalAmount = state.totalAmount - parseFloat(state.items[index].amount);
          state.items[index] = action.payload;  
          state.totalAmount = state.totalAmount + parseFloat(action.payload.amount);
        }
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        // console.log(action.payload)
        state.items = state.items.filter(expense => expense.id !== action.payload); //if true then that exp is removed
        state.totalAmount = state.items.reduce((total, expense) => total + parseFloat(expense.amount), 0);
      });
  },
});

export default expensesSlice.reducer;