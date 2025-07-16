import  {pool} from '../config/db.js'

class Registration {
  static async create(userId, eventId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check if event exists and is in the future
      const eventQuery = 'SELECT * FROM events WHERE id = $1';
      const eventResult = await client.query(eventQuery, [eventId]);
      
      if (eventResult.rows.length === 0) {
        throw new Error('Event not found');
      }
      
      const event = eventResult.rows[0];
      if (new Date(event.date_time) <= new Date()) {
        throw new Error('Cannot register for past events');
      }
      
      // Check if user exists
      const userQuery = 'SELECT * FROM users WHERE id = $1';
      const userResult = await client.query(userQuery, [userId]);
      
      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }
      
      // Check if user is already registered
      const existingQuery = 'SELECT * FROM event_registrations WHERE user_id = $1 AND event_id = $2';
      const existingResult = await client.query(existingQuery, [userId, eventId]);
      
      if (existingResult.rows.length > 0) {
        throw new Error('User is already registered for this event');
      }
      
      // Check capacity
      const capacityQuery = `
        SELECT e.capacity, COUNT(er.id) as current_registrations
        FROM events e
        LEFT JOIN event_registrations er ON e.id = er.event_id
        WHERE e.id = $1
        GROUP BY e.id, e.capacity
      `;
      const capacityResult = await client.query(capacityQuery, [eventId]);
      const { capacity, current_registrations } = capacityResult.rows[0];
      
      if (current_registrations >= capacity) {
        throw new Error('Event is full');
      }
      
      // Create registration
      const insertQuery = `
        INSERT INTO event_registrations (user_id, event_id)
        VALUES ($1, $2)
        RETURNING *
      `;
      const result = await client.query(insertQuery, [userId, eventId]);
      
      await client.query('COMMIT');
      return result.rows[0];
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async cancel(userId, eventId) {
    const query = `
      DELETE FROM event_registrations
      WHERE user_id = $1 AND event_id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [userId, eventId]);
    
    if (result.rows.length === 0) {
      throw new Error('Registration not found');
    }
    
    return result.rows[0];
  }
}

export default Registration;