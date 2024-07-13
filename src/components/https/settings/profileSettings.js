import client from '../client';
import endPoints from '../endPoints';

export const updatePassword = async (payload) => {
  return await client.put(`${endPoints.UPDATE_PASSWORD}`, payload);
};

export const updateProfile = async (payload) => {
  return await client.put(`${endPoints.UPDATE_PROFILE}`, payload);
};

export const _userProfileData = async (payload) => {
  return await client.get(`${endPoints.GET_PROFILE}`, payload);
};

export const _getCoutriesList = async () => {
  return await client.get(`${endPoints.COUNTRIES_LIST}`);
};
