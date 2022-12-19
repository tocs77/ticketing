import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Provide an valid email'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new BadRequestError('User already exists'));
    }

    const user = await User.build({ email, password });

    const userJwt = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);

    req.session = { jwt: userJwt };
    res.status(201).send(user);
  }
);

export { router as signupRouter };
