import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataSignUp: null,
  loadingSignUp: false,
  dataForgotPassword: null,
  loadingEmail: false,
  dataCheckResetToken: false,
  dataChangePassword: false
};

const auth = (state = initState, action: any) => {
  switch (action.type) {
    case t.REGISTER:
      return {
        ...state,
        dataSignUp: action.payload,
        loadingSignUp: false,
        loading: false,
        loadingEmail: false,
        error: null,
      };
    case t.CLEAR_DATA:
      return {
        ...state,
        [action.payload]: null,
        loading: false,
        error: null,
        loadingEmail: false,
      };
    case t.LOADING:
      return {
        ...state,
        loading: action.payload,
        loadingSignUp: action?.loadingSignUp
      };
    case t.ERROR:
      return {
        ...state,
        error: action.payload,
        loadingSignUp: false,
        loading: false
      };
    case t.FORGOT_PASSWOPD: {
      return {
        ...state,
        dataForgotPassword: action.payload,
        loading: false,
        error: null,
        loadingEmail: false,
      }
    }

    case t.CHECK_RESET_TOKEN: {
      return {
        ...state,
        dataCheckResetToken: action.payload,
        loading: false,
        error: null,
        loadingEmail: false,
      }
    }
    case t.CHANGE_PASSWORD_TOKEN: {
      return {
        ...state,
        dataChangePassword: action.payload,
        loading: false,
        error: null,
        loadingEmail: false,
      }
    }
    case t.LOADING_SEND_MAIL: {
      return {
        ...state,
        loadingEmail: action.payload,
      };
    }
    case t.LOGIN:
      return {
        ...state,
        dataLogin: action?.payload,
        logout: action?.logout,
        loading: false,
        loadingLogin: false,
        error: null,
        loadingEmail: false,
      }
    default:
      return { ...state };
  }
};

export default auth;
