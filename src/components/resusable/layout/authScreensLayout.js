import React from 'react';
import { Col, Row } from 'react-bootstrap';
import '../../../screens/auth/login/login.css';

function AuthScreensLayout({ children, cloudImage, cloudHeading, cloudDescription,imageWidth }) {
  return (
    <div className="login_container">
      <Row>
        <Col md={8}>{children}</Col>
        <Col md={4}>
          <div className="right_side_content">
            <div>
              <img src={cloudImage} height={200} width={imageWidth} alt="logo" />
              <p>{cloudHeading}</p>
              <p>{cloudDescription}</p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default AuthScreensLayout;
