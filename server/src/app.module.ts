import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity/types';
import { TodoController } from './TodoController';
import { TodoService } from './Todoservice';
import { config } from 'dotenv';
import { parse } from 'pg-connection-string';

// Загрузка переменных окружения
config();

// Парсинг URL из переменной окружения
const dbUrl = process.env.POSTGRES_URL;
if (!dbUrl) {
  throw new Error('Database connection URL not set in environment variables.');
}

const connectionOptions = parse(dbUrl);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: connectionOptions.host,
      port: parseInt(connectionOptions.port, 10),
      username: connectionOptions.user,
      password: connectionOptions.password,
      database: connectionOptions.database,
      ssl: { rejectUnauthorized: false }, // включение SSL
      entities: [Todo],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Todo]),
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class AppModule {}
