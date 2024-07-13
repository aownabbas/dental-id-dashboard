import React from "react";
import { useDispatch } from "react-redux";
import logoutImage from "../../assets/icons/logout.svg";
import { _authenticateUser } from "../../redux/actions/authAction";

const LogOut = ({ onClick }) => {
  const dispatch = useDispatch();

  const logout = () => {
    localStorage.removeItem("user");
    dispatch(_authenticateUser(false));
  };
  return (
    <div className="d-logout_button_container" onClick={logout}>
      <img src={logoutImage} />
      <p>Logout</p>
    </div>
  );
};

export default LogOut;
