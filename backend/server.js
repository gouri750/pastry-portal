// console.log("Server file is running...");

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // To handle JSON data

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pastryShop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});
const User = mongoose.model('User', UserSchema);

// Order Schema
const OrderSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  total: Number
});
const Order = mongoose.model('Order', OrderSchema);

// Signup Route
app.post('/signup', async (req, res) => {
  try {
    console.log("Received request:", req.body); // Debugging log

    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();
    res.json({ message: "User registered", user });
  } catch (error) {
    console.error("Error in /signup:", error); // Log error
    res.status(500).json({ message: "Error registering user", error });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ message: "Login successful", user });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Create Order (POST)
app.post('/order', async (req, res) => {
  try {
    const { userId, items, total } = req.body;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const order = new Order({ userId, items, total });
    await order.save();
    res.json({ message: "Order placed", order });
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error });
  }
});

//get orders
app.get('/orders', async (req, res) => {
  try {
    console.log("Fetching all orders...");
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
});


// Get Orders by User ID (GET)
app.get('/order/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user orders", error });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

