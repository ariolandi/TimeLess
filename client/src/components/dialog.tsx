import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { InputParams, InputTextField } from "./textField";


export function SimpleDialog(isOpen: boolean = true) {
  const [open, setOpen] = useState(isOpen);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const params: InputParams[] = [
    {
      name: "title",
      value: title,
      state: setTitle,
      label: "Заглавие",
    },
    {
      name: "description",
      value: description,
      state: setDescription,
      label: "Описание",
      multiline: true,
    },
  ];

  return (
    <Dialog
      open={open}
      fullWidth={true}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          // handleClose();
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          textAlign: "center",
          fontWeight: "bolder"
        }}
      >Създаване на дейност</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {params.map((field) => {
            return (
              <Grid item xs={12} key={field.name}>
                <InputTextField
                  name={field.name}
                  value={field.value}
                  state={field.state}
                  label={field.label}
                  type={field.type}
                />
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Затвори</Button>
        <Button type="submit">Създай</Button>
      </DialogActions>
    </Dialog>
  );
}
