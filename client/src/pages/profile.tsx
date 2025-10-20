import Header from "../components/header";
import { Container } from "@mui/material";
import { useEffect, useState } from "react";
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
        {user?.username}
    </Container>
  );
}
