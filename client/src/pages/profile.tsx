import Header from "../components/header";
import { Container, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { User, UserService } from "../services/userService";
import { primaryColor, secondaryColor, standardMargin } from "../components/constants";
import { formatTime } from "../components/dateTime";
import FriendsTable, { FriendData } from "../components/friendsTable";

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

  const friends: FriendData[] = [
    {
      status: true,
      username: 'user1',
      name: 'Name Name',
      start_time: '09:00',
      end_time: '18:00',
      weekend_start_time: '10:00',
      weekend_end_time: '20:00'
    },
    {
      status: false,
      username: 'user2',
      name: 'Test User',
      start_time: '09:00',
      end_time: '18:00',
      weekend_start_time: '10:00',
      weekend_end_time: '20:00'
    }
  ];

  return (
    <Container maxWidth={false} disableGutters>
      <Header />
      <Container sx={{padding: standardMargin}}>
        <Typography variant="h4" color={secondaryColor}> 
          {user?.first_name} {user?.last_name} 
        </Typography>
        <Grid container spacing={32}>
          <Grid item>
            <Typography variant="h6" color={primaryColor}> 
              {user?.username} 
            </Typography>
          </Grid>
          <Grid item>
          </Grid>
          <Grid item>
            <Typography color={primaryColor}> </Typography>
            <Typography color={primaryColor}> 
              Начален час: {formatTime(user?.start_time ?? null)} 
            </Typography>
            <Typography color={primaryColor}> 
              Краен час: {formatTime(user?.end_time ?? null)} 
            </Typography>
          </Grid>
          <Grid item>
            <Typography color={secondaryColor}> 
              Почивни дни:
            </Typography>
            <Typography color={primaryColor}> 
              Начален час: {formatTime(user?.weekend_start_time ?? null)} 
            </Typography>
            <Typography color={primaryColor}> 
              Краен час: {formatTime(user?.weekend_end_time ?? null)} 
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <Divider
        orientation="horizontal"
        variant="middle"
        flexItem
        sx={{ backgroundColor: secondaryColor }}
      />
      <FriendsTable rows={friends} />
    </Container>
  );
}
