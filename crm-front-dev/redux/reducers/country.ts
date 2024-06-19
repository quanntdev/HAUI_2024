import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataCountryList: null,
  dataCreateCountry: null,
  dataDeleteCountry: null,
};

const country = (state = initState, action: any) => {
  switch (action.type) {
    case t.GET_COUNTRIES:
      return {
        ...state,
        dataCountryList: action.payload,
        loading: false,
        error: null,
      };
    case t.CREATE_COUNTRIES:
      return {
        ...state,
        dataCreateCountry: action.payload,
        loading: false,
        error: null,
      };
    case t.DELETE_COUNTRIES:
      return {
        ...state,
        dataDeleteCountry: action.payload,
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
    default:
      return { ...state };
  }
};

export default country;
