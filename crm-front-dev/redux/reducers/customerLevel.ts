import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataCustomerLevel: null,
  dataCreateLevelCustomer: null,
  dataDeleteLevelCustomer: null,
  dataUpdateLevelCustomer: null,
};

const customerLevel = (state = initState, action: any) => {
  switch (action.type) {
    case t.GET_CUSTOMER_LEVEL:
      return {
        ...state,
        dataCustomerLevel: action.payload,
        loading: false,
        error: null,
      };
    case t.CREATE_CUSTOMER_LEVEL:
      return {
        ...state,
        dataCreateLevelCustomer: action.payload,
        loading: false,
        error: null,
      };

    case t.UPDATE_CUSTOMER_LEVEL:
      return {
        ...state,
        dataUpdateLevelCustomer: action.payload,
        loading: false,
        error: null,
      };

    case t.DELETE_CUSTOMER_LEVEL:
      return {
        ...state,
        dataDeleteLevelCustomer: action.payload,
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

export default customerLevel;
