import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Logo } from "./components"
import { Button, useMediaQuery } from "@mui/material";
import { UserService } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { small_screen_size } from "./constants";

const userService = new UserService();

export default function Header() {
  const small_screen = useMediaQuery(small_screen_size);
  const navigate = useNavigate();
  
  const onSubmit = async () => {
    const result = await userService.logout();

    if (result) {
      navigate(`/`);
    }
  };

  const smallScreenHeader = (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <Logo />
        </Toolbar>
        <Button
          onClick={onSubmit}
          sx={{
            color: "primary.contrastText", 
            alignSelf: "flex-end"
          }}
        >
          <b>Изход</b>
        </Button>
      </AppBar>
    </Box>
  );

  const header = (
    <Box sx={{flexGrow: 1}}>
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

  return small_screen ? smallScreenHeader : header;
}
