import express from 'express';
import { routes } from './routes/index';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger.json';

export class App { 
    public express: express.Application;
    
    constructor() {
        this.express = express();
        this.middleware();
        this.database();
        this.router();
        this.swagger();
    }

    private middleware() {
        this.express.use(express.json());
        this.express.use(cors());
    }

    private database () {
        mongoose.connect(`${process.env.MONGO_URL}`);
    }
    
    private router() {
        this.express.use(routes);
    }

    private swagger() {
        this.express.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
    }
}