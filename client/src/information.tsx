import './css/App.css'
import { Box, Grid, Typography, TextField, Checkbox, Divider, FormControlLabel } from '@mui/material';
import logo from './assets/timeless_logo_white.svg';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { styles, smallMarginPercent } from './styles';
import { SubmitButton } from './components';
import { TimeField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function Information() {
  const { userId } = useParams<{ userId: string }>();
  console.log(userId);

  const [first_name, setFirstName] = useState('');
  const [second_name, setSecondName] = useState('');
  const [start_time, setStartTime] = useState();
  const [end_time, setEndTime] = useState();
  const [weekend_start_time, setWeekendStartTime] = useState();
  const [weekend_end_time, setWeekendEndTime] = useState();

  const text_params = [
    {
      name: 'first_name',
      value: first_name,
      state: setFirstName,
      label: 'Име',
      type: ''
    },
    {
      name: 'second_name',
      value: second_name,
      state: setSecondName,
      label: 'Фамилия',
      type: ''
    }
  ];

  const time_params = [
    {
      name: 'start_time',
      value: start_time,
      state: setStartTime,
      label: 'Начален час',
    },
    {
      name: 'end_time',
      value: end_time,
      state: setEndTime,
      label: 'Краен час',
    }
  ];

  const weekend_time_params = [
    {
      name: 'weekend_start_time',
      value: weekend_start_time,
      state: setWeekendStartTime,
      label: 'Начален час',
    },
    {
      name: 'weekend_end_time',
      value: weekend_end_time,
      state: setWeekendEndTime,
      label: 'Краен час',
    }
  ];


  return (
    <Grid
      sx={styles.column}>
      <Grid item
        sx={{
          ...styles.column,
          ...{
            justifyContent: 'center',
            backgroundColor: 'primary.main',
          }
        }}>
        <Box
          component='img'
          alt='TimeLess'
          src={logo}
          sx={{ 
            height: 1, 
            maxHeight: '300px',
            minWidth: 2/3 
          }}
        />
        <Divider 
          orientation='horizontal' 
          variant='middle' 
          flexItem 
          sx={{ bgcolor: 'secondary.main' }}
        />
        <Typography
          variant='h4'
          textAlign='center'
          padding={smallMarginPercent}
          color='primary.contrastText'
        >
          <b>Нуждаем се от още малко информация...</b>
        </Typography>
      </Grid>
      <Grid 
        item 
        spacing={2}
      >
        <Box 
          component='form' 
          noValidate 
          sx={{
            ...styles.formBorder, 
            ...styles.column, 
            ...{ color: 'secondary.main' }
          }}
        >
          <Grid 
            container 
            spacing={4}
          >
            {text_params.map(field => {
              return (
                <Grid item xs={6} key={field.name}>
                  <TextField 
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
          </Grid>
          <Grid 
            container 
            spacing={4}
            padding={smallMarginPercent}
          >
            <Grid item xs={6} width='100%'>
              <Grid item>
                <Typography 
                  color='primary.main'
                >
                  Какви са предпочитаните начален и краен час за вашия ден?
                </Typography>
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {time_params.map(field => {
                  return (
                    <Grid item key={field.name} margin={smallMarginPercent}>
                      <TimeField
                        format='HH:mm'
                        id={field.name} 
                        label={field.label} 
                        name={field.name}
                        value={field.value}
                        onChange={(e) => field.state(e.target.value)}
                      />
                    </Grid>
                    
                  ); 
                })}
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <Grid item>
                <Typography 
                  color='primary.main'
                >
                  Какви са предпочитаните начален и краен час за вашия ден през уикенда?
                </Typography>
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {weekend_time_params.map(field => {
                  return (
                    <Grid item key={field.name} margin={smallMarginPercent}>
                      <TimeField
                        format='HH:mm'
                        id={field.name} 
                        label={field.label} 
                        name={field.name}
                        value={field.value}
                        onChange={(e) => field.state(e.target.value)}
                      />
                    </Grid>
                    
                  ); 
                })}
              </LocalizationProvider>
              <FormControlLabel 
                color='primary.main'
                control={<Checkbox defaultChecked />} 
                label='Без промяна в часовете' 
              />
            </Grid>
          </Grid>
          <Grid 
            item 
            width={1}
            marginTop={smallMarginPercent}
            sx={styles.column} 
          >
            <SubmitButton buttonText={'Напред'} />
          </Grid>
        </Box>
      </Grid>      
    </Grid>
  );
}

