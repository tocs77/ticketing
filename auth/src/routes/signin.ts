import express from 'express';

const router = express.Router();

router.post('/signin', (req, res) => {
  res.send('Hi from signin');
});

export { router as signinRouter };
