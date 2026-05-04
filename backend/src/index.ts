import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dynamicRoutes from './routes/dynamicRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors({
  origin: [
    'https://dynamic-app-engine.vercel.app',
    'http://localhost:3000',
    'http://localhost:3002'
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', dynamicRoutes);

app.get('/', (req, res) => {
  res.send('Dynamic App Generator Backend is running! Use /api/config or /api/data/:modelName');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dynamic API Engine is running' });
});

app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
