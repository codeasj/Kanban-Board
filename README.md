# Kanban Board

A modern, responsive Kanban board built with React, TypeScript, and Material UI.

## Features

- Drag and drop tasks between columns
- Create, edit, and delete tasks
- Add due dates with color-coded indicators
- Manage existing subtasks with checkboxes
- Clean, minimalist design
- Responsive layout with horizontal scrolling
- Persistent storage using localStorage

## Setup Instructions

1. Clone the repository:

```bash
git clone <your-repo-url>
cd kanban-board
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open your browser and navigate to:

```
http://localhost:5173
```

## Tech Stack

- React 18
- TypeScript
- Material UI
- @dnd-kit for drag and drop
- Vite for build tooling

## Assumptions

1. Data Persistence:

   - Uses localStorage for data persistence
   - Initial data is loaded with sample tasks if no saved data exists

2. Task Management:

   - Tasks can only be created in the "Not Started" column
   - Tasks can be moved between any columns via drag and drop
   - Due dates are optional
   - Subtasks are predefined in the initial data and can be checked/unchecked (adding new subtasks is not supported in the current version)

3. UI/UX:

   - Column colors:
     - Not Started: Light grey
     - In Progress: Light grey
     - Blocked: Light red
     - Done: Light green
   - Due date colors:
     - Overdue: Light red
     - Due soon (≤3 days): Light grey

## Implementation Details

The application follows a component-based architecture with the following main components:

- `KanbanBoard`: Main container component
- `Column`: Individual column component
- `Task`: Task card component with drag-and-drop
- `SubTask`: Subtask component with checkbox

Data management is handled through a custom hook that interfaces with localStorage for persistence.

## Screenshots
![1](https://github.com/user-attachments/assets/27f50c70-b33b-45b4-9260-9a4f6b457758)
![2](https://github.com/user-attachments/assets/97e224d1-849b-472b-8521-cd0728973027)
![3](https://github.com/user-attachments/assets/01e55485-8857-468a-8b66-5b71984a2733)


