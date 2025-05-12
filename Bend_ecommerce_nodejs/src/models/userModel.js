const db = require('../config/db');

const createUser = async ({ username, email, passwordHash, fullName, roleId }) => {
  const result = await db.query(
    `INSERT INTO users (username, email, password_hash, full_name, role_id, created_at)
     VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
    [username, email, passwordHash, fullName, roleId]
  );
  return result.rows[0];
};

module.exports = { createUser };
