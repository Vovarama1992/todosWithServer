import { getDays, mergeDayAndWeekTasks } from '../app/lib/functions'; 

test('getDays returns an array of length 31 for December', () => {
 
  const decemberDays = getDays(2024, 12); 
  
  
  expect(Array.isArray(decemberDays)).toBe(true);

  
  expect(decemberDays.length).toBe(31);
});

test('mergeDayAndWeekTasks replaces existing tasks with the same id', () => {
  
  const weekTasks = [
    { id: 1, text: 'Week task 1' },
    { id: 2, text: 'Week task 2' },
    { id: 3, text: 'Week task 3' },
  ];
  const dayTasks = [
    { id: 2, text: 'Day task 2' },
    { id: 3, text: 'Day task 3' },
    { id: 4, text: 'Day task 4' },
  ];

  
  const mergedTasks = mergeDayAndWeekTasks(weekTasks, dayTasks);

 
  expect(mergedTasks).toContainEqual({ id: 2, text: 'Day task 2' });
  expect(mergedTasks).toContainEqual({ id: 3, text: 'Day task 3' });

  
  expect(mergedTasks).toContainEqual({ id: 1, text: 'Week task 1' });
  expect(mergedTasks).toContainEqual({ id: 4, text: 'Day task 4' });

  
  expect(mergedTasks).toHaveLength(4); 
});