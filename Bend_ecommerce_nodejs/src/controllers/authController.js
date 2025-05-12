const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser} = require('../models/userModel');

const register = async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;

    if (role !== 'buyer' && role !== 'seller') {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const emailCheck = await req.db.query(
        `SELECT id FROM users WHERE email = $1`,
        [email]
      );
      if (emailCheck.rowCount > 0) {
        return res.status(400).json({ message: 'Email is already registered' });
      }

    const roleResult = await req.db.query(
      `SELECT id FROM roles WHERE name = $1`,
      [role]
    );
    if (roleResult.rowCount === 0) {
      return res.status(400).json({ message: 'Role not found' });
    }

    const roleId = roleResult.rows[0].id;

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      username,
      email,
      passwordHash,
      fullName,
      roleId
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const userResult = await req.db.query(
        `SELECT users.*, roles.name AS role
         FROM users
         JOIN roles ON users.role_id = roles.id
         WHERE users.email = $1`,
        [email]
      );
  
      if (userResult.rowCount === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const user = userResult.rows[0];
  
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.role 
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );
  
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
  
      res.status(200).json({ message: 'Login successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
const logout = (req, res) => {
    try {
      const token = req.cookies.authToken;
  
      if (!token) {
        return res.status(400).json({ message: 'No auth token found in cookies' });
      }
  
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
  
      res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
const getProfile = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      const result = await req.db.query(
        `SELECT u.id, u.username, u.email, r.name AS role, u.full_name, u.created_at
         FROM users u
         JOIN roles r ON u.role_id = r.id
         WHERE u.id = $1`,
        [userId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ user: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
const updateProfile = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { username, email, full_name, password } = req.body;
  
      if (!username && !email && !full_name && !password) {
        return res.status(400).json({ message: 'No data provided to update' });
      }
  
      const fields = [];
      const values = [];
      let paramIndex = 1;
  
      if (username) {
        fields.push(`username = $${paramIndex++}`);
        values.push(username);
      }
  
      if (email) {
        fields.push(`email = $${paramIndex++}`);
        values.push(email);
      }
  
      if (full_name) {
        fields.push(`full_name = $${paramIndex++}`);
        values.push(full_name);
      }
  
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        fields.push(`password = $${paramIndex++}`);
        values.push(hashedPassword);
      }
  
      values.push(userId); 
      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, username, email, full_name`;
  
      const result = await req.db.query(query, values);
  
      res.status(200).json({ message: 'Profile updated successfully', user: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  
module.exports = { register,login,logout,getProfile,updateProfile };
