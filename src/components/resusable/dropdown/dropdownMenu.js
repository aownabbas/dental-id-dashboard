import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import './dropDownMenu.css';

export default function DropDownMenu({
  open,
  anchorEl,
  handleClose,
  handleLogout,
  handleUpdatePassword,
  handleUpdateProfile,
  handleSubscriptions,
  handleContactUs,
}) {
  return (
    <div>
      <Menu
        id="fade-menu"
        MenuListProps={{
          autoFocusItem: false,
          'aria-labelledby': 'fade-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            width: '180px',
            marginTop: '13px',
            borderRadius: '10px',
            fontSize: '8px',
          },
        }}
        transformOrigin={{
          vertical: '10px',
          horizontal: 'right',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem className="menu_items" onClick={handleUpdateProfile}>
          Update Profile
        </MenuItem>
        <MenuItem className="menu_items" onClick={handleUpdatePassword}>
          Update Password
        </MenuItem>
        <MenuItem className="menu_items" onClick={handleSubscriptions}>
          Subscriptions
        </MenuItem>
        <MenuItem className="menu_items" onClick={handleContactUs}>
          Contact Us
        </MenuItem>
        <MenuItem className="menu_items" onClick={handleLogout}>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
