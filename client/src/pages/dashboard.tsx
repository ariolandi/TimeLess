import Header from '../components/header'
import { Container, Button } from '@mui/material';
import { styles } from "../components/styles";
import { ActivityDialog } from '../components/dialog';
import { useState } from 'react';

export default function DashBoard () {
  const [open, setOpen] = useState(false);

  return (
    <Container
      maxWidth={false}
      disableGutters
    >
      <Header />
      <Button
        variant="contained"
        sx={styles.submitButton}
        onClick={() => setOpen(true)}
      >
        <b>Създай дейност</b>
      </Button>
      <ActivityDialog open={open} setOpen={setOpen}/>
    </Container>
  );
}
