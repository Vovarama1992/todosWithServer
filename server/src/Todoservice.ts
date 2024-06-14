import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo, UpdateDto } from './todo.entity/types';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async create(data: Todo): Promise<Todo> {
    const newTodo = this.todoRepository.create(data);
    const savedTodo = await this.todoRepository.save(newTodo);
    return savedTodo;
  }

  async getByDay(
    year: number,
    month: number,
    day: number,
    userName: string,
  ): Promise<Todo[]> {
    return this.todoRepository.find({
      where: {
        year: year,
        month: month,
        day: day,
        user_name: userName,
      },
    });
  }
  async getByWeek(
    year: number,
    month: number,
    week_of_month: number,
    user_name: string,
  ): Promise<Todo[]> {
    return this.todoRepository.find({
      where: {
        year: year,
        month: month,
        week_of_month: week_of_month,
        user_name: user_name,
      },
    });
  }

  async updateTodo(id: number, updateData: UpdateDto): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });

    if (!todo) {
      throw new Error(`Todo with ID ${id} not found`);
    }

    Object.assign(todo, updateData);
    return this.todoRepository.save(todo);
  }
  async deleteTodo(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });

    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }

    await this.todoRepository.remove(todo);
    return todo;
  }
}
