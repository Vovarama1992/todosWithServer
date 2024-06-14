import { Todo, ActionType } from "./defs";
export function getDays(year: number, month: number) {
  const daysOfWeek = [7, 1, 2, 3, 4, 5, 6];
  const date = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const result = [];

  for (let day = 1; day <= daysInMonth; day++) {
    date.setDate(day);
    const dayOfWeek = daysOfWeek[date.getDay()];
    result.push({ date: day, dayOfWeek: dayOfWeek });
  }

  return result;
}

export function formatNumber(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

export async function isDayOff(year: number, month: number, day: number) {
  const formattedMonth = formatNumber(month + 1);
  const formattedDay = formatNumber(day);

  const date = `${year}-${formattedMonth}-${formattedDay}`;
  try {
    const response = await fetch(`https://isdayoff.ru/${date}`);

    const json = await response.json();
    return json == 1;
  } catch (error) {
    console.error("Ошибка при выполнении запроса к isDayOff API:", error);
    return false;
  }
}

export function todoReducer(todos: Todo[], action: ActionType): Todo[] {
  switch (action.type) {
    case "init": {
      return action.payload; 
    }
    case "added": {
      return [
        ...todos,
        {
          id: action.id,
          text: action.content,
          completed: false,
        },
      ];
    }
    case "delete": {
      return todos.filter((todo) => todo.id !== action.id);
    }
    case "changed": {
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, text: action.content } : todo
      );
    }
    case "completed": {
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      );
    }
    default: {
      return todos;
    }
  }
}

export function saveTasksToLocalStorage(
  year: number,
  month: number,
  weekIndex: number,
  username: string,
  todos: Todo[],
) {
  const storageKey = `tasks_${year}_${month}_${weekIndex}_${username}`;
  localStorage.setItem(storageKey, JSON.stringify(todos));
}
export function loadTasksFromLocalStorage(
  year: number,
  month: number,
  weekIndex: number,
  username: string,
): Todo[] {
  const storageKey = `tasks_${year}_${month}_${weekIndex}_${username}`;
  const storedTasks = localStorage.getItem(storageKey);
  return storedTasks ? JSON.parse(storedTasks) : [];
}
export function mergeDayAndWeekTasks(
  weekTasks: Todo[],
  dayTasks: Todo[],
): Todo[] {
  function identer(dayTasks: Todo[], id: number) {
    let res = false;
    for (const day of dayTasks) {
      if (day.id == id) {
        res = true;
      }
    }
    return res;
  }
  const filteredWeekTasks = weekTasks.filter(
    (weekTask) => !identer(dayTasks, weekTask.id),
  );
  console.log("week: " + filteredWeekTasks.length);

  return [...filteredWeekTasks, ...dayTasks];
}
