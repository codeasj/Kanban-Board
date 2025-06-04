import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography,
} from "@mui/material";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  rectIntersection,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { Column } from "./Column";
import { Task } from "./Task";
import type { Task as TaskType, ColumnType } from "../types";
import {
  loadKanbanData,
  saveKanbanData,
  moveTask,
  addTask,
  updateTask,
  deleteTask,
  toggleSubtask,
} from "../utils/kanbanData";

export function KanbanBoard() {
  const [data, setData] = useState(loadKanbanData());
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    saveKanbanData(data);
  }, [data]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = data.tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (over && active.id !== over.id) {
      const taskId = active.id.toString();
      const targetColumn = over.id as ColumnType;
      setData((prevData) => moveTask(taskId, targetColumn, prevData));
    }
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  const handleTaskDelete = (taskId: string) => {
    setData((prevData) => deleteTask(taskId, prevData));
  };

  const handleTaskEdit = (task: TaskType) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskDueDate(task.dueDate || "");
    setIsDialogOpen(true);
  };

  const handleSubtaskToggle = (taskId: string, subtaskId: string) => {
    setData((prevData) => toggleSubtask(taskId, subtaskId, prevData));
  };

  const handleAddNewTask = () => {
    setEditingTask(null);
    setNewTaskTitle("");
    setNewTaskDueDate("");
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
    setNewTaskTitle("");
    setNewTaskDueDate("");
  };

  const handleDialogSave = () => {
    if (newTaskTitle.trim()) {
      if (editingTask) {
        setData((prevData) =>
          updateTask(
            editingTask.id,
            {
              title: newTaskTitle,
              dueDate: newTaskDueDate || undefined,
            },
            prevData
          )
        );
      } else {
        setData((prevData) =>
          addTask(
            {
              title: newTaskTitle,
              dueDate: newTaskDueDate || undefined,
              column: "not-started",
            },
            prevData
          )
        );
      }
      handleDialogClose();
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              Personal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A board to keep track of personal tasks.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNewTask}
            size="small"
            sx={{ textTransform: "none", borderRadius: 2, px: 2 }}
          >
            Add Task
          </Button>
        </Box>

        <DndContext
          sensors={sensors}
          collisionDetection={(args) => {
            const collisions = pointerWithin(args);
            if (collisions.length > 0) return collisions;
            return rectIntersection(args);
          }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <Box
            sx={{
              backgroundColor: "#f9fafb",
              borderRadius: 2,
              padding: 3,
              height: "80vh",
              overflow: "auto",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 3,
                minWidth: "fit-content",
                height: "fit-content",
                pb: 2,
              }}
            >
              {data.columns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  tasks={data.tasks}
                  onTaskDelete={handleTaskDelete}
                  onTaskEdit={handleTaskEdit}
                  onSubtaskToggle={handleSubtaskToggle}
                />
              ))}
            </Box>
          </Box>
          <DragOverlay dropAnimation={null}>
            {activeTask ? (
              <Box
                sx={{
                  opacity: 0.8,
                  cursor: "grabbing",
                  transform: "rotate(2deg)",
                  width: "300px",
                  pointerEvents: "none",
                }}
              >
                <Task
                  task={activeTask}
                  onDelete={handleTaskDelete}
                  onEdit={handleTaskEdit}
                  onSubtaskToggle={handleSubtaskToggle}
                />
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Box>

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{editingTask ? "Edit Task" : "New Task"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: new Date().toISOString().split("T")[0] }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDialogSave}
            variant="contained"
            color="primary"
            disabled={!newTaskTitle.trim()}
          >
            {editingTask ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
