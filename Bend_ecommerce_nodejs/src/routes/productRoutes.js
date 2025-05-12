const express = require('express');
const router = express.Router();
const { addProduct,getAllProducts,getProductById,getMyProducts, updateProduct, deleteProduct, searchProducts, searchMyProducts } = require('../controllers/productsController');
const { authenticateSeller } = require('../middleware/authMiddleware');

router.post('/add', authenticateSeller, addProduct);
router.get('/allproduct', getAllProducts);
router.get('/search/:keyword', searchProducts);
router.get('/seller/search/:keyword',authenticateSeller,searchMyProducts);
router.get('/my-products', authenticateSeller,getMyProducts);
router.get('/:id', getProductById);
router.put('/updateProduct/:id', authenticateSeller, updateProduct);
router.delete('/delProduct/:id', authenticateSeller, deleteProduct);




module.exports = router;
