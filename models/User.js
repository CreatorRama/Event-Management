const pool = import('../config/db.js')

class User {
  static async create(userData) {
    const { name, email } = userData;
    
    const query = `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async getAll() {
    const query = 'SELECT * FROM users ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
  }
}

export  default User;