import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Provide an valid email'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(new RequestValidationError(errors.array()));
    }
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      next(new BadRequestError('User already exists'));
    }

    const user = await User.build({ email, password });
    res.status(201).send(user);
  }
);

export { router as signupRouter };
