export const months = [
  { name: "January", value: 1 },
  { name: "February", value: 2 },
  { name: "March", value: 3 },
  { name: "April", value: 4 },
  { name: "May", value: 5 },
  { name: "June", value: 6 },
  { name: "July", value: 7 },
  { name: "August", value: 8 },
  { name: "September", value: 9 },
  { name: "October", value: 10 },
  { name: "November", value: 11 },
  { name: "December", value: 12 },
];
export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
type title = {
  text: string;
};
type completed = {
  completed: boolean;
};
type Day = {
  day: number;
};
type Week = {
  week_of_month: number;
};
export type PutDto = (title | completed) & { id: number };

export type TodoDto = {
  id: number;
  text: string;
  year: number;
  month: number;
  day: number | null;
  week_of_month: number;
  user_name: string;
  completed: boolean;
};
export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export type CreateDto = {
  message: string;
  todo: TodoDto;
  id: number;
};
type GetTodosByParams = {
  year: number;
  month: number;

  user_name: string;
};
export type GetTodosByDayParams = GetTodosByParams & Day;

export type GetTodosByWeekParams = GetTodosByParams & Week;
export type ActionType =
  | { type: "init"; todos: TodoDto[] }
  | { type: "added"; content: string; id: number }
  | { type: "delete"; id: number }
  | { type: "changed"; id: number; content: string }
  | { type: "completed"; id: number };

export type TodoProps = {
  day: number;
  month: number;
  week_index: number;
  username: string;
  year: number;
  close: () => void;
};
export type WeekProps = Omit<TodoProps, "day"> & { tasks: TodoDto[] };
