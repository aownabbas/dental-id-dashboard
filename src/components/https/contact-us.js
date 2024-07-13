import client from './client';
import endPoints from './endPoints';

export const _contactUs = async (payload) => {
  return await client.post(`${endPoints.CONTACT_US}`, payload);
};
