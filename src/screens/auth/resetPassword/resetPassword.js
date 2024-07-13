import React from 'react';
import utils from '../../../utils/utils';
import { Link, useNavigate } from 'react-router-dom';
import './reset-password.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _authenticateUser } from '../../../redux/actions/authAction';
import { Row, Col } from 'react-bootstrap';
import PasswordField from '../../../components/resusable/inputField/passwordField';

import ButtonComponent from '../../../components/resusable/button/authButton';
import AuthScreensLayout from '../../../components/resusable/layout/authScreensLayout';
import { userResetPassword } from '../../../components/https/authentication';
import { errorRequestHandel } from '../../../helper';

function ResetPassword() {
  const [formData, setFormData] = useState({
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
  console.log(user_name, reset_password, otp, 'user_name');

  const signIn = async () => {
    if (formData.newPassword === '' && formData.confirmPassword === '') {
      setErrors({
        newPassword: 'This field is required',
        confirmPassword: 'This field is required',
      });
      return;
    }

    if (formData.newPassword === '') {
      setErrors({ ...errors, newPassword: 'This field is required' });
      return;
    }

    if (formData.newPassword.length < 8) {
      setErrors({ ...errors, newPassword: 'password must be at least 8 characters' });
      return;
    }

    if (formData.confirmPassword === '') {
      setErrors({ ...errors, confirmPassword: 'This field is required' });
      return;
    }

    if (formData.confirmPassword.length < 8) {
      setErrors({ ...errors, confirmPassword: 'password must be at least 8 characters' });
      return;
    }

    const payload = {
      user_name: user_name,
      otp: otp,
      password: formData.newPassword,
      password_confirmation: formData.confirmPassword,
    };

    try {
      const response = await userResetPassword(payload);
      if (response.status === 200) {
        navigate('/login');
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
          <div className="resetPassword_form_container">
            <img src={utils.icons.Dentalid_logo} height={17} width={200} alt="logo" />
            <h4>Reset Password</h4>
            <p>Enter your new password</p>
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
              <ButtonComponent performClick={signIn} text="Sign In" />
            </div>
            <div>
              Don't have account?
              <Link to="/sign-up">
                <span> Sign Up</span>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </AuthScreensLayout>
  );
}

export default ResetPassword;
