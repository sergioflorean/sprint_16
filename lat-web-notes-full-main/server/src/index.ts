import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import noteRoutes from './routes/notes.js';
import authRoutes from './routes/auth.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: { status: 'ok' },
    error: null,
  });
});

app.use(noteRoutes);
app.use(authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI!, {
    maxPoolSize: 10,
  })

  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error de conexión', err);
    process.exit(1);
  });
