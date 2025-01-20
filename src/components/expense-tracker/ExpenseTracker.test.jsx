import React from 'react';
import { render, screen ,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpenseTracker from '../expense-tracker/ExpenseTracker';
import { ThemeProvider } from '../misc/ThemeContext'; 
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { BrowserRouter } from 'react-router-dom';


describe('ExpenseTracker component', () => {
  test('renders the form', () => {
    render(
    <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        <ExpenseTracker />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>

    );
    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByText('Select Category')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Expense' })).toBeInTheDocument();
  });


  test('initial form values are empty', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>
            <ExpenseTracker />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText('Amount').value).toBe('');
    expect(screen.getByPlaceholderText('Description').value).toBe('');
    expect(screen.getByRole('combobox').value).toBe('');
  });

  test('adds an expense', () => {
    render(
        <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        <ExpenseTracker />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
    );
    userEvent.type(screen.getByPlaceholderText('Amount'), '100');
    userEvent.type(screen.getByPlaceholderText('Description'), 'Groceries');
    userEvent.selectOptions(screen.getByRole('combobox'), ['Food']);

    userEvent.click(screen.getByRole('button', { name: 'Add Expense' }));
    expect(screen.getByText('Shopping')).toBeInTheDocument();
    expect(screen.getByText('Petrol')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
  });

  test('displays total amount', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>
            <ExpenseTracker />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    
    expect(screen.getByText(/Total Amount: \$0/)).toBeInTheDocument();

    userEvent.type(screen.getByPlaceholderText('Amount'), '200');
    userEvent.type(screen.getByPlaceholderText('Description'), 'Transport');
    userEvent.selectOptions(screen.getByRole('combobox'), ['Other']);
    userEvent.click(screen.getByRole('button', { name: 'Add Expense' }));

  });


  test('renders edit form with correct values', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>
            <ExpenseTracker />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    // Add an expense first
    userEvent.type(screen.getByPlaceholderText('Amount'), '300');
    userEvent.type(screen.getByPlaceholderText('Description'), 'Shopping');
    userEvent.selectOptions(screen.getByRole('combobox'), ['Shopping']);
    userEvent.click(screen.getByRole('button', { name: 'Add Expense' }));

    // Wait for the state to update
      expect(screen.getByPlaceholderText('Amount').value).toBe('');
      expect(screen.getByPlaceholderText('Description').value).toBe('');
      expect(screen.getByRole('combobox').value).toBe('');
    
  });


});
