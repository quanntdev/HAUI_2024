import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataInvoiceStatusList: null,
  dataCreateInvoice: null,
  dataInvoiceList: null,
  dataDetailInvoice: null,
  dataInvoicesByOrderId: null,
  dataInvoicesByCustomerId: null,
  dataUpdateStatusInvoice: null,
  dataUpdateInvoice: null,
  dataInvoiceByCode: null,
  dataRefreshStatusInvoice: null,
  dataUpdateInvoiceCode: null,
  dataDeleteInvoice: null,
};

const invoice = (state = initState, action: any) => {
  switch (action.type) {
    case t.SEARCH_INVOICE:
      return {
        ...state,
        dataInvoiceList: action.payload,
        loading: false,
        error: null,
      };
    case t.GET_INVOICE_BY_ORDER_ID:
      return {
        ...state,
        dataInvoicesByOrderId: action.payload,
        loading: false,
        error: null,
      };
    case t.GET_INVOICE_BY_CUSTOMER_ID:
      return {
        ...state,
        dataInvoicesByCustomerId: action.payload,
        loading: false,
        error: null,
      };
    case t.GET_INVOICE_BY_CODE:
      return {
        ...state,
        dataInvoiceByCode: action.payload,
        loading: false,
        error: null,
      };
    case t.CREATE_INVOICE:
      return {
        ...state,
        dataCreateInvoice: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_DETAIL_INVOICE:
      return {
        ...state,
        dataUpdateInvoice: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_STATUS_INVOICE:
      return {
        ...state,
        dataUpdateStatusInvoice: action.payload,
        loading: false,
        error: null,
      };
    case t.GET_INVOICE_STATUS:
      return {
        ...state,
        dataInvoiceStatusList: action.payload,
        loading: false,
        error: null,
      };
    case t.REFRESH_INVOICE_STATUS:
      return {
        ...state,
        dataRefreshStatusInvoice: action.payload,
        loading: false,
        error: null,
      };
    case t.DETAIL_INVOICE:
      return {
        ...state,
        dataDetailInvoice: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_INVOICE_CODE:
      return {
        ...state,
        dataUpdateInvoiceCode: action.payload,
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
    case t.DELETE_INVOICE:
      return {
        ...state,
        dataDeleteInvoice: action.payload,
        loading: false,
        error: null,
      };
    case t.ERROR:
      return {
        ...state,
        error: action.payload,
        loadding: false,
      };
    default:
      return { ...state };
  }
};

export default invoice;
