import React from 'react';
import utils from '../../../utils/utils';
import { Link, useNavigate } from 'react-router-dom';
import './update-password.css';
import { useState } from 'react';
import { message, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { _authenticateUser } from '../../../redux/actions/authAction';
import { Row, Col } from 'react-bootstrap';
import PasswordField from '../../../components/resusable/inputField/passwordField';

import ButtonComponent from '../../../components/resusable/button/authButton';
import AuthScreensLayout from '../../../components/resusable/layout/authScreensLayout';
import { updatePassword } from '../../../components/https/settings/profileSettings';
import { errorRequestHandel } from '../../../helper';

function UpdatePassword() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputFocus = (fieldName) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: '',
    }));
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user_name, reset_password, otp } = useSelector((state) => state.auth.userNameData);

  const signIn = async () => {
    if (formData.newPassword === '' && formData.confirmPassword === '' && formData.oldPassword === '') {
      setErrors({
        oldPassword: 'This field is required',
        newPassword: 'This field is required',
        confirmPassword: 'This field is required',
      });
      return;
    }

    if (formData.oldPassword === '') {
      setErrors({ ...errors, oldPassword: 'This field is required' });
      return;
    }

    if (formData.oldPassword.length < 6) {
      setErrors({ ...errors, oldPassword: 'password must be at least 6 characters' });
      return;
    }

    if (formData.newPassword === '') {
      setErrors({ ...errors, newPassword: 'This field is required' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrors({ ...errors, newPassword: 'password must be at least 6 characters' });
      return;
    }

    if (formData.confirmPassword === '') {
      setErrors({ ...errors, confirmPassword: 'This field is required' });
      return;
    }

    if (formData.confirmPassword.length < 6) {
      setErrors({ ...errors, confirmPassword: 'password must be at least 6 characters' });
      return;
    }

    const payload = {
      current_password: formData.oldPassword,
      password: formData.newPassword,
      password_confirmation: formData.confirmPassword,
    };

    try {
      const response = await updatePassword(payload);
      if (response.status === 200) {
        navigate('/');
      }
    } catch (error) {
      errorRequestHandel({ error: error });
    }
  };

  return (
    <AuthScreensLayout
      cloudImage={utils.images.cloudBased}
      cloudHeading="Cloud Based"
      cloudDescription="Promotes access to information at the point of care. Improves the process of analysis and decision
    making."
      imageWidth={200}
    >
      <Row>
        <Col md={8}>
          <div className="updatePassword_form_container">
            <img src={utils.icons.Dentalid_logo} height={17} width={200} alt="logo" onClick={() => navigate('/')} />
            <h4>Update Password</h4>
            <p>Enter your old password</p>
            <div>
              <PasswordField
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleInputChange}
                placeholder="Old Password"
                icon={utils.icons.password}
                fieldError={errors.oldPassword}
                handleInputFocus={() => handleInputFocus('oldPassword')}
              />
            </div>
            <div>
              <PasswordField
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="New Password"
                icon={utils.icons.password}
                fieldError={errors.newPassword}
                handleInputFocus={() => handleInputFocus('newPassword')}
              />
            </div>
            <div>
              <PasswordField
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                icon={utils.icons.password}
                fieldError={errors.confirmPassword}
                handleInputFocus={() => handleInputFocus('confirmPassword')}
              />
            </div>
            <div>
              <ButtonComponent performClick={signIn} text="Update" buttonStyle={{ borderRadius: '22px' }} />
            </div>
          </div>
        </Col>
      </Row>
    </AuthScreensLayout>
  );
}

export default UpdatePassword;
