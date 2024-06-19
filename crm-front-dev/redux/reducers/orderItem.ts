import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataOrderItemListByOrderId: null,
  dataCreateOrderItem: null,
  dataDeleteOrderItem: null,
  dataOrderItemDetail: null,
  dataUpdateOrderItem: null,
};

const orderItem = (state = initState, action: any) => {
  switch (action.type) {
    case t.CREATE_ORDER_ITEM:
      return {
        ...state,
        dataCreateOrderItem: action.payload,
        loading: false,
        error: null,
      };
    case t.DELETE_ORDER_ITEM:
      return {
        ...state,
        dataDeleteOrderItem: action.payload,
        loading: false,
        error: null,
      };
    case t.DETAIL_ORDER_ITEM:
      return {
        ...state,
        dataOrderItemDetail: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_ORDER_ITEM:
      return {
        ...state,
        dataUpdateOrderItem: action.payload,
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

export default orderItem;
