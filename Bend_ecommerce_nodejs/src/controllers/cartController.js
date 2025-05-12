

const addToCart = async (req, res) => {
    const buyerId = req.user.userId;
    const { productId, quantity } = req.body;

    try {

      let cartResult = await req.db.query(`SELECT id FROM carts WHERE buyer_id = $1`, [buyerId]);
      let cartId;
      if (cartResult.rows.length === 0) {
        const newCart = await req.db.query(
          `INSERT INTO carts (buyer_id, created_at) VALUES ($1, NOW()) RETURNING id`,
          [buyerId]
        );
        cartId = newCart.rows[0].id;
      } else {
        cartId = cartResult.rows[0].id;
      }
  

      const productResult = await req.db.query(`SELECT price FROM products WHERE id = $1`, [productId]);
      const unitPrice = productResult.rows[0].price;
      const totalPrice = unitPrice * quantity;
  
      await req.db.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [cartId, productId, quantity, unitPrice, totalPrice]
      );
  
      res.status(201).json({ message: 'Added to cart' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

const deleteCartItem = async (req, res) => {
    const buyerId = req.user.userId;
    const { itemId } = req.params;
  
    try {
      const check = await req.db.query(
        `SELECT ci.id
         FROM cart_items ci
         JOIN carts c ON ci.cart_id = c.id
         WHERE ci.id = $1 AND c.buyer_id = $2`,
        [itemId, buyerId]
      );
  
      if (check.rows.length === 0) {
        return res.status(403).json({ message: 'No permission to delete this item' });
      }
  
      await req.db.query(`DELETE FROM cart_items WHERE id = $1`, [itemId]);
      res.status(200).json({ message: 'Item removed from cart' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

const clearCart = async (req, res) => {
    try {
      const buyerId = req.user.userId;
  
      const cartResult = await req.db.query(
        'SELECT id FROM carts WHERE buyer_id = $1',
        [buyerId]
      );
  
      if (cartResult.rows.length === 0) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      const cartId = cartResult.rows[0].id;

      await req.db.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
  
      res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (err) {
      console.error('Error clearing cart:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
const getCart = async (req, res) => {
    const buyerId = req.user.userId;
  
    try {
      const result = await req.db.query(
        `SELECT ci.id, p.name, ci.quantity, ci.unit_price, ci.total_price
         FROM carts c
         JOIN cart_items ci ON c.id = ci.cart_id
         JOIN products p ON ci.product_id = p.id
         WHERE c.buyer_id = $1`,
        [buyerId]
      );
  
      res.status(200).json({ items: result.rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
const updateCartItemQuantity = async (req, res) => {
    try {
      const buyerId = req.user.userId;
      const { itemId } = req.params;
      const { quantity } = req.body;
  
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: 'Invalid quantity' });
      }
  
      const itemCheck = await req.db.query(`
        SELECT ci.id, ci.unit_price, c.buyer_id
        FROM cart_items ci
        JOIN carts c ON ci.cart_id = c.id
        WHERE ci.id = $1 AND c.buyer_id = $2
      `, [itemId, buyerId]);
  
      if (itemCheck.rows.length === 0) {
        return res.status(403).json({ message: 'Item not found in your cart' });
      }
  
      const unitPrice = itemCheck.rows[0].unit_price;
      const totalPrice = unitPrice * quantity;
  
      await req.db.query(`
        UPDATE cart_items
        SET quantity = $1, total_price = $2
        WHERE id = $3
      `, [quantity, totalPrice, itemId]);
  
      res.status(200).json({ message: 'Quantity updated successfully' });
    } catch (err) {
      console.error('Update quantity error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
const getCartResult = async (req, res) => {
    try {
      const buyerId = req.user.userId;
  
      const cartResult = await req.db.query(
        `SELECT id FROM carts WHERE buyer_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [buyerId]
      );
  
      if (cartResult.rows.length === 0) {
        return res.status(200).json({ items: [] }); 
      }
  
      const cartId = cartResult.rows[0].id;
  
      const itemsResult = await req.db.query(
        `SELECT product_id, quantity FROM cart_items WHERE cart_id = $1`,
        [cartId]
      );
  
      res.status(200).json({ items: itemsResult.rows });
    } catch (err) {
      console.error('Fetch cart items error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
module.exports = { addToCart,deleteCartItem,clearCart,getCart,updateCartItemQuantity,getCartResult };