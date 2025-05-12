const express = require('express');
const router = express.Router();
const { authenticateBuyer,authenticateSeller } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { placeOrder, getOrderHistory, getSellerOrders, updateOrderStatus } = require('../controllers/ordersController');

router.post('/placeorder', authenticateBuyer,placeOrder);
router.get('/getorderhistory', authenticateBuyer,getOrderHistory);
router.get('/seller-orders', authenticateSeller, getSellerOrders);
router.patch('/seller-orders/:orderId/status',  authenticateSeller, updateOrderStatus);
module.exports = router;
