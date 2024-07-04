import Header from '../components/header'
import { Container, Button } from '@mui/material';
import { styles } from "../components/styles";
import { SimpleDialog } from '../components/dialog';
import { useState } from 'react';

export default function DashBoard () {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };


  return (
    <Container
      maxWidth={false}
      disableGutters
    >
      <Header />
      <Button
        variant="contained"
        type="submit"
        sx={styles.submitButton}
        onClick={handleClickOpen}
      >
        <b>Създай дейност</b>
      </Button>
      <SimpleDialog isOpen={open}/>
    </Container>
  );
}
