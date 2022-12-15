import express from 'express';

const router = express.Router();

router.post('/signout', (req, res) => {
  res.send('Hi from sugnout user');
});

export { router as signoutRouter };
