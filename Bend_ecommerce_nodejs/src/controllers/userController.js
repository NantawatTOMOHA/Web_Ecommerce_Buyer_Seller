const client = require('../config/db');

const getUsers = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
};

module.exports = { getUsers };
