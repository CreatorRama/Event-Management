import express from "express";
import User from "../models/User";
import { userSchema } from "../validators/event-Validator";

const router=express.Router()


router.post('/', async (req, res, next) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details.map(detail => detail.message)
      });
    }

    const user = await User.create(value);
    res.status(201).json({
      message: 'User created successfully',
      user: user
    });
  } catch (error) {
    next(error);
  }
});


router.get('/', async (req, res, next) => {
  try {
    const users = await User.getAll();
    res.json({ users });
  } catch (error) {
    next(error);
  }
});


router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

export default router