import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataInvoiceCategoryList: null,
};

const invoiceCategory = (state = initState, action: any) => {
  switch (action.type) {
    case t.GET_INVOICE_CATEGORY_LIST:
      return {
        ...state,
        dataInvoiceCategoryList: action.payload,
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

export default invoiceCategory;
