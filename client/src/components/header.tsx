import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Logo } from "./components"
import { useMediaQuery } from "@mui/material";
import { small_screen_size } from "./constants";
import HeaderMenu from "./headerMenu";

export default function Header() {
  const small_screen = useMediaQuery(small_screen_size);

  const smallScreenHeader = (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <Logo />
        </Toolbar>
        <HeaderMenu/>
      </AppBar>
    </Box>
  );

  const header = (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <Logo />
          <Box sx={{ flexGrow: 1 }} />
            <HeaderMenu/>
        </Toolbar>
      </AppBar>
    </Box>
  );

  return small_screen ? smallScreenHeader : header;
}
