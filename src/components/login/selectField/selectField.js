import React from 'react';
import Form from 'react-bootstrap/Form';
import './selectField.css';

function SelectField({ value, placeholder, icon, name, onChange, fieldError, handleInputFocus, specialityOptions }) {
  return (
    <>
      <div className={fieldError !== '' ? 'container_reuseable_field_error' : 'container_reuseable_field'}>
        <div className="container_reuseable___field_icon">
          <img src={icon} height={20} width={20} />
        </div>
        <Form.Select
          className="custom-select"
          aria-label="Default select example"
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleInputFocus}
        >
          <option value="">{placeholder}</option>
          {specialityOptions && specialityOptions?.map(({ id, nice_name }) => <option value={id}>{nice_name}</option>)}
        </Form.Select>
      </div>
      <div className="text-danger">
        <span>{fieldError}</span>
      </div>
    </>
  );
}

export default SelectField;
