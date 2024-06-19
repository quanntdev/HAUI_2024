import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataCreatePayment: null,
  dataUpdatePayment: null,
  dataPaymentList: null,
  dataPaymentByOrderId: null,
  dataPayment: null,
  dataDeletePayment: null,
};

const payment = (state = initState, action: any) => {
  switch (action.type) {
    case t.SEARCH_PAYMENT:
      return {
        ...state,
        dataPaymentList: action.payload,
        loading: false,
        error: null,
      };

    case t.CREATE_PAYMENT:
      return {
        ...state,
        dataCreatePayment: action.payload,
        loading: false,
        error: null,
      };

    case t.GET_PAYMENT:
      return {
        ...state,
        dataPayment: action.payload,
        loading: false,
        error: null,
      };
    case t.GET_PAYMENT_BY_ORDER_ID:
      return {
        ...state,
        dataPaymentByOrderId: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_PAYMENT:
      return {
        ...state,
        dataUpdatePayment: action.payload,
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
    case t.DELETE_PAYMENT:
      return {
        ...state,
        dataDeletePayment: action.payload,
        loading: false,
        error: null,
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

export default payment;
