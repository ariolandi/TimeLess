import "./css/App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EntryPage from "./pages/entryPage";
import Information from "./pages/information";
import DashBoard from "./pages/dashboard";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFC40F",
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: "#CC3366",
    },
    error: {
      main: "#CC3366",
    },
  },
  typography: {
    body1: {
      color: "#FFC40F",
    }
  }
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <EntryPage />,
  },
  {
    path: "/information",
    element: <Information />,
  },
  {
    path: "/dashboard",
    element: <DashBoard />,
  }
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={router} />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
