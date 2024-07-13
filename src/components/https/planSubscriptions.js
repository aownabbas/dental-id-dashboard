import client from './client';
import endPoints from './endPoints';

export const _plansListing = async (payload) => {
  return await client.get(`${endPoints.PLAN_LISTING}`, payload);
};

export const _subscribePlan = async (id) => {
    return await client.get(`${endPoints.SUBSCRIBE_PLAN}?plan_id=${id}`);
  };

  export const _subscribeFreePlan = async () => {
    return await client.get(`${endPoints.SUBSCRIBE_FREE_PLAN}`);
  };

  export const _subscribeSuccess = async (id) => {
    return await client.get(`${endPoints.SUBSCRIBE_SUCCESS}?plan_id=${id}`);
  };

  export const _subscribeCancel = async (id) => {
    return await client.get(`${endPoints.SUBSCRIBE_CANCEL}?plan_id=${id}`);
  };