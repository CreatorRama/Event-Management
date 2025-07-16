import  express from 'express'
import  Event from '../models/Event.js'
import  User from '../models/User.js'
import  Registration from '../models/Registrations.js'
import  { eventSchema, userSchema, registrationSchema } from '../validators/event-Validator.js'

const  router = express.Router()
// Create event
router.post('/', async (req, res, next) => {
  try {
    const { error, value } = eventSchema.validate(req.body);
    if (error) {
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      validationError.details = error.details;
      return next(validationError);
    }

    // Check if the date is in the future
    const eventDate = new Date(value.date_time);
    if (eventDate <= new Date()) {
      const dateError = new Error('Event date must be in the future');
      dateError.name = 'ValidationError';
      return next(dateError);
    }

    const event = await Event.create(value);
    res.status(201).json({
      message: 'Event created successfully',
      event_id: event.id,
      event: event
    });
  } catch (error) {
    next(error);
  }
});

// Get event details
router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      const notFoundError = new Error('Event not found');
      notFoundError.name = 'NotFoundError';
      return next(notFoundError);
    }

    res.json({
      event: {
        id: event.id,
        title: event.title,
        date_time: event.date_time,
        location: event.location,
        capacity: event.capacity,
        registration_count: parseInt(event.registration_count),
        registered_users: event.registered_users
      }
    });
  } catch (error) {
    next(error);
  }
});

// Register for event
router.post('/:id/register', async (req, res, next) => {
  try {
    const { error, value } = registrationSchema.validate({
      user_id: req.body.user_id,
      event_id: req.params.id
    });

    if (error) {
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      validationError.details = error.details;
      return next(validationError);
    }

    const registration = await Registration.create(value.user_id, value.event_id);
    res.status(201).json({
      message: 'Registration successful',
      registration: registration
    });
  } catch (error) {
    next(error);
  }
});

// Cancel registration
router.delete('/:id/register', async (req, res, next) => {
  try {
    const { error, value } = registrationSchema.validate({
      user_id: req.body.user_id,
      event_id: req.params.id
    });

    if (error) {
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      validationError.details = error.details;
      return next(validationError);
    }

    await Registration.cancel(value.user_id, value.event_id);
    res.json({
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get upcoming events
router.get('/', async (req, res, next) => {
  try {
    const events = await Event.getUpcomingEvents();
    res.json({
      events: events.map(event => ({
        id: event.id,
        title: event.title,
        date_time: event.date_time,
        location: event.location,
        capacity: event.capacity,
        registration_count: parseInt(event.registration_count),
        remaining_capacity: event.capacity - parseInt(event.registration_count)
      }))
    });
  } catch (error) {
    next(error);
  }
});

// Get event stats
router.get('/:id/stats', async (req, res, next) => {
  try {
    const stats = await Event.getEventStats(req.params.id);
    if (!stats) {
      const notFoundError = new Error('Event not found');
      notFoundError.name = 'NotFoundError';
      return next(notFoundError);
    }

    res.json({
      stats: {
        total_registrations: parseInt(stats.total_registrations),
        remaining_capacity: parseInt(stats.remaining_capacity),
        percentage_used: parseFloat(stats.percentage_used)
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;