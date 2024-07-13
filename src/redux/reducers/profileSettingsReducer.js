import { GET_PROFILE_DATA } from '../actions/profileSettingsAction';

const initialState = {
    profileSettings_data: {},
};

export default function profileSettingsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PROFILE_DATA:
      return {
        ...state,
        profileSettings_data: action.payload,
      };
      break;
    default:
      return state;
  }
}
