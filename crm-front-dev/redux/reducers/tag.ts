import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataTagList: null,
  dataCreateTag: null,
};

const tag = (state = initState, action: any) => {
  switch (action.type) {
    case t.SEARCH_TAG:
      return {
        ...state,
        dataTagList: action.payload,
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
    case t.CREATE_TAG:
      return {
        ...state,
        dataCreateTag: action.payload,
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

export default tag;
