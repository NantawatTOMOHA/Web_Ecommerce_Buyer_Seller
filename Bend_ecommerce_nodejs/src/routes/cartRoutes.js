const express = require('express');
const router = express.Router();
const { authenticateBuyer } = require('../middleware/authMiddleware');
const {getCart,addToCart,deleteCartItem, clearCart, updateCartItemQuantity, getCartResult} = require('../controllers/cartController');


router.get('/', authenticateBuyer, getCart);
router.get('/result', authenticateBuyer, getCartResult);
router.post('/add', authenticateBuyer, addToCart);
router.delete('/delItem/:itemId', authenticateBuyer, deleteCartItem); //หลังdelitem คือ id cart_item
router.patch('/items/:itemId', authenticateBuyer, updateCartItemQuantity);
router.delete('/clear', authenticateBuyer, clearCart);


module.exports = router;
