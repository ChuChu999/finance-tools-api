import express from 'express';

export const helloWorldRouter: express.Router = express.Router();

helloWorldRouter.get('/', (req, res) => {
  res.send('Hello World!');
});
