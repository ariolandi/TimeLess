import Header from '../components/header'
import { Container, Button } from '@mui/material';
import { styles } from "../components/styles";
import * as React from 'react';
import { SimpleDialog } from '../components/dialog';

export default function DashBoard () {
  const [open, setOpen] = React.useState(false);

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
      <SimpleDialog
        isOpen={open}
      />
    </Container>
  );
}
