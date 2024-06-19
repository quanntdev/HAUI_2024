import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataCategoryList: null
};

const category = (state = initState, action: any) => {
  switch (action.type) {
    case t.GET_CATEGORY_LIST:
      return {
        ...state,
        dataCategoryList: action.payload,
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
        loading: action.payload
      };
    case t.ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return { ...state };
  }
};

export default category;
