import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Provide an valid email'),
    body('password').trim().notEmpty().withMessage('No password provided'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      next(new BadRequestError('User name or password incorrect'));
      return;
    }

    const passwordsMatch = await Password.compare(user.password, password);

    if (!passwordsMatch) {
      next(new BadRequestError('User name or password incorrect'));
      return;
    }

    const userJwt = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);
    req.session = { jwt: userJwt };
    res.status(200).send(user);
  }
);

export { router as signinRouter };
