import express from 'express';

const router = express.Router();

router.post('/signup', (req, res) => {
  res.send('Hi from signup user');
});

export { router as signupRouter };
