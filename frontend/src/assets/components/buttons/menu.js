import * as React from 'react';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ControlledDropdown() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.post('/auth/logout', {}, { withCredentials: true });
    navigate('/');
  };

  return (
    <Dropdown open={open} onOpenChange={(e, isOpen) => setOpen(isOpen)}>
      <MenuButton>Menu</MenuButton>

      <Menu>
        <MenuItem component={Link} to="/profile">
          Profile
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          Logout
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}