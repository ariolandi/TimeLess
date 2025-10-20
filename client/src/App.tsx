import "./css/App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EntryPage from "./pages/entryPage";
import Information from "./pages/information";
import DashBoard from "./pages/dashboard";
import Profile from "./pages/profile";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFC40F",
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: "#CC3366",
      contrastText: "#FFFFFF"
    },
    error: {
      main: "#CC3366",
    },
  },
  typography: {
    body1: {
      color: "#ca9800ff",
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
  },
  {
    path: "/profile",
    element: <Profile />
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
