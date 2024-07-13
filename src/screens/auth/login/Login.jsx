import React, { useRef } from 'react';
import utils from '../../../utils/utils';
import { Link, useNavigate } from 'react-router-dom';

import { message, Spin } from 'antd';
import './login.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _authenticateUser } from '../../../redux/actions/authAction';
import { Row, Col } from 'react-bootstrap';
import InputField from '../../../components/resusable/inputField/InputField';
import PasswordField from '../../../components/resusable/inputField/passwordField';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ButtonComponent from '../../../components/resusable/button/authButton';
import AuthScreensLayout from '../../../components/resusable/layout/authScreensLayout';
import { errorRequestHandel, isValidEmailAddress } from '../../../helper';
import { userLogin } from '../../../components/https/authentication';


function Login(props) {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    password: '',
  });

  const inputRefs = {
    email: useRef(null),
    password: useRef(null),
  };

  const handleInputFocus = (fieldName) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: '',
    }));
  };

  const [loading, setLoading] = useState(false);
  const islogin = useSelector((state) => state.auth.isLoggin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signIn = async () => {
    const isEmailValid = isValidEmailAddress(formData.email);

    if (formData.email === '' && formData.password === '') {
      setErrors({
        email: 'This field is required',
        password: 'This field is required',
      });
      inputRefs.email.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (formData.email === '') {
      setErrors({
        ...errors,
        email: 'This field is required',
      });
      inputRefs.email.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (formData.email.includes(" ")) {
      setErrors({
        ...errors,
        email: 'Email cannot contain spaces',
      });
      inputRefs.email.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (!isEmailValid) {
      setErrors({
        ...errors,
        email: "Email address is not valid",
      });
      inputRefs.email.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (formData.password === '') {
      setErrors({
        ...errors,
        password: 'This field is required',
      });
      inputRefs.password.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (formData.password.length < 6) {
      setErrors({
        ...errors,
        password: "password must be at least 6 characters",
      });
      inputRefs.password.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    try {
      setLoading(true);
      const data = {
        user_name: formData.email,
        password: formData.password,
        is_otp: 0,
        firebase_token: 'XYZ',
      };
      const result = await userLogin(data);
      if (result.data.status_code == 200) {
        localStorage.setItem('user', JSON.stringify(result?.data?.data));
        dispatch(_authenticateUser(true));
        navigate('/');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      errorRequestHandel({ error: error });
    }
  };

  const goToForgetPassword = () => {
    navigate("/forget-password")
  }


  return (
    <AuthScreensLayout cloudImage={utils.images.cloudBased} cloudHeading="Cloud Based" cloudDescription="Promotes access to information at the point of care. Improves the process of analysis and decision
    making." imageWidth={200}>
      <Row>
        <Col md={8}>
          <div className="login_form_container">
            <img src={utils.icons.Dentalid_logo} height={17} width={200} alt="logo" />
            <h4>Login</h4>
            <p>
              Dental iDentification app is an odontology automated assessment tool, cloud-based, an all-in-one
              application solution.
            </p>
            <div ref={inputRefs.email}>
              <InputField
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                loading={loading}
                placeholder="Email Address"
                type="email"
                icon={utils.icons.email}
                fieldError={errors.email}
                handleInputFocus={() => handleInputFocus("email")}
              />
            </div>
            <div ref={inputRefs.password}>
              <PasswordField
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                loading={loading}
                placeholder="Password"
                icon={utils.icons.password}
                fieldError={errors.password}
                handleInputFocus={() => handleInputFocus("password")}
              />
            </div>
            <div>
              <div>
                <FormControlLabel
                  control={<Checkbox
                    defaultChecked
                    sx={{
                      color: "#CDCECE",
                      '&.Mui-checked': {
                        color: "#20C3FF",
                      },
                    }}
                  />}
                  sx={{
                    color: "#9496A8",
                    opacity: 1,
                    typography: {
                      fontSize: "7px", // Adjust the font size as needed
                    },
                  }}
                  label="Remember Me" />
              </div>

              <div onClick={goToForgetPassword}>Forgot Password?</div>

            </div>
            <div>
              <ButtonComponent performClick={signIn} text="Sign In" />
            </div>
            <div>
              Don't have account?<Link to="/sign-up"><span> Sign Up</span></Link>
            </div>
          </div>
        </Col>
      </Row>
    </AuthScreensLayout>
  );
}

export default Login;
