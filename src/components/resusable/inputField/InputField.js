import React from 'react';
import './inputField.css';

function InputField({
  value,
  loading,
  placeholder,
  type,
  icon,
  name,
  onChange,
  fieldError,
  handleInputFocus,
  inputStyle,
}) {
  return (
    <>
      <div className={fieldError !== '' ? 'container_reuseable_field_error' : 'container_reuseable_field'}>
        {icon !== false ? (
          <div className="container_reuseable___field_icon">
            <img src={icon} height={20} width={20} />
          </div>
        ) : (
          <div className="container_reuseable___field_icon"></div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          required
          disabled={loading ? true : false}
          value={value}
          onChange={onChange}
          onFocus={handleInputFocus}
          style={inputStyle}
        />
      </div>
      <div className="text-danger">
        <span>{fieldError}</span>
      </div>
    </>
  );
}

export default InputField;
