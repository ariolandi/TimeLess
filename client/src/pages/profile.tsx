import Header from "../components/header";
import { Container, Button, Box } from "@mui/material";
import { styles } from "../components/styles";
import { CreateActivity } from "../components/dialogs/createActivity";
import { useEffect, useState } from "react";
import Calendar from "../components/calendar/calendar";
import { User, UserService } from "../services/userService";

const userService = new UserService();

export default function Profile() {
  const [user, setUser] = useState<User>();

  async function loadUser() {
    const result = await userService.profile();
    if (result) {
      setUser(result.data);
    }
  }

  useEffect(() => {loadUser()}, []);

  return (
    <Container maxWidth={false} disableGutters>
      <Header />
      
    </Container>
  );
}
