import "../css/App.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Grid } from "@mui/material";
import { Logo } from "../components/components";
import { styles } from "../components/styles";
import SignUp from "./entry-page/registerForm";
import LogIn from "./entry-page/loginForm";
import { small_screen_size } from "../components/constants";

export default function EntryPage() {
  const small_screen = useMediaQuery(small_screen_size);

  const big_screen_style = (
    <Grid
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
      }}
    >
      <Grid item sx={styles.halfPageHeaderBlock}>
        <Logo width={9 / 10} />
      </Grid>
      <Grid item sx={{ width: 1 / 2 }}>
        <LogIn />
        <SignUp />
      </Grid>
    </Grid>
  );

  const small_screen_style = (
    <Grid
      component="main"
      sx={styles.column}
    >
      <Grid item sx={styles.headerBlock}>
        <Logo maxWidth={2 / 3} height={1} />
      </Grid>
      <Grid item sx={{ width: 1 }}>
        <LogIn />
        <SignUp />
      </Grid>
    </Grid>
  );

  return small_screen ? small_screen_style : big_screen_style;
}
