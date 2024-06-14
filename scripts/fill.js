'use server';
require('dotenv').config();
const { db } = require('@vercel/postgres');

async function createTodo() {
  try {
    const client = await db.connect();
    console.log('Connected to the database');

    await client.sql`
      INSERT INTO todos (text, completed, year, month, day, week_of_month)
      VALUES ('Example todo', false, 2024, 6, 10, 2)
    `;
    console.log('Inserted one todo item into the "todos" table');

    client.release();
  } catch (error) {
    console.error('Ошибка при вставке данных в таблицу:', error);
    throw error;
  }
}

createTodo();
  