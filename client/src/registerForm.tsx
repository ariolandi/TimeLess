// import * asReact from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { create_user } from './utils';
import { useState } from 'react';


export default function SignUp() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    create_user(data.get('username'), data.get('password'), data.get('email'));
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');


  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                required 
                fullWidth
                id="username" 
                label="Потребителско име" 
                name="username" 
                variant="standard" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                required
                fullWidth
                id="password"
                label="Парола" 
                type="password" 
                name="password" 
                variant="standard"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required  
                fullWidth
                id="email"
                label="Email"
                name="email"
                variant="standard"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                type="submit" 
              >
                Регистрация
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
