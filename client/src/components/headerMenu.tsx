import { IconButton, Menu, MenuItem } from "@mui/material";
import { UserService } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { endpoints } from "./constants";
import DehazeIcon from '@mui/icons-material/Dehaze';
import { useState } from "react";
import { anchor, styles } from "./styles";

const userService = new UserService();

export default function HeaderMenu() {
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const onExit = async () => {
    const result = await userService.logout();

    if (result) {
      navigate(`/`);
    }
  };

  const toDashboard = async () => {
    navigate(endpoints.dashboard);
  };
  
  const toProfile = async () => {
    navigate(endpoints.profile);
  };

  return (
    <div>
      <IconButton
        onClick={handleOpenUserMenu}
        color="inherit"
      >
        <DehazeIcon sx={{ fontSize: 60 }}/>
      </IconButton>
      <Menu
        sx={{mt: '45px'}}
        anchorEl={anchorElUser}
        anchorOrigin={anchor}
        keepMounted
        transformOrigin={anchor}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        MenuListProps={{ sx: { py: 0 } }}
      >
        <MenuItem onClick={toDashboard} sx={styles.menuItem} divider={true} > Главна страница </MenuItem>
        <MenuItem onClick={toProfile} sx={styles.menuItem} divider={true} > Профил </MenuItem>
        <MenuItem onClick={onExit} sx={styles.menuItem}> Изход </MenuItem>
      </Menu>
    </div>
  );
}