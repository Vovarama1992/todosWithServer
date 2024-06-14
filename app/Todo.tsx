"use client";
import {
  useGetTodosByDayQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "./lib/api";

import React, { useState } from "react";
import { formatNumber } from "./lib/functions";
import Image from "next/image";

import { TodoDto, TodoProps } from "./lib/defs";
import styles from "./page.module.css";
const changeInput = { width: "300px" };
const changer = {
  width: "auto",
  height: "20px",
  marginLeft: "5px",
  background: "transparent",
};

export default function TodoListModal({
  day,
  month,
  year,
  week_index,
  username,
  close,
}: TodoProps) {
  const [selectedId, setSelect] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [input, turnInput] = useState(false);
  const { data: todos = [], isLoading } = useGetTodosByDayQuery({
    year,
    month,
    day,
    user_name: username,
  });
  const sortedTodos = [...todos].sort((a, b) => a.id - b.id);
  const [addTodo, { isLoading: isAdding }] = useAddTodoMutation();
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();

  function onTurn(id: number | null) {
    turnInput(true);
    setSelect(id);
  }

  const handleAddTodo = () => {
    const newTodo: TodoDto = {
      id: Math.random() * 1000000,
      text: text,
      year: year,
      month: month,
      day: day,
      week_of_month: week_index,
      user_name: username,
      completed: false,
    };
    console.log("Creating new todo:", newTodo);

    addTodo(newTodo);
  };
  const handleChangeSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    id: number,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTodoText = formData.get("newvalue") as string;
    if (newTodoText.trim()) {
      updateTodo({ text: newTodoText, id: id });
      e.currentTarget.reset();
    }
    turnInput(false);
  };
  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (isAdding) return <div className={styles.loading}>Adding...</div>;
  if (isUpdating) return <div className={styles.loading}>Updating...</div>;
  if (isDeleting) return <div className={styles.loading}>Deleting...</div>;
  return (
    <div className={styles.todo}>
      <p className={styles.todoTitle}>
        TodoList for {formatNumber(day)}.{formatNumber(month)}.{year}
      </p>
      <div className={styles.todoContent}>
        <div className={styles.form}>
          <input
            type="text"
            name="newtodo"
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleAddTodo}
            disabled={isAdding || !text.trim()}
            className={styles.changer}
            style={{ width: "39px", height: "39px" }}
            type="submit"
          >
            +
          </button>
        </div>
        {sortedTodos.length == 0 && (
          <p className={styles.empter}>is empty right now. Add something </p>
        )}
        {sortedTodos.map((todo: TodoDto, index: number) => (
          <div className={styles.todoItem} key={index}>
            {input && todo.id == selectedId ? (
              <form
                className={styles.changeZone}
                onSubmit={(e) => handleChangeSubmit(e, todo.id)}
              >
                <input
                  className={styles.changeInput}
                  style={changeInput}
                  type="text"
                  name="newvalue"
                />
                <button
                  style={{ height: "40px", width: "auto", marginLeft: "10px" }}
                  type="submit"
                >
                  Ok
                </button>
              </form>
            ) : (
              <>
                <input
                  type="checkbox"
                  id={`todo-${todo.id}`}
                  onChange={() =>
                    updateTodo({ completed: !todo.completed, id: todo.id })
                  }
                  checked={todo.completed}
                />
                <label htmlFor={`todo-${todo.id}`}>{todo.text}</label>
                <button onClick={() => onTurn(todo.id)} style={changer}>
                  <Image
                    src="/pencil.png"
                    width={25}
                    height={25}
                    alt="Pencil Icon"
                  />
                </button>
                <button
                  onClick={() => deleteTodo({ id: todo.id })}
                  style={changer}
                >
                  <Image
                    src="/trash.png"
                    width={25}
                    height={25}
                    alt="Trash Icon"
                  />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <button
        className={styles.closer}
        style={{ width: "42px", height: "42px", borderRadius: "6px" }}
        onClick={close}
      >
        X
      </button>
    </div>
  );
}
