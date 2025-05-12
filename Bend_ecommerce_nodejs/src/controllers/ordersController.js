

const placeOrder = async (req, res) => {
  const db = req.db;
  try {
    const buyerId = req.user.userId;
    const role = req.user.role;
    const { items, address } = req.body;

    if (role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can place orders' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' });
    }

    await db.query('BEGIN');


    const productIds = items.map(item => item.product_id);
    const productQuery = await db.query(
      `SELECT id, price, quantity, seller_id FROM products WHERE id = ANY($1::int[])`,
      [productIds]
    );
    const productMap = Object.fromEntries(productQuery.rows.map(
      p=> [p.id,{price: p.price,quantity:p.quantity,seller_id:p.seller_id}]));


    for (const item of items) {
      const availableQty = productMap[item.product_id]?.quantity;
      if (!availableQty || item.quantity > availableQty) {
        return res.status(400).json({ message: `Insufficient stock for product ID ${item.product_id}` });
      }
    }

    const groupedItems ={};
    for(const item of items){
        const product = productMap[item.product_id];
        const sellerId = product.seller_id;
        if(!groupedItems[sellerId]){
          groupedItems[sellerId] = []
        }
        const totalPrice = product.price * item.quantity;
        groupedItems[sellerId].push(
          {
            ...item,
            unit_price:product.price,
            total_price: totalPrice
          }
        );
    }


    for(const [sellerId,sellerItems] of Object.entries(groupedItems)){
      const totalAmount = sellerItems.reduce((sum,item) => sum + item.total_price, 0);

      const orderResult =await db.query(
        `INSERT INTO orders (buyer_id, order_date, total_amount, status, address)
        VALUES ($1, NOW(), $2, 'Pending', $3) RETURNING id`,
        [buyerId, totalAmount, address]

      );

      const orderId = orderResult.rows[0].id;
      for(const item of sellerItems){
        await db.query(
          `INSERT INTO orderitems (order_id, product_id, quantity, unit_price, total_price)
           VALUES ($1, $2, $3, $4, $5)`,
           [orderId,item.product_id,item.quantity,item.unit_price,item.total_price]
        );
      await db.query(
          `UPDATE products
           SET quantity = quantity - $1
           WHERE id = $2 AND quantity >= $1`,
           [item.quantity, item.product_id]
        );
        }
    }


    await db.query('COMMIT');
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getOrderHistory = async (req, res) => {
  try {
    const buyerId = req.user.userId;

    const orderResult = await req.db.query(
      `SELECT * FROM orders WHERE buyer_id = $1 ORDER BY order_date DESC`,
      [buyerId]
    );

    const orders = [];

    for (const order of orderResult.rows) {
      const itemsResult = await req.db.query(
        `SELECT oi.*, p.name AS product_name
         FROM orderitems oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1`,
        [order.id]
      );

      orders.push({
        ...order,
        items: itemsResult.rows
      });
    }

    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.userId;

    const result = await req.db.query(`
      SELECT o.id AS order_id, o.order_date, o.status, o.address, o.total_amount,
             oi.product_id, oi.quantity, oi.unit_price, oi.total_price,
             p.name AS product_name,
             u.username AS buyer_name
      FROM orders o
      JOIN orderitems oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN users u ON o.buyer_id = u.id
      WHERE p.seller_id = $1
      ORDER BY o.order_date DESC
    `, [sellerId]);

    const groupedOrders = {};

    for (const row of result.rows) {
      if (!groupedOrders[row.order_id]) {
        groupedOrders[row.order_id] = {
          order_id: row.order_id,
          order_date: row.order_date,
          status: row.status,
          address: row.address,
          total_amount: row.total_amount,
          buyer_name: row.buyer_name,
          items: []
        };
      }

      groupedOrders[row.order_id].items.push({
        product_id: row.product_id,
        product_name: row.product_name,
        quantity: row.quantity,
        unit_price: row.unit_price,
        total_price: row.total_price
      });
    }

    res.status(200).json({ orders: Object.values(groupedOrders) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const sellerId = parseInt(req.user.userId); 
    const role = req.user.role;
    const orderId = parseInt(req.params.orderId); 
    const { status } = req.body;


    const allowedStatuses = ['Pending', 'Shipped', 'Completed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const checkResult = await req.db.query(
      `SELECT 1
       FROM orderitems oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1 AND p.seller_id = $2
       LIMIT 1`,
      [orderId, sellerId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to update this order' });
    }

    await req.db.query(
      `UPDATE orders SET status = $1 WHERE id = $2`,
      [status, orderId]
    );

    res.status(200).json({ message: `Order status updated to ${status}` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { placeOrder, getOrderHistory,getSellerOrders,updateOrderStatus };
