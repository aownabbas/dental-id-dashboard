import React, { useState } from 'react';
import './inputField.css';
import utils from '../../../utils/utils';

function PasswordField({ value, loading, placeholder, icon, name, onChange, fieldError, handleInputFocus }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <div className={fieldError !== '' ? 'container_reuseable_field_error' : 'container_reuseable_field'}>
        <div className="container_reuseable___field_icon">
          <img src={icon} height={20} width={20} />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          required
          name={name}
          disabled={loading ? true : false}
          value={value}
          onChange={onChange}
          onFocus={handleInputFocus}
        />
        <div className="container_reuseable___field_icon" onClick={handleTogglePassword}>
          {showPassword ? (
            <img src={utils.icons.showPassword} height={20} width={20} />
          ) : (
            <img src={utils.icons.hidenPassword} height={20} width={20} />
          )}
        </div>
      </div>
      <div className="text-danger">
        <span>{fieldError}</span>
      </div>
    </>
  );
}

export default PasswordField;
