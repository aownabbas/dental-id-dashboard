import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import MeasureButton from "../../components/selections/measure/MeasureButton";
import utils from "../../utils/utils";
import "./selection.css";
import Layout from "../../components/resusable/layout/layout";
import { Col, Row } from "react-bootstrap";
import { _userProfileData } from "../../components/https/settings/profileSettings";
import { errorRequestHandel } from "../../helper";
import { _addUserProfileData } from "../../redux/actions/profileSettingsAction";
import { useDispatch } from "react-redux";

const Selections = (props) => {

  const ageAssessmentLink = 'https://dentalid-enterprise.web.app/';
  const dispatch = useDispatch();
  useEffect(() => {
    userProfileData();
  }, [])

  const userProfileData = async () => {
    try {
      const response = await _userProfileData();
      if (response.status === 200) {
        dispatch(_addUserProfileData(response.data.data))
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
    } catch (error) {
      errorRequestHandel({ error: error });
    }
  }

  return (
    <Layout>
      <div className="measure-container">
        <Row>
          <Col md={3}>
            <Link to="/length-measurement">
              <MeasureButton title={`Measure \n Length`}
                icon={utils.icons.measureMentArea} />
            </Link>
          </Col>
          <Col md={3}>
            <Link to="/area-measurement">
              <MeasureButton title={`Measure \n Area`}
                icon={utils.icons.measureArea} />
            </Link>
          </Col>
          <Col md={3}>
            <Link to="/ai-measurement">
              <MeasureButton title={`Measure \n Area (AI)`}
                icon={utils.icons.AreaAi} />
            </Link>
          </Col>
          <Col md={3}>
            <a href={ageAssessmentLink} target="_blank" rel="noopener noreferrer" >
              <MeasureButton title={`Age \n Assessment`}
                icon={utils.icons.AgeAssessment} />
            </a>
          </Col>
        </Row>

      </div>
    </Layout>
  );
};

export default Selections;
