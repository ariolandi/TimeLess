import './css/App.css'
import SignUp from './registerForm';
import LogIn from './loginForm';
import { Box, Grid } from '@mui/material';
import logo from './assets/timeless_logo_white.svg';
import useMediaQuery from '@mui/material/useMediaQuery';


export default function EntryPage() {
  const small_screen = useMediaQuery('(max-width:1000px)');
  console.log(small_screen);

  const big_screen_style = (
    <Grid component='main'
      sx={{           
        display: 'flex',
        height: '100vh'
      }}>
      <Grid item
        sx={{
          backgroundColor: 'primary.main',
          display: 'flex',
          justifyContent: 'center',
          width: 1/2,
        }}>
        <Box
          component='img'
          alt='TimeLess'
          src={logo}
          sx={{ width: 9/10 }}
        />
      </Grid>
      <Grid item sx={{ width: 1/2 }}>
        <LogIn />
        <SignUp />
      </Grid>
    </Grid>
  );

  const small_screen_style = (
    <Grid
      sx={{           
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Grid item
        sx={{
          backgroundColor: 'primary.main',
          display: 'flex',
          justifyContent: 'center',
          width: 1,
          padding: '2%',
        }}>
        <Box
          component='img'
          alt='TimeLess'
          src={logo}
          sx={{ height: 1, minWidth: 2/3 }}
        />
      </Grid>
      <Grid item sx={{ width: 1 }}>
        <LogIn />
        <SignUp />
      </Grid>
    </Grid>
  );

  return small_screen ? small_screen_style : big_screen_style;
}

