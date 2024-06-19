import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataDetailProfile: null,
  dataUpdateProfile: null,
  dataUpdateUserLanguages: null,
};

const profile = (state = initState, action: any) => {
  switch (action.type) {
    case t.GET_DETAIL_PROFILE:
      return {
        ...state,
        dataDetailProfile: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_PROFILE:
      return {
        ...state,
        dataUpdateProfile: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_USER_LANGUAGES:
      return {
        ...state,
        dataUpdateUserLanguages: action.payload,
        loading: false,
        error: null,
      }
    case t.LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case t.ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case t.CLEAR_DATA:
      return {
        ...state,
        [action.payload]: null,
        loading: false,
        error: null,
      };
    default:
      return { ...state };
  }
};

export default profile;
