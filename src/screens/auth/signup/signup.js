import React, { useRef, useState } from 'react';
import AuthScreensLayout from '../../../components/resusable/layout/authScreensLayout';
import { Col, Row } from 'react-bootstrap';
import InputField from '../../../components/resusable/inputField/InputField';
import ButtonComponent from '../../../components/resusable/button/authButton';
import { Link, useNavigate } from 'react-router-dom';
import utils from '../../../utils/utils';
import PasswordField from '../../../components/resusable/inputField/passwordField';
import './signup.css';
import SelectField from '../../../components/login/selectField/selectField';
import { errorRequestHandel, isValidEmailAddress } from '../../../helper';
import { userRegister } from '../../../components/https/authentication';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { _addUserName } from '../../../redux/actions/authAction';

function Signup() {
  console.log(process.env.REACT_APP_BASE_URL, 'urls');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    speciality_id: '',
    country_id: 225,
  });

  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    speciality: '',
  });

  const inputRefs = {
    firstName: useRef(null),
    lastName: useRef(null),
    email: useRef(null),
    speciality: useRef(null),
    password: useRef(null),
  };

  const dispatch = useDispatch();

  const handleInputFocus = (fieldName) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: '',
    }));
  };

  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const navigate = useNavigate();
  const userNamePayload = { user_name: formData.email, reset_password: false };

  const handleSignUp = async () => {
    const updatedValues = { ...formData };
    const isEmailValid = isValidEmailAddress(formData.email);
    console.log(formData, 'formData');

    if (
      formData.first_name === '' &&
      formData.last_name === '' &&
      formData.email === '' &&
      formData.password === '' &&
      formData.speciality_id === ''
    ) {
      setErrors({
        first_name: 'This field is required',
        last_name: 'This field is required',
        email: 'This field is required',
        password: 'This field is required',
        speciality: 'This field is required',
      });
      inputRefs.firstName.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (formData.first_name === '') {
      setErrors({ ...errors, first_name: 'This field is required' });
      inputRefs.firstName.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (formData.last_name === '') {
      setErrors({ ...errors, last_name: 'This field is required' });
      inputRefs.firstName.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (formData.email === '') {
      setErrors({ ...errors, email: 'This field is required' });
      inputRefs.email.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (formData.email.includes(' ')) {
      setErrors({ ...errors, email: 'Email cannot contain spaces' });
      inputRefs.email.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!isEmailValid) {
      setErrors({ ...errors, email: 'Email address is not valid' });
      inputRefs.email.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (formData.speciality_id === '') {
      setErrors({ ...errors, speciality: 'This field is required' });
      inputRefs.speciality.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (formData.password === '') {
      setErrors({ ...errors, password: 'This field is required' });
      inputRefs.password.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (formData.password.length < 8) {
      setErrors({ ...errors, password: 'password must be at least 8 characters' });
      inputRefs.password.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    try {
      const response = await userRegister(updatedValues);

      if (response.status === 200) {
        dispatch(_addUserName(userNamePayload));
        navigate('/add-otp');
      }
    } catch (error) {
      console.log(error, 'error');
      errorRequestHandel({ error: error });
    }
  };

  const specialityOptions = [
    {
      id: 73,
      nice_name: 'Dentist',
    },
    {
      id: 74,
      nice_name: 'Physician',
    },
    {
      id: 75,
      nice_name: 'Radiologist',
    },
    {
      id: 76,
      nice_name: 'Researcher',
    },
  ];
  return (
    <AuthScreensLayout
      cloudImage={utils.images.signUpCloud}
      cloudHeading="Quality Assurance"
      cloudDescription="Follows IOFOS recommendations of age assessment Allows international consensus for assessment and improvements"
      imageWidth={270}
    >
      <Row>
        <Col md={8}>
          <div className="signup_form_container">
            <img src={utils.icons.Dentalid_logo} height={17} width={200} alt="logo" />
            <h4>Sign Up</h4>
            <p>
              Dental iDentification app is an odontology automated assessment tool, cloud-based, an all-in-one
              application solution.
            </p>
            <Row>
              <Col md={6}>
                <div className="firstName_container" ref={inputRefs.firstName}>
                  <InputField
                    loading={loading}
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    type="text"
                    icon={utils.icons.userAccount}
                    fieldError={errors.first_name}
                    handleInputFocus={() => handleInputFocus('first_name')}
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="lastName_container" ref={inputRefs.lastName}>
                  <InputField
                    loading={loading}
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    type="text"
                    icon={utils.icons.userAccount}
                    fieldError={errors.last_name}
                    handleInputFocus={() => handleInputFocus('last_name')}
                  />
                </div>
              </Col>
            </Row>
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
                handleInputFocus={() => handleInputFocus('email')}
              />
            </div>

            <div ref={inputRefs.speciality}>
              <SelectField
                name="speciality_id"
                value={formData.speciality_id}
                onChange={handleInputChange}
                loading={loading}
                placeholder="Speciality"
                type="text"
                icon={utils.icons.speciality}
                fieldError={errors.speciality}
                handleInputFocus={() => handleInputFocus('speciality')}
                specialityOptions={specialityOptions}
              />
            </div>

            <div ref={inputRefs.password}>
              <PasswordField
                loading={loading}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                icon={utils.icons.password}
                fieldError={errors.password}
                handleInputFocus={() => handleInputFocus('password')}
              />
            </div>
            <div>
              <ButtonComponent performClick={handleSignUp} text="Sign up" />
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

export default Signup;
