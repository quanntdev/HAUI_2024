import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataCustomerList: null,
  dataDeleteCustomer: null,
  dataCreateCustomer: null,
  dataDetailCustomer: null,
  dataUpdateCustomer: null,
  dataCid: null,
  dataListContacts: null,
  dataListDeals: null,
  dataListOrders: null,
  dataListPayment: null,
  dataListOrderHasInvoice: null,
  logNoteCustomer: null,
  dataListInvoiceByCustomerId: null,
  dataListNameAndIDByCustomer: null,
  dataMergeCustomer: null,
};

const customer = (state = initState, action: any) => {
  switch (action.type) {
    case t.SEARCH_CUSTOMER:
      return {
        ...state,
        dataCustomerList: action.payload,
        loading: false,
        error: null,
      };
    case t.SEARCH_NAME_ID_CUSTOMER:
      return {
        ...state,
        dataListNameAndIDByCustomer: action.payload,
        loading: false,
        error: null,
      };
    case t.LIST_CONTACT:
      return {
        ...state,
        dataListContacts: action.payload,
        loading: false,
        error: null,
      };
    case t.LIST_DEAL:
      return {
        ...state,
        dataListDeals: action.payload,
        loading: false,
        error: null,
      };
    case t.LIST_ORDER:
      return {
        ...state,
        dataListOrders: action.payload,
        loading: false,
        error: null,
      };
    case t.LIST_ORDER_HAS_INVOICE:
      return {
        ...state,
        dataListOrderHasInvoice: action.payload,
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
    case t.CREATE_CUSTOMER:
      return {
        ...state,
        dataCreateCustomer: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_CUSTOMER:
      return {
        ...state,
        dataUpdateCustomer: action.payload,
        loading: false,
        error: null,
      };

    case t.MERGE_CUSTOMER:
      return {
        ...state,
        dataMergeCustomer: action.payload,
        loading: false,
        error: null,
      };

    case t.DETAIL_CID:
      return {
        ...state,
        dataCid: action.payload,
        loading: false,
        error: null,
      };
    case t.LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case t.DETAIL_CUSTOMER:
      return {
        ...state,
        dataDetailCustomer: action.payload?.data,
        logNoteCustomer: action.payload?.logNote,
        loading: false,
        error: null,
      };
    case t.DELETE_CUSTOMER:
      return {
        ...state,
        dataDeleteCustomer: action.payload,
        loading: false,
        error: null,
      };
    case t.GET_PAYMENTS_LIST_BY_CUSTOMER_ID:
      return {
        ...state,
        dataListPayment: action.payload,
        loading: false,
        error: null,
      };
    case t.LIST_INVOICE_BY_CUSTOMER_ID:
      return {
        ...state,
        dataListInvoiceByCustomerId: action.payload,
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

export default customer;
