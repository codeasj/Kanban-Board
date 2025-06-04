import type { KanbanData, Task, ColumnType } from "../types/kanban";

const STORAGE_KEY = "kanban-data";

const initialData: KanbanData = {
  tasks: [
    {
      id: "1",
      title: "Take Coco to a vet",
      dueDate: "2024-04-11",
      column: "not-started",
    },
    {
      id: "2",
      title: "Taxes",
      column: "in-progress",
    },
    {
      id: "3",
      title: "Move",
      column: "blocked",
      subtasks: [
        { id: "s4", title: "Request moving estimate", completed: false },
        { id: "s5", title: "Order moving boxes", completed: true },
        { id: "s11", title: "Schedule utility transfers", completed: false },
        { id: "s12", title: "Book elevator for moving day", completed: false },
      ],
    },
    {
      id: "4",
      title: "Nothing to be done 😌",
      column: "done",
    },
  ],
  columns: [
    { id: "not-started", title: "Not started", tasks: [] },
    { id: "in-progress", title: "In progress", tasks: [] },
    { id: "blocked", title: "Blocked", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ],
};

export const loadKanbanData = (): KanbanData => {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (!savedData) {
    saveKanbanData(initialData);
    return initialData;
  }
  return JSON.parse(savedData);
};

export const saveKanbanData = (data: KanbanData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const moveTask = (
  taskId: string,
  targetColumn: ColumnType,
  data: KanbanData
): KanbanData => {
  const updatedTasks = data.tasks.map((task) =>
    task.id === taskId ? { ...task, column: targetColumn } : task
  );
  return { ...data, tasks: updatedTasks };
};

export const addTask = (
  task: Omit<Task, "id">,
  data: KanbanData
): KanbanData => {
  const newTask: Task = {
    ...task,
    id: Date.now().toString(),
  };
  return { ...data, tasks: [...data.tasks, newTask] };
};

export const updateTask = (
  taskId: string,
  updates: Partial<Task>,
  data: KanbanData
): KanbanData => {
  const updatedTasks = data.tasks.map((task) =>
    task.id === taskId ? { ...task, ...updates } : task
  );
  return { ...data, tasks: updatedTasks };
};

export const deleteTask = (taskId: string, data: KanbanData): KanbanData => {
  return { ...data, tasks: data.tasks.filter((task) => task.id !== taskId) };
};

export const toggleSubtask = (
  taskId: string,
  subtaskId: string,
  data: KanbanData
): KanbanData => {
  const updatedTasks = data.tasks.map((task) => {
    if (task.id === taskId && task.subtasks) {
      const updatedSubtasks = task.subtasks.map((subtask) =>
        subtask.id === subtaskId
          ? { ...subtask, completed: !subtask.completed }
          : subtask
      );
      return { ...task, subtasks: updatedSubtasks };
    }
    return task;
  });
  return { ...data, tasks: updatedTasks };
};
