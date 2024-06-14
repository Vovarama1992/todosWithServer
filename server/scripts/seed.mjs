'use server';
import dotenv from 'dotenv';
import { db } from '@vercel/postgres';

dotenv.config();

async function updateColumnType() {
  try {
    await db.sql`
      ALTER TABLE todos
      ALTER COLUMN id TYPE float USING id::float;
    `;
    console.log('Тип данных столбца id успешно изменен на float');
  } catch (error) {
    console.error('Ошибка при изменении типа данных столбца id:', error);
    throw error;
  }
}

updateColumnType();
