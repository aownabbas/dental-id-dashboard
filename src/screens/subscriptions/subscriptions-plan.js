import React, { useEffect, useState } from 'react';
import { Container, Tab } from 'react-bootstrap';
import styles from './subscriptions-plan.module.css';
import assessment_icon from '../../assets/icons/assessment-icon.svg';
import case_icon from '../../assets/icons/case_icon.svg';
import quick_icon from '../../assets/icons/quickIcon.svg';
import pdf_icon from '../../assets/icons/pdf-icon.svg';
import access_icon from '../../assets/icons/access-icon.svg';
import analysis_icon from '../../assets/icons/analysis-icon.svg';
import support_icon from '../../assets/icons/support-icon.svg';
import ButtonComponent from '../../components/resusable/button/authButton';
import assessment_icon_ent from '../../assets/icons/assessment_icon_ent.svg';
import case_icon_ent from '../../assets/icons/case_icon_ent.svg';
import manage_icon_ent from '../../assets/icons/manage_icon.svg';
import premise from '../../assets/icons/premise.svg';
import privacy from '../../assets/icons/privacy.svg';
import security from '../../assets/icons/security.svg';
import security_ent from '../../assets/icons/security_ent.svg';
import { Col, Row } from 'react-bootstrap';
import SeeAllMethods from '../../components/modal/see-all-methods/seeAllMethods';
import Layout from '../../components/resusable/layout/layout';
import { Nav } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { errorRequestHandel, findPlanValuesWithType } from '../../helper';
import { _userProfileData } from '../../components/https/settings/profileSettings';
import { _plansListing, _subscribeFreePlan, _subscribePlan } from '../../components/https/planSubscriptions';
import { useNavigate } from 'react-router-dom';
import FreeSubscriptionModal from '../../components/modal/see-all-methods/freeSubscriptionModal';
import utils from '../../utils/utils';
import { _addUserProfileData } from '../../redux/actions/profileSettingsAction';

const pricngPlans_data = [
  {
    assessment_text: 'Age Assessment',
    assessment_icon: assessment_icon,
    caseText: '5 Cases Per Month',
    caseIcon: case_icon,
    quickText: 'Quick Preview',
    quick_icon: quick_icon,
    pdfReport: 'PDF Report Generation',
    pdfIcon: pdf_icon,
    accessText: 'Access To All Methods',
    accessIcon: access_icon,
    schourText: 'Schour Method',
    ubelakerText: 'Ubelaker Method',
    seeText: 'See All',
    analysisText: 'Image Analysis',
    analysisIcon: analysis_icon,
    measureText: 'Measure Length',
    measureAreaText: 'Measure Area',
    measureAiText: 'Measure Area (AI)',
    supportText: 'Support',
    supportIcon: support_icon,
    generalText: 'General Support Via Email',
    bannerText: 'Free',
    buttonText: 'SELECT',
  },
  {
    monthlyTitle: 'USD 80 Billed Monthly',
    yearlyTitle: 'USD 60 Per Month Billed Annually',
    assessment_text: 'Age Assessment',
    assessment_icon: assessment_icon,
    caseText: 'Unlimited Cases',
    caseIcon: case_icon,
    quickText: 'Quick Preview',
    quick_icon: quick_icon,
    pdfReport: 'PDF Report Generation',
    pdfIcon: pdf_icon,
    accessText: 'Access To All Methods',
    accessIcon: access_icon,
    schourText: 'Schour Method',
    ubelakerText: 'Ubelaker Method',
    seeText: 'See All',
    analysisText: 'Image Analysis',
    analysisIcon: analysis_icon,
    measureText: 'Measure Length',
    measureAreaText: 'Measure Area',
    measureAiText: 'Measure Area (AI)',
    supportText: 'Support',
    supportIcon: support_icon,
    generalText: 'General Support Via Email',
    bannerText: 'Standard',
    buttonText: 'CURRENT PLAN',
  },
  {
    assessment_text: 'Everything In Standard Plus',
    assessment_icon: assessment_icon_ent,
    caseText: 'Administration Panel',
    caseIcon: case_icon_ent,
    quickText: 'Manage Users',
    quick_icon: manage_icon_ent,
    pdfReport: 'Reports',
    pdfIcon: pdf_icon,
    accessText: 'Access To All Methods',
    accessIcon: access_icon,
    schourText: 'Schour Method',
    ubelakerText: 'Ubelaker Method',
    seeText: 'See All',
    analysisText: 'Image Analysis',
    analysisIcon: analysis_icon,
    measureText: 'Measure Length',
    measureAreaText: 'Measure Area',
    measureAiText: 'Measure Area (AI)',
    supportText: 'Support',
    supportIcon: support_icon,
    generalText: 'General Support Via Email',
    bannerText: 'Enterprise',
  },
];
function SubscriptionsPlan() {
  const [open, setOpen] = useState(false);
  const [openFreeSubscriptionModal, setOpenFreeSubscriptionModal] = useState(false);

  const closeDentalIdModal = () => setOpen(false);
  const userdata = useSelector((state) => state.settings_data.profileSettings_data);
  const [subscriptionPlanList, setSubscriptionPlanList] = useState();
  const [userDataForFreeSubscriptions, setUserDataForFreeSubscriptions] = useState(null);

  const [activeKey, setActiveKey] = useState(
    userdata?.subscription.type == 'free' ? 'monthly' : userdata?.subscription.type,
  );
  const navigate = useNavigate();
  const { location } = window;
  const dispatch = useDispatch();

  const [plansData, setPlansData] = useState({
    freePlanValues: null,
    standardMonthlyPlanValues: null,
    standardYearlyPlanValues: null,
  });

  useEffect(() => {
    checkSubscriptionData();
    planListings();
  }, []);

  const checkSubscriptionData = async () => {
    if (userdata?.length === 0 || userdata?.length === null || userdata?.length === undefined) {
      await userProfileData();
    }
  };

  const userProfileData = async () => {
    try {
      const response = await _userProfileData();
      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        dispatch(_addUserProfileData(response.data.data));
      }
    } catch (error) {
      errorRequestHandel({ error: error });
    }
  };

  const planListings = async () => {
    try {
      const response = await _plansListing();
      
      if (response.status === 200) {
        setSubscriptionPlanList(response.data.data);
        setPlansData({
          freePlanValues: findPlanValuesWithType(response?.data.data, 'free'),
          standardMonthlyPlanValues: findPlanValuesWithType(response?.data.data, 'monthly'),
          standardYearlyPlanValues: findPlanValuesWithType(response?.data.data, 'yearly'),
        });
      }
    } catch (error) {
      errorRequestHandel({ error: error });
    }
  };

  const handleSeeAllMethods = () => {
    setOpen(true);
  };

  const handleSubscriptions = async (id, slug) => {
    if (slug === 'free') {
      try {
        const response = await _subscribeFreePlan();
        if (response.status === 200) {
          const free_subs = response?.data?.data?.user;
          if (free_subs) {
            setUserDataForFreeSubscriptions(free_subs);
            localStorage.setItem('user', JSON.stringify(free_subs));
            dispatch(_addUserProfileData(free_subs));
          }
        }
      } catch (error) {
        errorRequestHandel({ error: error });
      }
    } else {
      try {
        const response = await _subscribePlan(id);
        if (response.status === 200) {
          const url = response?.data?.data?.url;
          if (url) {
            location.replace(url);
          }
        }
      } catch (error) {
        errorRequestHandel({ error: error });
      }
    }
  };

  function renderSubscriptionButton(item) {
    if (!userdata || !item) {
      return null; // or render a loading state or some other fallback
    }

    const { subscription } = userdata;
    const { bannerText } = item;
    const buttonStyle = {
      padding: '12px',
      backgroundColor: '#ffffff',
      border: '1px solid #e1e1e1',
      boxShadow: '0px 10px 23px #0000000f',
      color: '#20c3ff',
    };

    if (subscription.type === 'free' && bannerText === 'Free') {
      return (
        <ButtonComponent
          text="CURRENT PLAN"
          performClick={() => openConfirmationModal(plansData?.freePlanValues?.id, plansData?.freePlanValues?.slug)}
          buttonStyle={buttonStyle}
          disabled={true}
        />
      );
    } else if (subscription.type === 'monthly' && activeKey === 'monthly' && bannerText === 'Standard') {
      return (
        <ButtonComponent
          text="CURRENT PLAN"
          performClick={() =>
            openConfirmationModal(plansData?.standardMonthlyPlanValues?.id, plansData?.standardMonthlyPlanValues?.slug)
          }
          buttonStyle={buttonStyle}
          disabled={true}
        />
      );
    } else if (subscription.type === 'monthly' && activeKey === 'yearly' && bannerText === 'Standard') {
      return (
        <ButtonComponent
          text="SELECT"
          performClick={() =>
            openConfirmationModal(plansData?.standardYearlyPlanValues?.id, plansData?.standardYearlyPlanValues?.slug)
          }
          buttonStyle={{
            padding: '12px',
          }}
        />
      );
    } else if (subscription.type === 'yearly' && activeKey === 'yearly' && bannerText === 'Standard') {
      return (
        <ButtonComponent
          text="CURRENT PLAN"
          performClick={() =>
            openConfirmationModal(plansData?.standardYearlyPlanValues?.id, plansData?.standardYearlyPlanValues?.slug)
          }
          buttonStyle={buttonStyle}
          disabled={true}
        />
      );
    } else if (subscription.type === 'free' && activeKey === 'monthly' && bannerText === 'Standard') {
      return (
        <ButtonComponent
          text="SELECT"
          performClick={() =>
            handleSubscriptions(plansData?.standardMonthlyPlanValues?.id, plansData?.standardMonthlyPlanValues?.slug)
          }
          buttonStyle={{
            padding: '12px',
          }}
        />
      );
    } else if (subscription.type === 'free' && activeKey === 'yearly' && bannerText === 'Standard') {
      return (
        <ButtonComponent
          text="SELECT"
          performClick={() =>
            handleSubscriptions(plansData?.standardYearlyPlanValues?.id, plansData?.standardYearlyPlanValues?.slug)
          }
          buttonStyle={{
            padding: '12px',
          }}
        />
      );
    } else if (subscription.type === 'yearly' && activeKey === 'monthly' && bannerText === 'Standard') {
      return (
        <ButtonComponent
          text="SELECT"
          performClick={() =>
            openConfirmationModal(plansData?.standardMonthlyPlanValues?.id, plansData?.standardMonthlyPlanValues?.slug)
          }
          buttonStyle={{
            padding: '12px',
          }}
        />
      );
    } else if (subscription.type !== 'free' && bannerText === 'Free') {
      return (
        <ButtonComponent
          text="START FREE NOW"
          performClick={() => openConfirmationModal(plansData?.freePlanValues?.id, plansData?.freePlanValues?.slug)}
          buttonStyle={{
            padding: '12px',
          }}
        />
      );
    }
  }

  // Subscription Modals code

  const [modalValues, setModalValues] = useState({
    heading: '',
    description: '',
    id: '',
    slug: '',
  });

  const openConfirmationModal = (id, slug) => {
    if (slug === 'free') {
      setModalValues({
        heading: 'Confirm Plan Change',
        description:
          'Are you sure you want to switch to the Free Plan? This will cancel your current paid subscription.',
        id: id,
        slug: slug,
      });
      setOpenFreeSubscriptionModal(true);
    } else if (slug === 'monthly') {
      setModalValues({
        heading: 'Confirm Subscription Change',
        description:
          'You are about to change your subscription from yearly plan to monthly plan. This will update your billing cycle and charges accordingly.',
        id: id,
        slug: slug,
      });
      setOpenFreeSubscriptionModal(true);
    } else if (slug === 'yearly') {
      setModalValues({
        heading: 'Confirm Subscription Change',
        description:
          'You are about to change your subscription from monthly plan to yearly plan. This will update your billing cycle and charges accordingly.',
        id: id,
        slug: slug,
      });
      setOpenFreeSubscriptionModal(true);
    }
  };

  const subscriptionConfirmation = () => {
    handleSubscriptions(modalValues?.id, modalValues?.slug);
    setOpenFreeSubscriptionModal(false);
  };

  return (
    <Layout>
      <div className={styles.pricing_plan_container}>
        <Nav className={`nav ${styles.tab_title} ${styles.nav_item}`}>
          <Nav.Item>
            <Nav.Link
              className={activeKey === 'monthly' ? styles.nav_link : ''}
              eventKey="monthly"
              onClick={() => setActiveKey('monthly')}
            >
              MONTHLY
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="yearly"
              className={activeKey === 'yearly' ? styles.nav_link : ''}
              onClick={() => setActiveKey('yearly')}
            >
              YEARLY{` `}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Row>
          {pricngPlans_data?.map((item, index) => (
            <Col lg={4}>
              {index === 0 || index === 1 ? (
                <div className={styles.pricing_plan_card}>
                  <h1>{item.bannerText}</h1>
                  <p className={styles.standard_plan_title}>
                    {activeKey === 'monthly' && item.bannerText === 'Standard'
                      ? `USD ${plansData?.standardMonthlyPlanValues?.price} Billed Monthly`
                      : activeKey === 'yearly' && item.bannerText === 'Standard'
                      ? `USD ${plansData?.standardYearlyPlanValues?.price/12} Per Month Billed Annually`
                      : ''}
                  </p>
                  <hr></hr>
                  <div>
                    <img src={item.assessment_icon} height={15} width={15} alt="assessment icon" />
                    <p>{item.assessment_text}</p>
                  </div>
                  <div>
                    <img src={item.caseIcon} height={15} width={15} alt="assessment icon" />
                    <p>{item.caseText}</p>
                  </div>
                  <div>
                    <img src={item.quick_icon} height={15} width={15} alt="assessment icon" />
                    <p>{item.quickText}</p>
                  </div>
                  <div>
                    <img src={item.pdfIcon} height={15} width={15} alt="assessment icon" />
                    <p>{item.pdfReport}</p>
                  </div>
                  <div>
                    <img src={item.accessIcon} height={15} width={15} alt="assessment icon" />
                    <div>
                      <p>{item.accessText}</p>
                      <p>{item.schourText}</p>
                      <p>{item.ubelakerText}</p>
                      <p onClick={handleSeeAllMethods}>{item.seeText}</p>
                    </div>
                  </div>
                  <div>
                    <img src={item.analysisIcon} height={15} width={15} alt="assessment icon" />
                    <div>
                      <p>{item.analysisText}</p>
                      <p>{item.measureText}</p>
                      <p>{item.measureAreaText}</p>
                      <p>{item.measureAiText}</p>
                    </div>
                  </div>
                  <div>
                    <img src={item.supportIcon} height={15} width={15} alt="assessment icon" />
                    <div>
                      <p>{item.supportText}</p>
                      <p>{item.generalText}</p>
                    </div>
                  </div>
                  <div>{renderSubscriptionButton(item)}</div>
                </div>
              ) : (
                <div className={styles.enterprize_plan_card}>
                  <h1 className={styles.enterprize_head}>{item.bannerText}</h1>
                  <p className={styles.standard_plan_title}>{item.title}</p>
                  <hr></hr>
                  <div>
                    <img src={item.assessment_icon} height={15} width={15} alt="assessment icon" />
                    <p>{item.assessment_text}</p>
                  </div>
                  <div>
                    <img src={item.caseIcon} height={15} width={15} alt="assessment icon" />
                    <p>{item.caseText}</p>
                  </div>
                  <div>
                    <img src={item.quick_icon} height={15} width={15} alt="assessment icon" />
                    <p>{item.quickText}</p>
                  </div>
                  <div>
                    <img src={item.pdfIcon} height={15} width={15} alt="assessment icon" />
                    <div>
                      <p>{item.pdfReport}</p>
                      <p></p>
                    </div>
                  </div>
                  <div>
                    <img src={premise} height={15} width={15} alt="assessment icon" />
                    <div>
                      <p>On Premise Installation</p>
                    </div>
                  </div>
                  <div className={styles.privacy_data}>
                    <img src={privacy} height={15} width={15} alt="assessment icon" />
                    <p>Private Data</p>
                  </div>
                  <div className={styles.data_privacy}>
                    <img src={security} height={15} width={15} alt="assessment icon" />
                    <p>Data Privacy</p>
                  </div>
                  <div className={styles.security}>
                    <img src={security_ent} height={15} width={15} alt="assessment icon" />
                    <p>Security</p>
                  </div>
                  <div className={styles.support_priority}>
                    <img src={support_icon} height={15} width={15} alt="assessment icon" />
                    <div>
                      <p>Support</p>
                      <p>Priority Support</p>
                    </div>
                  </div>

                  <div>
                    <ButtonComponent
                      text="CONTACT SALES"
                      buttonStyle={{
                        padding: '12px',
                        marginTop: '8px',
                      }}
                    />
                  </div>
                </div>
              )}
            </Col>
          ))}
        </Row>
      </div>
      <SeeAllMethods open={open} closeDentalIdModal={closeDentalIdModal} />
      <FreeSubscriptionModal
        heading={modalValues.heading}
        description={modalValues.description}
        successButtonText="Confirm"
        failureButtonText="Cancel"
        icon={utils.icons.alertTriangleIcon}
        open={openFreeSubscriptionModal}
        closeDentalIdModal={() => setOpenFreeSubscriptionModal(false)}
        performConfirmation={subscriptionConfirmation}
      />
    </Layout>
  );
}

export default SubscriptionsPlan;
