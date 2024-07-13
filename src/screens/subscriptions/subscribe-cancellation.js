import React, { useEffect } from 'react';
import Layout from '../../components/resusable/layout/layout';
import SubscriptionCard from '../../components/resusable/card/subscription-card';
import styles from './subscriptions-plan.module.css';
import utils from '../../utils/utils';
import { _subscribeCancel } from '../../components/https/planSubscriptions';
import { errorRequestHandel } from '../../helper';
import { useLocation, useNavigate } from 'react-router-dom';

function SubscribeCancellation() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const plan_id = searchParams.get('plan_id');
  const navigate = useNavigate();
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

  useEffect(() => {
    handleCancel();
  }, []);

  return (
    <Layout>
      <div className={`${styles.subscribe_container} col-md-4 offset-md-4`}>
        <SubscriptionCard
          icon={utils.icons.cancelIcon}
          heading="Payment Failed!"
          description="We couldn’t process your payment. Verify your payment information and try again. For ongoing issues, please reach out to our support team for help."
          buttonTitle="Retry"
          performClick={() => navigate('/update-profile')}
        />
      </div>
    </Layout>
  );
}

export default SubscribeCancellation;
