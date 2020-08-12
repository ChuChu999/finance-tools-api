import express from 'express';
import core from 'express-serve-static-core';
import helmet from 'helmet';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi, { JsonObject } from 'swagger-ui-express';
import { assetAllocationRouter } from './controllers/asset-allocation.controller';
import { helloWorldRouter } from './controllers/hello-world.controller';
import { apiErrorMiddleware } from './middleware/api-error.middleware';

const app: core.Express = express();
const port = 8000;

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    info: {
      title: 'Finance Tools API',
      version: '1.0.0',
    },
  },
  apis: ['./src/controllers/*.ts'],
};

const swaggerSpec: JsonObject = swaggerJSDoc(swaggerOptions);

app.use(helmet());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(helloWorldRouter);
app.use(assetAllocationRouter);
app.use(apiErrorMiddleware);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
  console.log(`See API documentation at http://localhost:${port}/api-docs`);
});
