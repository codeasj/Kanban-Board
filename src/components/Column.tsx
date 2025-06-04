import { Box, Typography } from "@mui/material";
import { Task } from "./Task";
import type { Task as TaskType, Column as ColumnType } from "../types";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
  onTaskDelete: (id: string) => void;
  onTaskEdit: (task: TaskType) => void;
  onSubtaskToggle: (taskId: string, subtaskId: string) => void;
}

export function Column({
  column,
  tasks,
  onTaskDelete,
  onTaskEdit,
  onSubtaskToggle,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const columnTasks = tasks.filter((task) => task.column === column.id);

  return (
    <Box
      ref={setNodeRef}
      sx={{
        width: "300px",
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        transition: "background-color 0.2s ease",
        backgroundColor: isOver ? "rgba(0,0,0,0.04)" : "transparent",
        borderRadius: 1,
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 500,
          marginBottom: 2,
          color: "text.primary",
          fontSize: "0.875rem",
          backgroundColor:
            column.id === "blocked"
              ? "#fef2f2"
              : column.id === "done"
              ? "#f0fdf4"
              : "#f3f4f6",
          padding: "6px 12px",
          borderRadius: "16px",
          display: "inline-block",
          width: "max-content",
        }}
      >
        {column.title}
      </Typography>

      <Box
        sx={{
          flex: 1,
          height: "fit-content",
        }}
      >
        <SortableContext
          items={columnTasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {columnTasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              onDelete={onTaskDelete}
              onEdit={onTaskEdit}
              onSubtaskToggle={onSubtaskToggle}
            />
          ))}
        </SortableContext>
      </Box>
    </Box>
  );
}
