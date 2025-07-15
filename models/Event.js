const pool = import('../config/db.js')

class Event {
  static async create(eventData) {
    const { title, date_time, location, capacity } = eventData;
    
    const query = `
      INSERT INTO events (title, date_time, location, capacity)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await pool.query(query, [title, date_time, location, capacity]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT e.*, 
             COUNT(er.id) as registration_count,
             COALESCE(
               JSON_AGG(
                 JSON_BUILD_OBJECT(
                   'id', u.id,
                   'name', u.name,
                   'email', u.email,
                   'registered_at', er.registered_at
                 )
               ) FILTER (WHERE u.id IS NOT NULL), 
               '[]'
             ) as registered_users
      FROM events e
      LEFT JOIN event_registrations er ON e.id = er.event_id
      LEFT JOIN users u ON er.user_id = u.id
      WHERE e.id = $1
      GROUP BY e.id
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getUpcomingEvents() {
    const query = `
      SELECT e.*, 
             COUNT(er.id) as registration_count
      FROM events e
      LEFT JOIN event_registrations er ON e.id = er.event_id
      WHERE e.date_time > NOW()
      GROUP BY e.id
      ORDER BY e.date_time ASC, e.location ASC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  static async getEventStats(eventId) {
    const query = `
      SELECT 
        e.capacity,
        COUNT(er.id) as total_registrations,
        e.capacity - COUNT(er.id) as remaining_capacity,
        CASE 
          WHEN e.capacity > 0 THEN ROUND((COUNT(er.id)::DECIMAL / e.capacity) * 100, 2)
          ELSE 0
        END as percentage_used
      FROM events e
      LEFT JOIN event_registrations er ON e.id = er.event_id
      WHERE e.id = $1
      GROUP BY e.id, e.capacity
    `;
    
    const result = await pool.query(query, [eventId]);
    return result.rows[0];
  }
}

export default Event;