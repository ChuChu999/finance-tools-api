import express from 'express';

export const helloWorldRouter: express.Router = express.Router();

/**
 * @swagger
 *
 * /hello-world:
 *   get:
 *     description: Hello world request
 *     tags:
 *       - Hello World
 *     responses:
 *       200:
 *         description: OK
 */
helloWorldRouter.get('/hello-world', (req, res) => {
  res.json({ response: 'Hello World!' });
});
