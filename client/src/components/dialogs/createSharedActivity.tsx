import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { Form } from "react-router-dom";
import { secondaryColor } from "../constants";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FriendData, FriendsTable } from "../table/friendsTable";
import { CreateActivity } from "./createActivity";

export function CreateSharedActivity({
  open,
  setOpen,
  friends,
  onSaveChanges,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  friends: FriendData[];
  onSaveChanges: () => void;
}) {
  const color = "secondary";
  const [openDialog, setOpenDialog] = useState(false);
  const [shareFriends, setShareFriends] = useState<FriendData[]>(
    friends.map((friend) => ({ ...friend, status: false }))
  );

  useEffect(() => {
    setShareFriends(friends.map((friend) => ({ ...friend, status: false })));
  }, [friends]);

  const onClose = () => {
    setOpen(false);
  };

  const onStatusToggle = (row: FriendData, checked: boolean) => {
    setShareFriends((prev) =>
      prev.map((friend) =>
        friend.username === row.username ? { ...friend, status: checked } : friend
      )
    );
  };

  const onSubmit = () => {
    setOpenDialog(true);
    onClose();
  };


  return (
    <>
      <Dialog open={open} fullWidth={true} maxWidth={"md"} onClose={onClose}>
        <DialogTitle
          sx={{
            backgroundColor: secondaryColor,
            color: "primary.contrastText",
            textAlign: "center",
            fontWeight: "bolder",
          }}
        >
          Създаване на споделено събитие
        </DialogTitle>
        <Form onSubmit={onSubmit}>
          <DialogContent>
            <FriendsTable rows={shareFriends} onStatusToggle={onStatusToggle} />
          </DialogContent>
          <DialogActions>
            <Button color={color} type="submit">Създай</Button>
            <Button color={color} onClick={onClose}>Затвори</Button>
          </DialogActions>
        </Form>
      </Dialog>
      <CreateActivity 
        guests={shareFriends.filter((friend) => friend.status).map((friend) => friend.username)}
        open={openDialog} 
        setOpen={setOpenDialog}
        onSaveChanges={onSaveChanges}
      />
    </>
  );
}
