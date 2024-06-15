"use client";
import React, { useState, useEffect } from "react";
import Weeklist from "./Week";
import { TodoDto } from "./lib/defs";
import styles from "./page.module.css";
import { getDays, isDayOff } from "./lib/functions";
import { months, daysOfWeek } from "./lib/defs";
import TodoListModal from "./Todo";

const arrow = { width: "30px", height: "100%", border: "none" };

export default function Home() {
  const [year, setYear] = useState(2024);
  const [uName, setName] = useState("");
  const [month, setMonth] = useState(5);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [day, setDay] = useState(1);
  const [holidays, setHolidays] = useState<number[]>([]);
  const [weekTasks, setWeekTasks] = useState<TodoDto[]>([]);
  const [openWeek, setOpenWeek] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number>(0);
  const days = getDays(year, month);
  useEffect(() => {
    const your_name = prompt("Enter your name") || "User";
    setName(your_name.toUpperCase());
    alert(`hellow, ${your_name}`);
  }, []);
  {
    /*useEffect(() => {
    const fetchHolidays = async () => {
      const promises = days.map((dayObj) =>
        isDayOff(year, month - 1, dayObj.date),
      );
      const results = await Promise.all(promises);
      const newHolidays = days.filter((dayObj, index) => results[index]);
      setHolidays(newHolidays.map((dayObj) => dayObj.date));
    };
    fetchHolidays();
  }, [year, month, days]);*/
  }
  const shift = days[0].dayOfWeek - 1;
  const hideForModal: React.CSSProperties = {
    opacity: open || openWeek ? "0" : "1",
    pointerEvents: open ? "none" : "auto",
    transition: "opacity 0.3s ease",
  };
  const onHover = { background: "rgb(184, 184, 53)" };

  function openModal(
    e: React.MouseEvent<HTMLButtonElement>,
    day: number,
    week: number,
  ) {
    setOpen(true);
    setDay(day);
    setSelectedWeek(week);
    e.stopPropagation();
  }
  function openWeekModal(weekIndex: number) {
    if (!open) {
      const tasks: TodoDto[] = [];
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const dayNumber = weekIndex * 7 + dayIndex - shift;
        if (dayNumber >= 1 && dayNumber <= days.length) {
          const dayTasks = JSON.parse(
            localStorage.getItem(
              `todo_${year}_${month}_${dayNumber}_${uName}`,
            ) || "[]",
          );
          tasks.push(...dayTasks);
        }
      }

      setOpenWeek(true);

      setSelectedWeek(weekIndex + 1);
    }
  }
  const dayOff = { color: "red" };
  return (
    <main className={styles.container}>
      <div className={styles.selector} style={hideForModal}>
        <select
          name="year"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
        <select
          name="month"
          value={month}
          style={hideForModal}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
      <table className={styles.calendar}>
        <thead style={hideForModal}>
          <tr>
            {daysOfWeek.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(Math.ceil((days.length + shift) / 7))
            .fill(null)
            .map((_, weekIndex) => (
              <tr className={styles.week} key={weekIndex}>
                {Array(7)
                  .fill(null)
                  .map((_, dayIndex) => {
                    const dayNumber = weekIndex * 7 + dayIndex - shift + 1;
                    if (dayNumber < 1 || dayNumber > days.length) {
                      return (
                        <td
                          className={styles.td}
                          style={hideForModal}
                          key={dayIndex}
                        >
                          {dayIndex === 0 && (
                            <button
                              style={arrow}
                              onClick={() => openWeekModal(weekIndex)}
                              className={styles.arrow}
                            >
                              &gt;
                            </button>
                          )}
                        </td>
                      );
                    } else {
                      return (
                        <td className={styles.td} key={dayIndex}>
                          {dayIndex % 7 === 0 && (
                            <button
                              style={arrow}
                              onClick={() => openWeekModal(weekIndex)}
                              className={styles.arrow}
                            >
                              &gt;
                            </button>
                          )}
                          <button
                            style={hideForModal}
                            className={styles.todoButton}
                            onClick={(e) => {
                              openModal(e, dayNumber, weekIndex + 1);
                            }}
                          >
                            <span
                              style={holidays.includes(dayNumber) ? dayOff : {}}
                            >
                              {dayNumber}
                            </span>
                          </button>
                          {open && day === dayNumber && (
                            <TodoListModal
                              username={uName}
                              close={() => setOpen(false)}
                              day={day}
                              week_index={selectedWeek}
                              month={month}
                              year={year}
                            />
                          )}
                        </td>
                      );
                    }
                  })}
              </tr>
            ))}
        </tbody>
      </table>
      {openWeek && (
        <Weeklist
          username={uName}
          year={year}
          month={month}
          tasks={weekTasks}
          close={() => setOpenWeek(false)}
          week_index={selectedWeek}
        />
      )}
    </main>
  );
}
