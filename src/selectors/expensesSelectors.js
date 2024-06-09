// src/selectors/expensesSelectors.js

import { createSelector } from '@reduxjs/toolkit';

const selectExpensesState = state => state.expenses;

export const selectExpenses = createSelector(
  selectExpensesState,
  expensesState => expensesState.items
);

export const selectTotalAmount = createSelector(
  selectExpensesState,
  expensesState => expensesState.totalAmount
);
