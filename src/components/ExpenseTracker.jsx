import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./ExpenseTracker.css";
import Logout from "./Logout";

import {
  fetchExpenses,
  addExpense,
  editExpense,
  deleteExpense,
} from "../store/expensesSlice";
import {
  selectExpenses,
  selectTotalAmount,
} from "../selectors/expensesSelectors";

const ExpenseTracker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const expenses = useSelector(selectExpenses);
  const totalAmount = useSelector(selectTotalAmount);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingExpenses, setLoadingExpenses] = useState(true); 

  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signup");
    } else {
      dispatch(fetchExpenses()).finally(() => {
        setLoadingExpenses(false);
      });
      
    }
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const newExpense = { amount, description, category };

    try {
      if (editMode && currentExpenseId) {
        dispatch(editExpense({ id: currentExpenseId, ...newExpense }));

        setEditMode(false);
        setCurrentExpenseId(null);
      } else {
        dispatch(addExpense(newExpense));
      }

      setAmount("");
      setDescription("");
      setCategory("");
      setError(null);
    } catch (error) {
      console.error("Error adding expense:", error);
      setError(
        "An error occurred while adding the expense. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      dispatch(deleteExpense(id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleEdit = (expense) => {
    setAmount(expense.amount);
    setDescription(expense.description);
    setCategory(expense.category);
    setEditMode(true);
    setCurrentExpenseId(expense.id);
  };

  return (
    <div className="expense-tracker-container">
      <Logout />
      <div className="form-container">
        <h2>{editMode ? "Edit Expense" : "Add Your Expense"}</h2>
        <form className="expense-form" onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Petrol">Petrol</option>
            <option value="Salary">Salary</option>
            <option value="Rent">Rent</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : editMode
              ? "Update Expense"
              : "Add Expense"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        {totalAmount >= 10000 && (
          <div className="premium-info">
            <p>
              Try our premium feature and get extra perks. Download the PDF of
              your expenses free!
            </p>
            <button className="premium-button">Go Premium</button>
          </div>
        )}
        <div className="footer">
          <p>Copyrights @ExpenseEagle!</p>
          <p>By Piyush Badgujar</p>
        </div>
      </div>
      <div className="expenses-container">
        <h3>All Expenses</h3>
        <p className="total-amount">Total Amount: ${totalAmount}</p>
        {loadingExpenses ? (
          <p>Fetching expenses...</p>
        ) : expenses.length === 0 ? (
          <p>No expenses added yet.</p>
        ) : (
          <ul className="expense-list">
            {expenses.map((expense) => (
              <li key={expense.id} className="expense-item">
                <p className="expense-description">{expense.description}</p>
                <p className="expense-amount">${expense.amount}</p>
                <p className="expense-category">{expense.category}</p>
                <div className="button-container">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(expense)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(expense.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {totalAmount >= 10000 && (
          <div className="download-pdf-button">
            <button className="pdf">Download PDF</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;
