import './css/App.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import EntryPage from './entryPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFC40F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#e146aa',
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <EntryPage />
    </ThemeProvider>
  );
}

export default App
