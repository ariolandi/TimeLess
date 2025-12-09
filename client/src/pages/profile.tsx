import Header from "../components/header";
import { Autocomplete, Button, Container, Divider, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { User, UserService } from "../services/userService";
import { primaryColor, secondaryColor, standardMargin } from "../components/constants";
import { formatTime } from "../components/dateTime";
import { FriendData, FriendsTable } from "../components/friendsTable";
import { styles } from "../components/styles";
import { Form } from "react-router-dom";

const userService = new UserService();

export default function Profile() {
  const [user, setUser] = useState<User>();
  const [usersList, setUsersList] = useState<string[]>([]);
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [friendSearch, setFriendSearch] = useState<string>();

  async function loadUser() {
    const result = await userService.profile();

    if (result) {
      setUser(result.data);
    }
  }

  async function loadFriends() {
    const result = await userService.friends();

    if (result) {
      setFriends(result.data.map((user) => {
        return {
          status: true,
          username: user.username,
          name: `${user.first_name} ${user.last_name}`,
          start_time: user.start_time,
          end_time: user.end_time,
          weekend_start_time: user.weekend_start_time,
          weekend_end_time: user.weekend_end_time
        } as FriendData}));
    }
  }

  async function loadUsersList() {
    const result = await userService.list();

    if (result) {
      setUsersList(result.data);
    }
  }

  useEffect(() => {loadUser()}, []);
  useEffect(() => {loadUsersList()}, []);
  useEffect(() => {loadFriends()}, []);

  const addFriend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('add Friend')

    userService.add_friend(friendSearch || '');
    
    await loadFriends();
  }

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
            <Typography color={secondaryColor}> 
              Делнични дни:
            </Typography>
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

      <Container>
        <Form onSubmit={addFriend}>
          <Grid container sx={{padding: standardMargin}}>
            <Grid item>
              <Autocomplete
                disablePortal
                options={usersList}
                onInputChange={(_, value) => setFriendSearch(value)}
                sx={{ width: 300, margin: standardMargin }}
                renderInput={(params) => <TextField {...params} label="Търси приятели" />}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                type="submit"
                sx={styles.submitButton}
              >
                Добави приятел
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Container>
    
      <FriendsTable rows={friends || []} />
    </Container>
  );
}
