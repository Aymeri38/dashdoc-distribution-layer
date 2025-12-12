import express, { Application } from 'express';
import cors from 'cors';
import config from './config/config';
import healthRouter from './routes/health';
import scanRouter from './routes/scan';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', healthRouter);
app.use('/api/scan', scanRouter);

export default app;