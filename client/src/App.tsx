import './css/App.css'
import Header from './header';
import SignUp from './registerForm';
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFC40F",
      contrastText: "#FFFFFF",
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <SignUp />
    </ThemeProvider>
  );
}

export default App
