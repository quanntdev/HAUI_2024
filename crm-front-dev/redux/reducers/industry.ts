import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataIndustryList: null,
  dataCreateIndustry: null,
  dataDeleteIndustry: null,
  dataUpdateIndustry: null,
};

const industry = (state = initState, action: any) => {
  switch (action.type) {
    case t.GET_INDUSTRY:
      return {
        ...state,
        dataIndustryList: action.payload,
        loading: false,
        error: null,
      };
    case t.CREATE_INDUSTRY:
      return {
        ...state,
        dataCreateIndustry: action.payload,
        loading: false,
        error: null,
      };
      case t.UPDATE_INDUSTRY:
        return {
          ...state,
          dataUpdateIndustry: action.payload,
          loading: false,
          error: null,
        };
    case t.DELETE_INDUSTRY:
      return {
        ...state,
        dataDeleteIndustry: action.payload,
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

export default industry;
