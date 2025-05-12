
require('dotenv').config();
const express = require('express');

const cors = require('cors');
const cookieParser = require('cookie-parser'); 
const productRoutes = require('./routes/productRoutes');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes'); 
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  credentials: true 
}));
app.use(express.json({ limit: "200mb" }));
app.use(cookieParser()); 
app.use((req, res, next) => {
    req.db = db; 
    next();
  });

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/cart', cartRoutes);

module.exports = app;

