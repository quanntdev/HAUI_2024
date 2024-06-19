import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataOrderList: null,
  dataCreateOrder: null,
  dataOrderDetail: null,
  dataOrderItemListByOrderId: null,
  dataUpdateOrderStatus: null,
  dataUpdateOrder: null,
  dataOrderListByDealId: null,
  dataCanPaidInvoiceList: null,
  dataDeleteOrder: null,
};

const order = (state = initState, action: any) => {
  switch (action.type) {
    case t.SEARCH_ORDER:
      return {
        ...state,
        dataOrderList: action.payload,
        loading: false,
        error: null,
      };
    case t.CREATE_ORDER:
      return {
        ...state,
        dataCreateOrder: action.payload,
        loading: false,
        error: null,
      };
    case t.DELETE_ORDER:
      return {
        ...state,
        dataDeleteOrder: action.payload,
        loading: false,
        error: null,
      };
    case t.GET_VALID_INVOICE_LIST_BY_ORDER_ID:
      return {
        ...state,
        dataCanPaidInvoiceList: action.payload,
        loading: false,
        error: null,
      };
    case t.DETAIL_ORDER:
      return {
        ...state,
        dataOrderDetail: action.payload,
        loading: false,
        error: null,
      };
    case t.GET_ORDER_LIST_BY_DEAL_ID:
      return {
        ...state,
        dataOrderListByDealId: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_ORDER:
      return {
        ...state,
        dataUpdateOrder: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_ORDER_STATUS:
      return {
        ...state,
        dataUpdateOrderStatus: action.payload,
        loading: false,
        error: null,
      };
    case t.GET_ORDER_ITEM_LIST_BY_ORDER_ID:
      return {
        ...state,
        dataOrderItemListByOrderId: action.payload,
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

export default order;
