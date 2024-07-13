import React, { useEffect, useRef, useState } from 'react';
import AuthScreensLayout from '../../../components/resusable/layout/authScreensLayout';
import { Col, Row } from 'react-bootstrap';
import InputField from '../../../components/resusable/inputField/InputField';
import ButtonComponent from '../../../components/resusable/button/authButton';
import { Link, useNavigate } from 'react-router-dom';
import utils from '../../../utils/utils';
import './update-profile.css';
import SelectField from '../../../components/login/selectField/selectField';
import { useDispatch } from 'react-redux';
import { _addUserName } from '../../../redux/actions/authAction';
import { errorRequestHandel, isValidEmailAddress } from '../../../helper';
import PasswordField from '../../../components/resusable/inputField/passwordField';
import { _getCoutriesList, updateProfile } from '../../../components/https/settings/profileSettings';
import { message } from 'antd';

function UpdateProfile() {
  const userdata = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    first_name: userdata?.first_name,
    last_name: userdata?.last_name,
    email: userdata?.email,
    license_number: userdata?.license_number,
    speciality: userdata?.speciality?.id,
    country: userdata?.country?.id,
  });

  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    license_number: '',
    speciality: '',
    country: '',
  });

  const inputRefs = {
    firstName: useRef(null),
    lastName: useRef(null),
    speciality: useRef(null),
    license_number: useRef(null),
    country: useRef(null),
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
  const userNamePayload = { user_name: formData.email, reset_license_number: false };

  const handleUpdateProfile = async () => {
    const updatedValues = { ...formData };

    if (
      formData.first_name === '' &&
      formData.last_name === '' &&
      formData.license_number === '' &&
      formData.speciality === '' &&
      formData.country === ''
    ) {
      setErrors({
        first_name: 'This field is required',
        last_name: 'This field is required',
        license_number: 'This field is required',
        speciality: 'This field is required',
        country: 'This field is required',
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

    if (formData.country === '') {
      setErrors({ ...errors, country: 'This field is required' });
      inputRefs.country.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (formData.speciality === '') {
      setErrors({ ...errors, speciality: 'This field is required' });
      inputRefs.speciality.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (formData.license_number === '') {
      setErrors({ ...errors, license_number: 'This field is required' });
      inputRefs.license_number.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    try {
      const response = await updateProfile(updatedValues);
      if (response.status === 200) {
        message.success('Updated successfully');
      }
    } catch (error) {
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

  const [countriesListing, setCountriesListing] = useState([]);
  const countriesList = async () => {
    try {
      const response = await _getCoutriesList();
      if (response.status === 200) {
        setCountriesListing(response?.data?.data);
      }
    } catch (error) {
      errorRequestHandel({ error: error });
    }
  };

  useEffect(() => {
    countriesList();
  }, []);

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
          <div className="update_profile_container">
            <img src={utils.icons.Dentalid_logo} height={17} width={200} alt="logo" onClick={() => navigate('/')} />
            <h4>Update Profile</h4>
            <p>Access and update your profile details</p>
            <p>Email: {formData?.email}</p>

            <div ref={inputRefs.firstName}>
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
            <div ref={inputRefs.lastName}>
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

            <div ref={inputRefs.country}>
              <SelectField
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                loading={loading}
                placeholder={userdata?.country?.nice_name}
                type="text"
                icon={utils.icons.countryIcon}
                fieldError={errors.country}
                handleInputFocus={() => handleInputFocus('country')}
                specialityOptions={countriesListing}
              />
            </div>

            <div ref={inputRefs.speciality}>
              <SelectField
                name="speciality"
                value={formData.speciality}
                onChange={handleInputChange}
                loading={loading}
                placeholder={userdata?.speciality?.value}
                type="text"
                icon={utils.icons.dentistIcon}
                fieldError={errors.speciality}
                handleInputFocus={() => handleInputFocus('speciality')}
                specialityOptions={specialityOptions}
              />
            </div>

            <div ref={inputRefs.license_number}>
              <InputField
                loading={loading}
                name="license_number"
                value={formData.license_number}
                onChange={handleInputChange}
                placeholder="License Number"
                icon={utils.icons.licenseIcon}
                fieldError={errors.license_number}
                handleInputFocus={() => handleInputFocus('license_number')}
              />
            </div>
            <div>
              <ButtonComponent
                performClick={handleUpdateProfile}
                buttonStyle={{ borderRadius: '22px', marginBottom: '20px' }}
                text="Save Changes"
              />
            </div>
          </div>
        </Col>
      </Row>
    </AuthScreensLayout>
  );
}

export default UpdateProfile;
