import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('todos')
export class Todo {
  @PrimaryColumn('float')
  id: number;

  @Column()
  text: string;

  @Column({ default: false })
  completed: boolean;

  @Column()
  year: number;

  @Column()
  month: number;

  @Column()
  day: number | null;

  @Column()
  week_of_month: number;
  @Column()
  user_name: string;
}
export class UpdateDto {
  text?: string;

  completed?: boolean;
}
