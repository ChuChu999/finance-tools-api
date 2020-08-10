import express from 'express';
import swaggerUi, { SwaggerOptions } from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { helloWorldRouter } from './controllers/hello-world-controller';

const app = express();
const port: number = 8000;
const swaggerOptions: SwaggerOptions = {
  definition: {
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
  },
  apis: ['src/index.ts'],
};
const swaggerSpec: object = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', helloWorldRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
