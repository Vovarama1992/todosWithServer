import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TodoDto, PutDto, GetTodosByDayParams } from "./defs";

const TODO_TAG = "todos";

export const todosApi = createApi({
  reducerPath: "todosApi",
  tagTypes: [TODO_TAG],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }), // Установка базового URL
  endpoints: (builder) => ({
    getTodosByDay: builder.query<TodoDto[], GetTodosByDayParams>({
      query: ({ year, month, day, user_name }) => ({
        url: `/todos/by-day`,
        params: { year, month, day, user_name },
      }),
      providesTags: (result, error, { year, month, day, user_name }) => [
        { type: TODO_TAG, id: `${year}-${month}-${day}-${user_name}` },
      ],
    }),
    getTodosByWeek: builder.query<TodoDto[], GetTodosByDayParams>({
      query: ({ year, month, week_of_month, user_name }) => ({
        url: `/todos/by-week`,
        params: { year, month, week_of_month, user_name },
      }),
      providesTags: (
        result,
        error,
        { year, month, week_of_month, user_name },
      ) => [
        {
          type: TODO_TAG,
          id: `${year}-${month}-W${week_of_month}-${user_name}`,
        },
      ],
    }),
    addTodo: builder.mutation<TodoDto, TodoDto>({
      query: (newTodo) => ({
        url: "/todos",
        method: "POST",
        body: newTodo,
      }),
      invalidatesTags: (
        result,
        error,
        { year, month, day, week_of_month, user_name },
      ) =>
        !error
          ? [
              { type: TODO_TAG, id: `${year}-${month}-${day}-${user_name}` },
              {
                type: TODO_TAG,
                id: `${year}-${month}-W${week_of_month}-${user_name}`,
              },
            ]
          : [],
    }),
    updateTodo: builder.mutation<TodoDto, PutDto>({
      query: ({ id, ...patch }) => ({
        url: `/todos/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error) =>
        !error && result
          ? [
              {
                type: TODO_TAG,
                id: `${result.year}-${result.month}-${result.day}-${result.user_name}`,
              },
              {
                type: TODO_TAG,
                id: `${result.year}-${result.month}-W${result.week_of_month}-${result.user_name}`,
              },
            ]
          : [],
    }),
    deleteTodo: builder.mutation<TodoDto, { id: number }>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error) =>
        !error && result
          ? [
              {
                type: TODO_TAG,
                id: `${result.year}-${result.month}-${result.day}-${result.user_name}`,
              },
              {
                type: TODO_TAG,
                id: `${result.year}-${result.month}-W${result.week_of_month}-${result.user_name}`,
              },
            ]
          : [],
    }),
  }),
});

export const {
  useGetTodosByDayQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useGetTodosByWeekQuery,
} = todosApi;
