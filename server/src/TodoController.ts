import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { TodoService } from './Todoservice';
import { Todo, UpdateDto } from './todo.entity/types';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async create(@Body() data: Todo): Promise<Todo> {
    const createdTodo = await this.todoService.create(data);
    return createdTodo;
  }
  @Get()
  hello() {
    return 'hello world';
  }

  @Get('by-day')
  async getByDay(
    @Query('year') year: number,
    @Query('month') month: number,
    @Query('day') day: number,
    @Query('user_name') userName: string,
  ): Promise<Todo[]> {
    return this.todoService.getByDay(year, month, day, userName);
  }
  @Get('by-week')
  async getByWeek(
    @Query('year') year: number,
    @Query('month') month: number,
    @Query('week_of_month') week_of_month: number,
    @Query('user_name') userName: string,
  ): Promise<Todo[]> {
    return this.todoService.getByWeek(year, month, week_of_month, userName);
  }
  @Put(':id')
  async updateTodo(
    @Param('id') id: number,
    @Body() updateData: UpdateDto,
  ): Promise<Todo> {
    return this.todoService.updateTodo(id, updateData);
  }
  @Delete(':id')
  async deleteTodo(@Param('id') id: number): Promise<Todo> {
    return this.todoService.deleteTodo(id);
  }
}
