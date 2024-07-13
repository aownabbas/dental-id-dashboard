import { Button } from '@mui/material';
import React from 'react';
import '../inputField/inputField.css';

function ButtonComponent({ performClick, text, buttonStyle, disabled }) {
  return (
    <button className="auth_button" style={buttonStyle} onClick={performClick} disabled={disabled}>
      {text}
    </button>
  );
}

export default ButtonComponent;
