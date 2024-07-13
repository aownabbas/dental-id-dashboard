import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Layout from '../../components/resusable/layout/layout';
import utils from '../../utils/utils';
import './contact-us.css';
import { errorRequestHandel, isValidEmailAddress } from '../../helper';
import { _contactUs } from '../../components/https/contact-us';
import { message } from 'antd';

const ContactUs = () => {
  const [type, setType] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    message: '',
    phone_number: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    name: '',
    message: '',
    phone_number: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedValues = { ...formData };
    const isEmailValid = isValidEmailAddress(formData.email);

    if (!formData.name && !formData.email && !formData.phone_number && !formData.message) {
      setErrors({
        name: 'This field is required',
        email: 'This field is required',
        phone_number: 'This field is required',
        message: 'This field is required',
      });
      return;
    }

    if (!formData.name) {
      setErrors({
        ...errors,
        name: 'This field is required',
      });
      return;
    }

    if (!formData.phone_number) {
      setErrors({
        ...errors,
        phone_number: 'This field is required',
      });
      return;
    }

    if (!formData.email) {
      setErrors({
        ...errors,
        email: 'This field is required',
      });
      return;
    }

    if (formData.email.includes(' ')) {
      setErrors({
        ...errors,
        email: 'Email cannot contain spaces',
      });
      return;
    }

    if (!isEmailValid) {
      setErrors({
        ...errors,
        email: 'Email address is not valid',
      });
      return;
    }

    if (!formData.message) {
      setErrors({
        ...errors,
        message: 'This field is required',
      });
      return;
    }

    try {
      const response = await _contactUs(updatedValues);

      if (response.status === 200) {
        message.success('Successfully Submitted');
        setFormData({
          email: '',
          name: '',
          message: '',
          phone_number: '',
        });
      }
    } catch (error) {
      errorRequestHandel({ error: error });
    }
  };

  return (
    <Layout>
      <div className="contact-us-container">
        <div className="block-title">
          <h2>Contact Us</h2>
          <p>Email address : info@dentalid.ae</p>
        </div>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg={5} md={12}>
              <Form.Group controlId="name" className="">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
                {errors.name && <div className="error-text">{errors.name}</div>}
              </Form.Group>
              <Form.Group controlId="number">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="number"
                  // placeholder="+92313456789"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="hide-spinners"
                />
                {errors.phone_number && <div className="error-text">{errors.phone_number}</div>}
                {/* <div className="mobile_num_container">
                <div>
                  <Form.Control as="select" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="+9231">+9231</option>
                    <option value="+492">+492</option>
                    <option value="+292">+292</option>
                  </Form.Control>
                </div>
                <div>
                  
                </div>
              </div> */}
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
                {errors.email && <div className="error-text">{errors.email}</div>}
              </Form.Group>
            </Col>
            <Col lg={4} md={12} className="message">
              <Form.Group controlId="message">
                <Form.Label>Message</Form.Label>
                <Form.Control as="textarea" rows="4" name="message" value={formData.message} onChange={handleChange} />
                {errors.message && <div className="error-text">{errors.message}</div>}
              </Form.Group>
              <div className="recaptcha_container">
                <div>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox />} label="I'm not a robot" sx={{ color: 'black' }} />
                  </FormGroup>
                </div>
                <div>
                  <img src={utils.images.recaptcha} alt="recaptcha" height={60} width={60} />
                </div>
              </div>
              <Button type="submit">Send Message</Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Layout>
  );
};

export default ContactUs;
