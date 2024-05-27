import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ExpenseTracker.css";
import { AuthContext } from "./AuthContext";
import axios from 'axios';
import Logout from "./Logout";

const FIREBASE_URL = "https://expense-eagle-piyush-default-rtdb.firebaseio.com/expenses";

function ExpenseTracker() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signup");
    } else {
      fetchExpenses();
    }
  }, [isAuthenticated, navigate]);

  const fetchExpenses = async () => {
    try {
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

      setExpenses(loadedExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError("Error fetching expenses. Please try again later.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const newExpense = { amount, description, category };

    try {
      if (editMode && currentExpenseId) {
        await axios.put(`${FIREBASE_URL}/${currentExpenseId}.json`, newExpense);
        setExpenses((prevExpenses) =>
          prevExpenses.map((expense) =>
            expense.id === currentExpenseId ? { id: currentExpenseId, ...newExpense } : expense
          )
        );
        console.log("Expense successfully edited");
        setEditMode(false);
        setCurrentExpenseId(null);
      } else {
        const response = await axios.post(`${FIREBASE_URL}.json`, newExpense);
        if (response.status === 200) {
          setExpenses((prevExpenses) => [
            ...prevExpenses,
            { id: response.data.name, ...newExpense },
          ]);
        }
      }

      setAmount("");
      setDescription("");
      setCategory("");
      setError(null);
    } catch (error) {
      console.error("Error adding expense:", error);
      setError("An error occurred while adding the expense. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${FIREBASE_URL}/${id}.json`);
      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
      console.log("Expense successfully deleted");
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
      <Logout></Logout>
      <div className="form-container">
        <h2>{editMode ? "Edit Expense" : "Add Daily Expenses"}</h2>
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
          </select>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : editMode ? "Update Expense" : "Add Expense"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
      <div className="expenses-container">
        <h3>Expenses</h3>
        {expenses.length === 0 ? (
          <p>No expenses added yet.</p>
        ) : (
          <ul className="expense-list">
            {expenses.map((expense) => (
              <li key={expense.id} className="expense-item">
                <p className="expense-description">{expense.description}</p>
                <p className="expense-amount">${expense.amount}</p>
                <p className="expense-category">{expense.category}</p>
                <button className="edit-button" onClick={() => handleEdit(expense)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(expense.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ExpenseTracker;
