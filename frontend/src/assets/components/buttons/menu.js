import * as React from 'react';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import {Link} from 'react-router-dom';


export default function ControlledDropdown() {
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = React.useCallback((event, isOpen) => {
    setOpen(isOpen);
  }, []);

  return (
    <Dropdown open={open} onOpenChange={handleOpenChange}>
		{/* Add image icon for user as menu */}
      <MenuButton>Menu</MenuButton> 
      <Menu>
        <MenuItem component={Link} to="/profile">Profile</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
    </Dropdown>
  );
}