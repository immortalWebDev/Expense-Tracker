import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ExpenseTracker.css";
import { AuthContext } from "./AuthContext";

function ExpenseTracker() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signup"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Add expense to local state
    const newExpense = { amount, description, category };
    setExpenses([...expenses, newExpense]);

    // Clear form fields
    setAmount("");
    setDescription("");
    setCategory("");
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="expense-tracker-container">
      <div className="form-container">
        <h2>Add Daily Expenses</h2>
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
            {/* Add more options as needed */}
          </select>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Expense"}
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
            {expenses.map((expense, index) => (
              <li key={index} className="expense-item">
                <p className="expense-description">{expense.description}</p>
                <p className="expense-amount">${expense.amount}</p>
                <p className="expense-category">{expense.category}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ExpenseTracker;
