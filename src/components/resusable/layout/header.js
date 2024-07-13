import React, { useEffect, useState } from 'react';
import './layout.css';
import utils from '../../../utils/utils';
import ButtonComponent from '../button/authButton';
import DropDownMenu from '../dropdown/dropdownMenu';
import { _authenticateUser } from '../../../redux/actions/authAction';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Header() {
  const handleTrial = () => {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { subscription } = useSelector((state) => state.settings_data.profileSettings_data);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch(_authenticateUser(false));
    setAnchorEl(null);
  };

  const handleUpdatePassword = () => {
    navigate('/update-password');
    setAnchorEl(null);
  };

  const handleUpdateProfile = () => {
    navigate('/update-profile');
    setAnchorEl(null);
  };

  const handleSubscriptions = () => {
    navigate('/subscriptions-plan');
    setAnchorEl(null);
  };

  const handleContactUs = () => {
    navigate('/contact-us');
    setAnchorEl(null);
  };

  return (
    <>
      <div className="header-container">
        <div>
          <img src={utils.icons.Dentalid_logo} alt="logo" onClick={() => navigate('/')} />
        </div>
        <div>
          <p>
            {subscription?.type === 'monthly'
              ? 'Monthly Plan'
              : subscription?.type === 'yearly'
              ? 'Yearly Plan'
              : 'Free Plan'}{' '}
          </p>
          <div onClick={handleClick}>
            <img src={utils.icons.userAccount} height={23} width={23} alt="user-Account" />
          </div>
        </div>
      </div>
      <DropDownMenu
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClose}
        handleLogout={handleLogout}
        handleUpdatePassword={handleUpdatePassword}
        handleUpdateProfile={handleUpdateProfile}
        handleSubscriptions={handleSubscriptions}
        handleContactUs={handleContactUs}
      />
    </>
  );
}

export default Header;
