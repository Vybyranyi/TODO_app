import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import sequelize from './config/db.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Таблиці синхронізовані з базою');
    app.listen(PORT, () => {
      console.log(`Сервер запущено на http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Помилка при синхронізації бази:', err);
  });
