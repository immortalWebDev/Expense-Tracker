import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Importing the plugin
import { useTheme } from '../store/ThemeContext';
import "./ExpenseTracker.css";

import {
  fetchExpenses,
  addExpense,
  editExpense,
  deleteExpense,
} from "../store/expensesSlice";


const ExpenseTracker = () => {
  const { theme} = useTheme();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const expenses = useSelector(state => state.expenses.items); 
  
  const totalAmount = useSelector(state => state.expenses.totalAmount); 
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingExpenses, setLoadingExpenses] = useState(true); 
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);
  const [isPremiumActivated, setIsPremiumActivated] = useState(false); 


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
    // console.log(newExpense)

    try {
      if (editMode && currentExpenseId) {
        // console.log(editMode,currentExpenseId)
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

    console.log(editMode ? 'Edited expense successfully' : 'Added expense successfully');

  };

  const handleDelete = async (id) => {
    try {
      dispatch(deleteExpense(id));
      console.log('Deleted expense successfully')
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleEdit = (expense) => {
    // console.log(expense)
    setAmount(expense.amount);
    setDescription(expense.description);
    setCategory(expense.category);
    setEditMode(true);
    setCurrentExpenseId(expense.id);
  };


  const handleDownloadPDF = async () => {
    const doc = new jsPDF();

    const expenseData = expenses.map((expense, index) => {
      return [
        index + 1,
        expense.description,
        expense.category,
        expense.amount,
      ];
    });
    // expenseData.push(['', '', 'Total:', totalAmount]);
    // Add total amount row
    expenseData.push([
      '',
      '', 
      { content: 'Total:', styles: { fontStyle: 'bold', fontSize: 14 } }, 
      { content: totalAmount, styles: { fontStyle: 'bold', fontSize: 14 } }
  ]);


    const headers = [["#", "Description", "Category","Amount"]];

    const content = {
      startY: 20,
      head: headers,
      body: expenseData,
    };


    doc.text(`Expense Report of ${localStorage.getItem('userName')}` , 14, 15);
    
    doc.autoTable(content);


  // Add date and time below the table
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const dateTimeText = `Report generated on: ${formattedDate} (${formattedTime})`;

  // Position below the table
  const tableEndY = doc.lastAutoTable.finalY; // Get the last table's Y position
  doc.text(dateTimeText, 14, tableEndY + 10);


    // console.log(doc)

    // Convert the PDF to Blob
    const pdfBlob = doc.output("blob");
    // console.log(pdfBlob) //pdf as binary data stream

    // Create a link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = `expense-report-${localStorage.getItem('userName')}.pdf`;

    // Append the link to the body
    document.body.appendChild(link);

    //Trigger the click method upon link
    link.click();
    console.log(`Downloading PDF for ${localStorage.getItem('userName')}...`)

    // Remove the link from the document
    document.body.removeChild(link);
  };


  return (
    <>
   <span className="filler-image">
    <img src="https://cdn.jsdelivr.net/gh/immortalWebDev/my-cdn@1e01b30a4644e0e404d8df0590c48a1aa83912ff/expense-tracker/wave-filler.webp" alt="wave" />

   </span>


    <div className={`expense-tracker-container ${theme}`}>
      
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
          <div className={`premium-info ${theme}`}>
            <p>
              Try our advance feature and get extra perks. Download the PDF of
              your expenses free!
            </p>
            <button className="premium-button" onClick={() => setIsPremiumActivated(true)}>Go Premium</button>
          </div>
        )}
        <div className={`footer ${theme}`}>
          <p>Copyrights @ExpenseEagle!</p>
          <p>Made with 💝 by <a href="https://web-portfolio-piyush.vercel.app/" target="_blank">Piyush</a></p>
        </div>
      </div>
      <hr className="section-divider"/>
      <div className={`expenses-container ${theme}`}>
        <h3>All Expenses</h3>
        <p>Total Amount: ${totalAmount}</p>
        {loadingExpenses ? (
          <p>Fetching expenses...</p>
        ) : expenses.length === 0 ? (
          <p>No expenses added yet.</p>
        ) : (
          <ul className="expense-list">
            {/* {console.log('from state',expenses)} */}
            {[...expenses].reverse().map((expense) => (
              <li key={expense.id} className={`expense-item ${theme}`}>
                <p className={`expense-description ${theme}`}>{expense.description}</p>
                <p className={`expense-amount ${theme}`}>${expense.amount}</p>
                <p className={`expense-category ${theme}`}>{expense.category}</p>
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
        {isPremiumActivated && (
          <div className="download-pdf-button">
            <button className="pdf" onClick={handleDownloadPDF}>Download PDF</button>
          </div>
        )}
      </div>
    </div>
    </>
  );
  
};

export default ExpenseTracker;
