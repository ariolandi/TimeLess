// import * asReact from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export interface CredentialsFormProps {
  params: InputParams[],
  buttonText: string,
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export interface InputParams {
  name: string,
  value: string,
  state: (value: string) => void,
  label: string,
  type: string
}

export function CredentialsForm({ params, buttonText, handleSubmit }: CredentialsFormProps) {

  return (
    <Container component="main">
      <Box
        sx={{
          border: 1,
          borderRadius: 8,
          padding: '10%',
          margin: '5%',
          color: 'primary.main',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {params.map(field => {     
              return (
                <Grid item xs={12} key={field.name}>
                  <TextField 
                    required 
                    fullWidth
                    id={field.name} 
                    label={field.label} 
                    name={field.name}
                    type={field.type}
                    variant="standard" 
                    value={field.value}
                    onChange={(e) => field.state(e.target.value)}
                  />
                </Grid>
              ); 
            })}

            <Grid item xs={12}>
              <Button
                variant="contained"
                type="submit" 
                sx={{
                  width: 1,
                  padding: '16px 0px'
                }}
              >
                <b>{buttonText}</b>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
