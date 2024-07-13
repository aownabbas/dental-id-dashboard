import './App.css';
import { useEffect, useState } from 'react';
import Splash from './components/splash/Splash';
import { Routes, Route } from 'react-router-dom';
import Selection from './screens/selections/Selection';
import UploadImage from './screens/upload-image/UploadImage';
import Dashboard from './screens/dashboard/Dashboard';
import AreamMeasurement from './screens/area/AreamMeasurement';
import Login from './screens/auth/login/Login';
import Protected from './components/protected/Protected';
import { useDispatch, useSelector } from 'react-redux';
import { _authenticateUser } from './redux/actions/authAction';
import NotFound from './components/notFound/NotFound';
import AiScreen from './screens/ai/AiScreen';
import AiResponseScreen from './screens/ai-response-screen/AiResponseScreen';
import Test from './screens/area/Test';

import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './components/resusable/layout/layout';
import Signup from './screens/auth/signup/signup';
import ForgetPassword from './screens/auth/forgetPassword/forgetPassword';
import ResetPassword from './screens/auth/resetPassword/resetPassword';
import OtpScreen from './screens/auth/otp/otpScreen';
import UpdatePassword from './screens/settings/update-password/updatePassword';
import UpdateProfile from './screens/settings/update-profile/updateProfile';
import SubscriptionsPlan from './screens/subscriptions/subscriptions-plan';
import SubscribeConfirmation from './screens/subscriptions/subscribe-confirmation';
import SubscribeCancellation from './screens/subscriptions/subscribe-cancellation';
import ContactUs from './screens/contact-us/contact-us';

function App() {
  const [loading, setLoading] = useState(true);

  const isLoggin = useSelector((state) => state.auth.isLoggin);
  const dispatch = useDispatch();

  useEffect(() => {
    checkIfUserIsAthinticate();
  }, []);

  const checkIfUserIsAthinticate = () => {
    const userdata = JSON.parse(localStorage.getItem('user'));
    if (userdata !== null) {
      dispatch(_authenticateUser(true));
    } else {
      dispatch(_authenticateUser(false));
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return <Splash />;
  }
  return (
    <Routes>
      <>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/add-otp" element={<OtpScreen />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </>

      <>
        <Route
          path="/"
          element={
            <Protected isLoggedIn={isLoggin}>
              <Selection />
              {/* <Layout/> */}
            </Protected>
          }
        />
        <Route
          path="/uploadImage"
          element={
            <Protected isLoggedIn={isLoggin}>
              <UploadImage />
            </Protected>
          }
        />
        <Route
          path="/contact-us"
          element={
            <Protected isLoggedIn={isLoggin}>
              <ContactUs/>
            </Protected>
          }
        />
        <Route
          path="/length-measurement"
          element={
            <Protected isLoggedIn={isLoggin}>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/area-measurement"
          element={
            <Protected isLoggedIn={isLoggin}>
              <AreamMeasurement />
            </Protected>
          }
        />
        <Route
          path="/ai-measurement"
          element={
            <Protected isLoggedIn={isLoggin}>
              <AiScreen />
            </Protected>
          }
        />
        <Route
          path="/ai-measurement/result"
          element={
            <Protected isLoggedIn={isLoggin}>
              <AiResponseScreen />
            </Protected>
          }
        />

        <Route
          path="/update-password"
          element={
            <Protected isLoggedIn={isLoggin}>
              <UpdatePassword />
            </Protected>
          }
        />

        <Route
          path="/update-profile"
          element={
            <Protected isLoggedIn={isLoggin}>
              <UpdateProfile />
            </Protected>
          }
        />

        <Route
          path="/subscriptions-plan"
          element={
            <Protected isLoggedIn={isLoggin}>
              <SubscriptionsPlan />
            </Protected>
          }
        />

        <Route
          path="/subscribe/confirmation"
          element={
            <Protected isLoggedIn={isLoggin}>
              <SubscribeConfirmation />
            </Protected>
          }
        />

        <Route
          path="/subscribe/cancellation"
          element={
            <Protected isLoggedIn={isLoggin}>
              <SubscribeCancellation />
            </Protected>
          }
        />

        {/* <Route
          path="/test"
          element={
            <Protected isLoggedIn={isLoggin}>
              <Test />
            </Protected>
          }
        /> */}

        <Route path="*" element={<NotFound />} />
      </>
    </Routes>
  );
}

export default App;
