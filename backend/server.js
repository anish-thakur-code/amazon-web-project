const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://amazon-web-project.vercel.app",
    "https://amazon-web-project-pq64wmday-anish5.vercel.app",
    "https://amazon-web-project-njbovi0ve-anish5.vercel.app"  // ✅ NEW
  ],
  credentials: true,
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'eCommerce API is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
