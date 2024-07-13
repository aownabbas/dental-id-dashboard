import React from 'react';
import utils from '../../../utils/utils';
import { Link, useNavigate } from 'react-router-dom';

import { message, Spin } from 'antd';
import './forgetPassword.css';
import { useState } from 'react';
import { _addUserName, _authenticateUser } from '../../../redux/actions/authAction';
import { Row, Col } from 'react-bootstrap';
import InputField from '../../../components/resusable/inputField/InputField';
import ButtonComponent from '../../../components/resusable/button/authButton';
import AuthScreensLayout from '../../../components/resusable/layout/authScreensLayout';
import { errorRequestHandel, isValidEmailAddress } from '../../../helper';
import { userForgetPassword } from '../../../components/https/authentication';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

function ForgetPassword() {
  const [formData, setFormData] = useState({
    email: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const [errors, setErrors] = useState({
    email: '',
  });

  const dispatch = useDispatch();

  const handleInputFocus = (fieldName) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: '',
    }));
  };

  const navigate = useNavigate();

  const userNamePayload = { user_name: formData.email, reset_password: true };

  const forgetPassword = async () => {
    const updatedValues = { ...formData };
    const isEmailValid = isValidEmailAddress(formData.email);

    if (formData.email === '') {
      setErrors({ ...errors, email: 'This field is required' });
      return;
    }

    if (formData.email.includes(' ')) {
      setErrors({ ...errors, email: 'Email cannot contain spaces' });
      return;
    }

    if (!isEmailValid) {
      setErrors({ ...errors, email: 'Email address is not valid' });
      return;
    }
    try {
      const response = await userForgetPassword(updatedValues);
      if (response.status === 200) {
        console.log(response.data, 'responsee');
        message.success(response?.data?.message);
        dispatch(_addUserName(userNamePayload));
        navigate('/add-otp');
      }
    } catch (error) {
      errorRequestHandel({ error: error });
    }
  };

  return (
    <AuthScreensLayout
      cloudImage={utils.images.forgetPasswordCloud}
      cloudHeading="Quality Assurance"
      cloudDescription="Follows IOFOS recommendations of age assessment Allows international consensus for assessment and improvements"
      imageWidth={220}
    >
      <Row>
        <Col md={8}>
          <div className="forgetPassword_form_container">
            <img src={utils.icons.Dentalid_logo} height={17} width={200} alt="logo" />
            <h4>Forget Password</h4>
            <p>Enter a email address we will send you instruction to reset password.</p>
            <div>
              <InputField
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                type="email"
                icon={utils.icons.email}
                fieldError={errors.email}
                handleInputFocus={() => handleInputFocus('email')}
              />
            </div>
            <div>
              <ButtonComponent performClick={forgetPassword} text="Send OTP" />
            </div>
            <div>
              Already have an account?
              <Link to="/login">
                <span> Sign In</span>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </AuthScreensLayout>
  );
}

export default ForgetPassword;
