"use client";
import {
  useGetTodosByDayQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "./lib/api";
import { ActionType } from "./lib/defs";
import { todoReducer } from "./lib/functions";
import React, { useState, useReducer, useEffect } from "react";
import { formatNumber } from "./lib/functions";
import Image from "next/image";

import { TodoDto, Todo, TodoProps } from "./lib/defs";
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
  const { data: initialTodos = [], isLoading } = useGetTodosByDayQuery({
    year,
    month,
    day,
    user_name: username,
  });
  const [todos, dispatch] = useReducer(todoReducer, []);

  const [selectedId, setSelect] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [input, turnInput] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: "init", todos: initialTodos });
    }, 500);
  }, []);

  const sortedTodos = [...todos].sort((a, b) => a.id - b.id);
  const [addTodo, { isLoading: isAdding }] = useAddTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

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

    const { id, text: content } = newTodo;

    const payload: ActionType = {
      type: "added",
      id,
      content,
    };

    dispatch(payload);
    setText("");
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
      dispatch({ type: "changed", content: newTodoText, id: id });
      updateTodo({ text: newTodoText, id: id });
      e.currentTarget.reset();
    }
    turnInput(false);
  };
  const handleDelete = (id: number) => {
    deleteTodo({ id })
      .unwrap()
      .then((result) => {
        console.log(result.message);
      })
      .catch((error) => {
        console.error("Failed to delete the todo:", error.message);
      });
  };

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
            value={text}
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

        {isLoading ? (
          <p className={styles.empter}>...loading </p>
        ) : (
          <>
            {sortedTodos.length == 0 && (
              <p className={styles.empter}>
                is empty right now. Add something{" "}
              </p>
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
                      style={{
                        height: "40px",
                        width: "auto",
                        marginLeft: "10px",
                      }}
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
                      onChange={() => {
                        dispatch({ type: "completed", id: todo.id });
                        updateTodo({ completed: !todo.completed, id: todo.id });
                      }}
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
                      onClick={() => {
                        dispatch({ type: "delete", id: todo.id });
                        handleDelete(todo.id);
                      }}
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
          </>
        )}
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
