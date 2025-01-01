import express from 'express';
import cors from 'cors';
import groupRoutes from './routes/group.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Base route for group endpoints
app.use('/api/groups', groupRoutes);

export default app;
