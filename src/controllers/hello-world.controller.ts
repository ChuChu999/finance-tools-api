import express, { Request, Response } from 'express';
import { asyncHandlerMiddleware } from '../middleware/async-handler.middleware';

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
helloWorldRouter.get(
  '/hello-world',
  asyncHandlerMiddleware(
    async (req: Request, res: Response): Promise<void> => {
      res.json({ response: 'Hello World!' });
    }
  )
);
