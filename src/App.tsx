import { CssBaseline, ThemeProvider } from "@mui/material";
import { KanbanBoard } from "./components/KanbanBoard";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <KanbanBoard />
    </ThemeProvider>
  );
}

export default App;
