export const GET_PROFILE_DATA = 'GET_PROFILE_DATA';

export const _addUserProfileData = (data) => {
  return (dispatch) => {
    dispatch({
      type: GET_PROFILE_DATA,
      payload: data,
    });
  };
};
