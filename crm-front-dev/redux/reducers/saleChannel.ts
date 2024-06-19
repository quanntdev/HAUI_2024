import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataSaleChannelList: null,
  dataCreateSaleChannel: null,
  dataDeleteSaleChannel: null,
};

const saleChannel = (state = initState, action: any) => {
  switch (action.type) {
    case t.GET_SALE_CHANNEL:
      return {
        ...state,
        dataSaleChannelList: action.payload,
        loading: false,
        error: null,
      };
    case t.CREATE_SALE_CHANNEL:
      return {
        ...state,
        dataCreateSaleChannel: action.payload,
        loading: false,
        error: null,
      };
    case t.DELETE_SALE_CHANNEL:
      return {
        ...state,
        dataDeleteSaleChannel: action.payload,
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

export default saleChannel;
