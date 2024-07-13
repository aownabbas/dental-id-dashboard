import React from 'react';
import utils from '../../../utils/utils';
import { Link, useNavigate } from 'react-router-dom';

import { message, Spin } from 'antd';
import './otp.css';
import { useState } from 'react';
import { _addUserName, _authenticateUser } from '../../../redux/actions/authAction';
import { Row, Col } from 'react-bootstrap';
import InputField from '../../../components/resusable/inputField/InputField';
import ButtonComponent from '../../../components/resusable/button/authButton';
import AuthScreensLayout from '../../../components/resusable/layout/authScreensLayout';
import { verifyUserOtp } from '../../../components/https/authentication';
import { errorRequestHandel, isValidEmailAddress } from '../../../helper';
import { useDispatch, useSelector } from 'react-redux';

function OtpScreen() {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    otp: '',
  });

  const handleInputFocus = (fieldName) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: '',
    }));
  };

  const dispatch = useDispatch();
  const { user_name, reset_password } = useSelector((state) => state.auth.userNameData);
  console.log(user_name, reset_password, 'user_name');

  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Initialize with 4 empty strings

  const handleInputChange = (index, event) => {
    const value = event.target.value;

    // Check if the input is a digit and update the state
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;

      // Move to the next input field automatically
      console.log(index, 'index');
      if (index < 5 && value !== '') {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }

      setOtp(newOtp);
    }
  };

  const handleOtp = async () => {
    const areAllDigitsEmpty = otp.every((digit) => digit.trim() === '');
    const hasNonEmptyDigit = otp.some((digit) => digit.trim() === '');

    if (areAllDigitsEmpty) {
      setErrors({ ...errors, otp: 'Otp is required' });
      return;
    }

    if (hasNonEmptyDigit) {
      setErrors({ ...errors, otp: 'OTP must be 6 digits. Please enter a valid code' });
      return;
    }
    const concatenatedOtp = getConcatenatedOtp();
    const payload = {
      user_name: user_name,
      otp: concatenatedOtp,
    };
    const userNamePayload = { reset_password: true, user_name: user_name, otp: concatenatedOtp };
    try {
      const response = await verifyUserOtp(payload);
      if (response.status === 200) {
        if (reset_password === false) {
          navigate('/login');
        } else {
          dispatch(_addUserName(userNamePayload));
          navigate('/reset-password');
        }
      }
    } catch (error) {
      errorRequestHandel({ error: error });
    }
  };

  const getConcatenatedOtp = () => {
    return otp.join('');
  };
  return (
    <AuthScreensLayout
      cloudImage={utils.images.forgetPasswordCloud}
      cloudHeading="Cloud Based"
      cloudDescription="Promotes access to information at the point of care. Improves the process of analysis and decision making."
      imageWidth={220}
    >
      <Row>
        <Col md={8}>
          <div className="otp_form_container">
            <img src={utils.icons.Dentalid_logo} height={17} width={200} alt="logo" />
            <h4>OTP</h4>
            <p>Enter a 6 digit OTP we sent on your email address.</p>
            <div className={errors.otp === '' ? 'otp_field_container' : 'otp_field_container_error'}>
              {otp.map((digit, index) => (
                <React.Fragment key={index}>
                  <input
                    id={`otp-input-${index}`}
                    type="text"
                    name={otp}
                    value={digit}
                    maxLength="1"
                    onChange={(event) => handleInputChange(index, event)}
                    style={{ textAlign: 'center', marginRight: '5px' }}
                    onFocus={() => handleInputFocus('otp')}
                  />
                  {index < 5 && (
                    <span>
                      <hr></hr>
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="text-danger">
              <span>{errors.otp}</span>
            </div>
            <div>
              <ButtonComponent performClick={handleOtp} text="Verify" />
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

export default OtpScreen;
