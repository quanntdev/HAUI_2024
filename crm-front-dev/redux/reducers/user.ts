import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataUserList: null,
  dataCreateUser: null,
  dataUpdateUser: null,
  dataDeleteUser: null,
  dataUpdateUserProfile: null,
  dataUpdatePasswordProfile: null,
};

const user = (state = initState, action: any) => {
  switch (action.type) {
    case t.SEARCH_USER:
      return {
        ...state,
        dataUserList: action.payload,
        loading: false,
        error: null,
      };
    case t.CREATE_USER:
      return {
        ...state,
        dataCreateUser: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_USER:
      return {
        ...state,
        dataUpdateUser: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_PROFILE:
      return {
        ...state,
        dataUpdateUserProfile: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_PASSWORD_PROFILE:
      return {
        ...state,
        dataUpdatePasswordProfile: action.payload,
        loading: false,
        error: null,
      };
    case t.CLEAR_DATA:
      return {
        ...state,
        [action.payload]: null,
        loading: false,
        error: null,
      };
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
    case t.DELETE_USER:
      return {
        ...state,
        dataDeleteUser: action.payload,
        loading: false,
        error: null,
      };
    default:
      return { ...state };
  }
};

export default user;
