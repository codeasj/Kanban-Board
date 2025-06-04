import { Box, Checkbox, Typography } from "@mui/material";
import type { Subtask } from "../types";

interface SubTaskProps {
  subtask: Subtask;
  taskId: string;
  onToggle: (taskId: string, subtaskId: string) => void;
}

export function SubTask({ subtask, taskId, onToggle }: SubTaskProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        marginBottom: 0.5,
      }}
    >
      <Checkbox
        checked={subtask.completed}
        onChange={() => onToggle(taskId, subtask.id)}
        size="small"
        sx={{
          color: "#d1d5db",
          "&.Mui-checked": {
            color: "#3f51b5",
          },
          "& .MuiSvgIcon-root": {
            fontSize: "1.2rem",
          },
          padding: "4px",
        }}
      />
      <Typography
        variant="body2"
        sx={{
          textDecoration: subtask.completed ? "line-through" : "none",
          color: subtask.completed ? "text.secondary" : "text.primary",
          fontSize: "0.875rem",
        }}
      >
        {subtask.title}
      </Typography>
    </Box>
  );
}
