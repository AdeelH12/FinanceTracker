const bcrypt = require("bcryptjs");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// Register route
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered." });
    }
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user with initial financial data
    const user = await User.create({
      name,
      email,
      passwordHash,
      income: 0,
      expenses: 0, 
      balance: 0,
    });

    return res.status(201).json({
      message: "User created",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.log("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Login route
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        income: user.income,
        expenses: user.expenses,
        balance: user.balance,
      },
    });
  } catch (err) {
    console.log("Login error", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// User's financial data (income, expenses, balance)
app.get("/api/financials/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user: {
        income: user.income,
        expenses: user.expenses,
        balance: user.balance,
      },
    });
  } catch (err) {
    console.log("Error fetching financial data:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Update income
app.post("/api/financials/income", async (req, res) => {
  const { userId, income } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.income += income;
    user.balance += income;

    await user.save();
    res.json({ message: "Income updated successfully", user });
  } catch (err) {
    console.log("Error updating income:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/financials/expenses", async (req, res) => {
  const { userId, expense } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.expenses += expense;
    user.balance -= expense; 

    await user.save();
    res.json({ message: "Expenses updated successfully", user });
  } catch (err) {
    console.log("Error updating expenses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
