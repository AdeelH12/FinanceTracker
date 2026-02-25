import { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [incomeInput, setIncomeInput] = useState("");
    const [expensesInput, setExpensesInput] = useState("");
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [balance, setBalance] = useState(0);

    //toggle for logout
    const [dropdownToggle, setDropdownToggle] = useState(false);

    const handleDropdownToggle = () => {

        setDropdownToggle(!dropdownToggle);
    }

    const navigate = useNavigate();
    
     useEffect(() => {
        const userId = JSON.parse(localStorage.getItem("user")).id;

        const fetchFinancials = async () => {
            const res = await fetch(`/api/financials/${userId}`);
            const data = await res.json();
            if (data.user) {
                setIncome(data.user.income);
                setExpenses(data.user.expenses);
                setBalance(data.user.balance);
            }
        };

        fetchFinancials();
    }, []);

    const getIncome = (e) => setIncomeInput(e.target.value);
    const getExpenses = (e) => setExpensesInput(e.target.value);

    const incomeButton = async (e) => {
        e.preventDefault();
        const newIncome = parseFloat(incomeInput);
        if (isNaN(newIncome) || newIncome <= 0) {
            alert("Please enter a valid income amount");
            return;
        }
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const res = await fetch("/api/financials/income", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, income: newIncome }),
        });
        const data = await res.json();
        if (res.ok) {
            setIncome(data.user.income);
            setBalance(data.user.balance);
            const user = JSON.parse(localStorage.getItem("user"));
            localStorage.setItem("user", JSON.stringify({ ...user, income: data.user.income, balance: data.user.balance }));
            setIncomeInput("");
        }
    };

    const expenseButton = async (e) => {
        e.preventDefault();
        const newExpense = parseFloat(expensesInput);
        if (isNaN(newExpense) || newExpense <= 0) {
            alert("Please enter a valid expense amount");
            return;
        }
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const res = await fetch("/api/financials/expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, expense: newExpense }),
        });
        const data = await res.json();
        if (res.ok) {
            setExpenses(data.user.expenses);
            setBalance(data.user.balance);
            const user = JSON.parse(localStorage.getItem("user"));
            localStorage.setItem("user", JSON.stringify({ ...user, expenses: data.user.expenses, balance: data.user.balance }));
            setExpensesInput("");
        }
    };

    const user = JSON.parse(localStorage.getItem("user"));
    const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    const resetButton = (e) => {
        setBalance(0);
        setExpenses(0);
        setIncome(0);
    }

    const handleLogout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        navigate("/login");

        setDropdownToggle(false);
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="dashboard-header-left">
                    <h1>Finance Tracker</h1>
                    <p className="subtitle">Your financial summary</p>
                </div>
                <div className="dashboard-header-right">
                   <button onClick={handleDropdownToggle} className="toggle"><div className="dashboard-avatar">{initials}</div></button>
                   {dropdownToggle && (
                    <div className="dropdown-menu">
                        <button onClick={handleLogout} className="button-logout">Logout</button>
                        </div>
                   )}
                </div>
            </header>

            <div className="dashboard-content">

                <p className="section-label">Overview</p>
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h3>Balance</h3>
                        <p>£{balance ? balance.toFixed(2) : "0.00"}</p>
                        <span className="stat-card-icon">💰</span>
                    </div>
                    <div className="stat-card">
                        <h3>Income</h3>
                        <p>£{income ? income.toFixed(2) : "0.00"}</p>
                        <span className="stat-card-icon">📈</span>
                    </div>
                    <div className="stat-card">
                        <h3>Expenses</h3>
                        <p>£{expenses ? expenses.toFixed(2) : "0.00"}</p>
                        <span className="stat-card-icon">📉</span>
                    </div>
                </div>

                <div className="transactions">
                    <h2>Add Transactions</h2>

                    <form className="form-section" onSubmit={incomeButton}>
                        <span className="form-label">Income</span>
                        <input
                            className="input"
                            type="number"
                            placeholder="Enter amount"
                            value={incomeInput}
                            onChange={getIncome}
                        />
                        <button type="submit" className="button">Add Income</button>
                    </form>

                    <form className="form-section" onSubmit={expenseButton}>
                        <span className="form-label">Expense</span>
                        <input
                            className="input"
                            type="number"
                            placeholder="Enter amount"
                            value={expensesInput}
                            onChange={getExpenses}
                        />
                        <button type="submit" className="button button--secondary">Add Expense</button>


                    </form>

                    <button type="reset" className="button button--secondary" onClick={resetButton}>Reset</button>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;