import { Paper, Typography, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task as TaskType } from "../types";
import { SubTask } from "./SubTask";

interface TaskProps {
  task: TaskType;
  onDelete: (id: string) => void;
  onEdit: (task: TaskType) => void;
  onSubtaskToggle: (taskId: string, subtaskId: string) => void;
}

export function Task({ task, onDelete, onEdit, onSubtaskToggle }: TaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getDueDateColor = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "#fee2e2"; // Overdue
    if (diffDays <= 3) return "#f0fdf4"; // Due soon
    return "#f8f9fa"; // Default
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        padding: 2,
        marginBottom: 2,
        backgroundColor: "#ffffff",
        cursor: "grab",
        "&:active": { cursor: "grabbing" },
        opacity: isDragging ? 0.5 : 1,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        transform: isDragging ? "scale(1.02)" : "scale(1)",
        "&:hover": {
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
          transition: "opacity 0.2s ease-in-out",
          opacity: isDragging ? 0.8 : 1,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            fontSize: "0.9375rem",
            color: "text.primary",
          }}
        >
          {task.title}
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={handleEdit}
            sx={{
              padding: 0.5,
              transition: "transform 0.2s ease",
              "&:hover": { transform: "scale(1.1)" },
              "&:focus": { outline: "none" },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleDelete}
            sx={{
              padding: 0.5,
              transition: "transform 0.2s ease",
              "&:hover": { transform: "scale(1.1)" },
              "&:focus": { outline: "none" },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {task.dueDate && (
        <Box
          sx={{
            backgroundColor: getDueDateColor(task.dueDate),
            padding: "4px 8px",
            borderRadius: "8px",
            display: "inline-block",
            mb: task.subtasks?.length ? 2 : 0,
            transition: "background-color 0.3s ease",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.75rem",
              color: "text.secondary",
            }}
          >
            Due {new Date(task.dueDate).toLocaleDateString()}
          </Typography>
        </Box>
      )}

      {task.subtasks && task.subtasks.length > 0 && (
        <Box
          sx={{
            mt: task.dueDate ? 0 : 2,
            transition: "opacity 0.2s ease-in-out",
            opacity: isDragging ? 0.7 : 1,
          }}
        >
          {task.subtasks.map((subtask) => (
            <SubTask
              key={subtask.id}
              subtask={subtask}
              taskId={task.id}
              onToggle={onSubtaskToggle}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
}
