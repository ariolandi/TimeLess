import './css/App.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import EntryPage from './entryPage';
import Information from './information';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFC40F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#CC3366',
    }
  }
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <EntryPage />
  },
  {
    path: "/information/:userId",
    element: <Information />
  }
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App
