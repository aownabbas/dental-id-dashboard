import React, { useEffect } from 'react';
import Layout from '../../components/resusable/layout/layout';
import SubscriptionCard from '../../components/resusable/card/subscription-card';
import styles from './subscriptions-plan.module.css';
import utils from '../../utils/utils';
import { _subscribeCancel, _subscribeSuccess } from '../../components/https/planSubscriptions';
import { errorRequestHandel } from '../../helper';
import { useLocation, useNavigate } from 'react-router-dom';
import { _userProfileData } from '../../components/https/settings/profileSettings';
import { _addUserProfileData } from '../../redux/actions/profileSettingsAction';
import { useDispatch } from 'react-redux';

function SubscribeConfirmation() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const plan_id = searchParams.get('plan_id');
  const confirmationTypes = searchParams.get('subscription');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSuccess = async () => {
    try {
      const response = await _subscribeSuccess(plan_id);
      if (response.status === 200) {
        console.log(response.data, 'data');
      }
    } catch (error) {
      errorRequestHandel({ error: error });
    }
  };

  const handleCancel = async () => {
    try {
      const response = await _subscribeCancel(plan_id);
      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (error) {
      errorRequestHandel({ error: error });
    }
  };

  const userProfileData = async () => {
    try {
      const response = await _userProfileData();
      if (response.status === 200) {
        dispatch(_addUserProfileData(response.data.data));
        localStorage.setItem('user', JSON.stringify(response.data.data));
        dispatch(_addUserProfileData(response.data.data));
      }
    } catch (error) {
      errorRequestHandel({ error: error });
    }
  };

  useEffect(() => {
    if (confirmationTypes && confirmationTypes === 'success') {
      handleSuccess();
    } else {
      handleCancel();
    }
    // user profile api
    userProfileData();
  }, []);

  return (
    <Layout>
      {confirmationTypes && confirmationTypes === 'success' ? (
        <div className={`${styles.subscribe_container} col-md-4 offset-md-4`}>
          <SubscriptionCard
            icon={utils.icons.successIcon}
            heading="Payment Confirmed!"
            description="Your subscription has been activated. Thanks for subscribing!"
            buttonTitle="Continue"
            performClick={() => navigate('/')}
          />
        </div>
      ) : (
        <div className={`${styles.subscribe_container} col-md-4 offset-md-4`}>
          <SubscriptionCard
            icon={utils.icons.cancelIcon}
            heading="Payment Failed!"
            description="We couldn’t process your payment. Verify your payment information and try again. For ongoing issues, please reach out to our support team for help."
            buttonTitle="Retry"
            performClick={() => navigate('/subscriptions-plan')}
          />
        </div>
      )}
    </Layout>
  );
}

export default SubscribeConfirmation;
