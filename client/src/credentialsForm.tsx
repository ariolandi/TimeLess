// import * asReact from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styles } from './styles';
import { SubmitButton } from './components';

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
    <Container component='main'>
      <Box
        sx={{
          ...styles.formBorder, 
          ...{
            color: 'primary.main', 
            padding: '10%'
          }}}
      >
        <Box 
          component='form' 
          noValidate 
          onSubmit={handleSubmit} 
          width='100%'
          sx={{
            ...{ mt: 3 }, 
            ...styles.column
          }}>
          <Grid 
            container 
            spacing={2}
          >
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
                    variant='standard' 
                    value={field.value}
                    onChange={(e) => field.state(e.target.value)}
                  />
                </Grid>
              ); 
            })}

            <Grid item xs={12}>
              <SubmitButton buttonText={buttonText} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
