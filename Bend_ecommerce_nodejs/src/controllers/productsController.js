const crypto = require('crypto');
const ENCRYPTION_KEY = process.env.IMAGE_ENCRYPT_KEY;
const IV_LENGTH = 16;
const ALGORITHM = 'aes-256-cbc';

if (!ENCRYPTION_KEY) {
  throw new Error('Missing IMAGE_ENCRYPT_KEY in .env');
}

function isValidBase64Image(base64String) {
  const regex = /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/;
  return regex.test(base64String);
}

function parseBase64Image(base64String) {
  const matches = base64String.match(/^data:image\/(jpeg|png);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 image format');
  }
  const imageBuffer = Buffer.from(matches[2], 'base64');
  return imageBuffer;
}

function encrypt(buffer) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return Buffer.concat([iv, encrypted]);
}

function decryptImage(encryptedBuffer) {
  const iv = encryptedBuffer.slice(0, IV_LENGTH);
  const encryptedText = encryptedBuffer.slice(IV_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  return Buffer.concat([decipher.update(encryptedText), decipher.final()]);
}

const addProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, image_base64  } = req.body;
    const sellerId = req.user.userId;

    if (!name || !price || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let encryptedImage = null;
    if (image_base64) {
      if (!isValidBase64Image(image_base64)) {
        return res.status(400).json({ message: 'Invalid base64 image format' });
      }
      const imageBuffer = parseBase64Image(image_base64);
      encryptedImage = encrypt(imageBuffer);
    }

    const result = await req.db.query(
      `INSERT INTO products (name, description, price, seller_id, created_at, image, quantity, is_deleted)
       VALUES ($1, $2, $3, $4, NOW(), $5, $6, FALSE)
       RETURNING *`,
      [name, description, price, sellerId, encryptedImage, quantity]
    );

    res.status(201).json({ message: 'Product added successfully', product: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT p.*, u.username AS seller_name
       FROM products p
       JOIN users u ON p.seller_id = u.id
       WHERE p.is_deleted = FALSE
       ORDER BY p.created_at DESC`
    );

    const products = result.rows.map((product) => {
      let imageBase64 = null;
      if (product.image) {
        try {
          const decryptedImage = decryptImage(product.image);
          imageBase64 = `data:image/jpeg;base64,${decryptedImage.toString('base64')}`;
        } catch (error) {
          console.error('Failed to decrypt image:', error.message);
        }
      }
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        created_at: product.created_at,
        seller_name: product.seller_name,
        image_base64: imageBase64
      };
    });

    res.status(200).json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductById = async (req, res) => {
  const db = req.db;
  const productId = parseInt(req.params.id);

  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const result = await db.query(
      `SELECT p.*, u.username AS seller_name
       FROM products p
       JOIN users u ON p.seller_id = u.id
       WHERE p.id = $1 AND p.is_deleted = FALSE`,
      [productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = result.rows[0];
    let imageBase64 = null;

    if (product.image) {
      try {
        const decryptedImage = decryptImage(product.image);
        imageBase64 = `data:image/jpeg;base64,${decryptedImage.toString('base64')}`;
      } catch (error) {
        console.error('Failed to decrypt image:', error.message);
      }
    }

    res.status(200).json({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      created_at: product.created_at,
      seller_name: product.seller_name,
      image_base64: imageBase64
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const searchProducts = async (req, res) => {
  try {
    const keyword = req.params.keyword;
    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({ message: 'Keyword is required' });
    }

    const result = await req.db.query(
      `SELECT * FROM products WHERE name ILIKE $1 AND is_deleted = FALSE`,
      [`%${keyword}%`]
    );

    const products = result.rows.map((product) => {
      let imageBase64 = null;
      if (product.image) {
        try {
          const decryptedImage = decryptImage(product.image);
          imageBase64 = `data:image/jpeg;base64,${decryptedImage.toString('base64')}`;
        } catch (error) {
          console.error('Failed to decrypt image:', error.message);
        }
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        created_at: product.created_at,
        image_base64: imageBase64
      };
    });

    res.status(200).json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const result = await req.db.query(
      `SELECT p.*, u.username AS seller_name
       FROM products p
       JOIN users u ON p.seller_id = u.id
       WHERE p.seller_id = $1 AND p.is_deleted = FALSE
       ORDER BY p.created_at DESC`,
      [sellerId]
    );

    const products = result.rows.map((product) => {
      let imageBase64 = null;
      if (product.image) {
        try {
          const decryptedImage = decryptImage(product.image);
          imageBase64 = `data:image/jpeg;base64,${decryptedImage.toString('base64')}`;
        } catch (error) {
          console.error('Failed to decrypt image:', error.message);
        }
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        created_at: product.created_at,
        seller_name: product.seller_name,
        image_base64: imageBase64
      };
    });

    res.status(200).json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const productId = req.params.id;

    const product = await req.db.query(
      `SELECT * FROM products WHERE id = $1 AND seller_id = $2`,
      [productId, sellerId]
    );

    if (product.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await req.db.query(`UPDATE products SET is_deleted = TRUE WHERE id = $1`, [productId]);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const productId = req.params.id;
    const { name, description, price, quantity,image_base64  } = req.body;


    const productCheck = await req.db.query(
      'SELECT * FROM products WHERE id = $1 AND seller_id = $2 AND is_deleted = FALSE',
      [productId, sellerId]
    );

    if (productCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }

    let encryptedImage = productCheck.rows[0].image;
    if (image_base64) {
      if (!isValidBase64Image(image_base64)) {
        return res.status(400).json({ message: 'Invalid image format' });
      }

      const imageBuffer = parseBase64Image(image_base64);
      if (!imageBuffer) {
        return res.status(400).json({ message: 'Invalid base64 image data' });
      }

      encryptedImage = encrypt(imageBuffer);
    }

    const result = await req.db.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, quantity = $4, image = $5 
       WHERE id = $6 RETURNING *`,
      [name || productCheck.rows[0].name,
       description || productCheck.rows[0].description,
       price || productCheck.rows[0].price,
       quantity || productCheck.rows[0].quantity,
       encryptedImage,
       productId]
    );

    res.status(200).json({ message: 'Product updated', product: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const searchMyProducts = async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const sellerId = req.user.userId;

    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({ message: 'Keyword is required' });
    }

    const result = await req.db.query(
      `SELECT p.*, u.username AS seller_name
       FROM products p
       JOIN users u ON p.seller_id = u.id
       WHERE p.seller_id = $1
         AND p.is_deleted = false
         AND p.name ILIKE $2
       ORDER BY p.created_at DESC`,
      [sellerId, `%${keyword}%`]
    );

    const products = result.rows.map((product) => {
      let imageBase64 = null;

      if (product.image) {
        try {
          const decryptedImage = decryptImage(product.image);
          imageBase64 = `data:image/jpeg;base64,${decryptedImage.toString('base64')}`;
        } catch (error) {
          console.error('Failed to decrypt image:', error.message);
        }
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        created_at: product.created_at,
        seller_name: product.seller_name,
        image_base64: imageBase64
      };
    });

    res.status(200).json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {addProduct,getAllProducts,getProductById,getMyProducts,updateProduct,deleteProduct,searchProducts,searchMyProducts};
