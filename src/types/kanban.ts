export interface Task {
  id: string;
  title: string;
  dueDate?: string;
  subtasks?: Subtask[];
  column: ColumnType;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export type ColumnType = "not-started" | "in-progress" | "blocked" | "done";

export interface Column {
  id: ColumnType;
  title: string;
  tasks: Task[];
}

export interface KanbanData {
  tasks: Task[];
  columns: Column[];
}
