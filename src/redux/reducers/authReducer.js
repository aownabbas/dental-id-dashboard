import { ADD_USER_NAME, AUTHENTICAT_USER, SET_AI_RESPONSE } from '../actions/authAction';

const initialState = {
  isLoggin: false,
  aiResponse: {},
  userNameData: {},
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICAT_USER:
      return {
        ...state,
        isLoggin: action.payload,
      };
    case SET_AI_RESPONSE:
      return {
        ...state,
        aiResponse: action.payload,
      };
    case ADD_USER_NAME:
      return {
        ...state,
        userNameData: action.payload,
      };
      break;
    default:
      return state;
  }
}
