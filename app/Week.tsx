"use client";
import React, { useState } from "react";
import {
  useGetTodosByWeekQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "./lib/api";
import { months } from "./lib/defs";
import { WeekProps, Todo } from "./lib/defs";
import styles from "./page.module.css";
import Image from "next/image";
const changeInput = { width: "300px" };
const changer = {
  width: "auto",
  height: "20px",
  border: "none",
  marginLeft: "5px",
  background: "transparent",
};
function monthNamer(num: number) {
  const goal = months.find((month) => month.value == num);
  if (goal) {
    return goal.name;
  } else return;
}

const weekStyle = { background: "rgb(158, 122, 192)" };

export default function Weeklist({
  year,
  month,

  close,
  username,
  week,
}: WeekProps) {
  const [input, turnInput] = useState(false);
  const [selectedId, setSelect] = useState<number | null>(null);

  const monthName = monthNamer(month);

  function onTurn(id: number | null) {
    turnInput(true);
    setSelect(id);
  }
  const { data: todos = [], isLoading } = useGetTodosByWeekQuery({
    year,
    month,
    week_of_month: week,
    user_name: username,
  });
  const sortedTodos = [...todos].sort((a, b) => a.id - b.id);
  const [addTodo, { isLoading: isAdding }] = useAddTodoMutation();
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();
  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get("newtodo") as string;
    const newTodo = {
      id: Math.random() * 1000000,
      text: text,
      year: year,
      month: month,
      day: null,
      week_of_month: week,
      user_name: username,
      completed: false,
    };
    console.log("Creating new todo:", newTodo);

    if (text.trim()) {
      addTodo(newTodo)
        .unwrap()
        .then((response) => {
          console.log(response.message);
          console.log(response.todo);
        })
        .catch((error) => {
          console.error("Error adding todo:", error);
        });
    }
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
    <div className={styles.todo} style={weekStyle}>
      <p className={styles.todoTitle}>
        TodoList for {week} week of {monthName}
      </p>
      <div className={styles.todoContent}>
        <form className={styles.form} onSubmit={handleAddTodo}>
          <input type="text" name="newtodo" />
          <button
            disabled={isAdding}
            className={styles.changer}
            style={{ width: "39px", height: "39px" }}
            type="submit"
          >
            +
          </button>
        </form>
        {sortedTodos.length == 0 && (
          <p className={styles.empter}>is empty right now. Add something </p>
        )}
        {sortedTodos.map((todo: Todo, index: number) => (
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
                <button onClick={() => deleteTodo(todo.id)} style={changer}>
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
