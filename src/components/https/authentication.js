import client from './client';
import endPoints from './endPoints';

export const userLogin = async (payload) => {
  return await client.post(`${endPoints.USER_LOGIN}`, payload);
};

export const userRegister = async (payload) => {
  return await client.post(`${endPoints.USER_REGISTER}`, payload);
};

export const userForgetPassword = async (payload) => {
  return await client.post(`${endPoints.FORGET_PASSWORD}`, payload);
};

export const verifyUserOtp = async (payload) => {
  return await client.post(`${endPoints.USER_OTP}`, payload);
};

export const userResetPassword = async (payload) => {
  return await client.put(`${endPoints.RESET_PASSWORD}`, payload);
};
