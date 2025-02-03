import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Logo } from "./components"
import { Button } from "@mui/material";
import { UserService } from "../services/userService";
import { useNavigate } from "react-router-dom";

const userService = new UserService();

export default function Header() {
  const navigate = useNavigate();
  
  const onSubmit = async () => {
    const result = await userService.logout();

    if (result) {
      navigate(`/`);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Logo />
          <Box sx={{ flexGrow: 1 }} />
          <Button
            onClick={onSubmit}
            sx={{
              color: "primary.contrastText", 
              alignSelf: "flex-end"
            }}
          >
            <b>Изход</b>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
