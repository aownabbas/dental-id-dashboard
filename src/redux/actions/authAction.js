export const AUTHENTICAT_USER = "AUTHENTICAT_USER";
export const SET_AI_RESPONSE = "SET_AI_RESPONSE";
export const ADD_USER_NAME = "ADD_USER_NAME";

const authenticateUser = (isLoggin) => {
  return {
    type: AUTHENTICAT_USER,
    payload: isLoggin,
  };
};

export const _authenticateUser = (isLoggin) => {
  return (dispatch) => dispatch(authenticateUser(isLoggin));
};

const setAiResponse = (data) => {
  return {
    type: SET_AI_RESPONSE,
    payload: data,
  };
};

export const _setAiResponse = (data) => {
  return (dispatch) => {
    dispatch(setAiResponse(data));
  };
};

export const _addUserName = (data) => {
  return (dispatch) => {
    dispatch({
      type: ADD_USER_NAME,
      payload: data,
    });
  };
};
