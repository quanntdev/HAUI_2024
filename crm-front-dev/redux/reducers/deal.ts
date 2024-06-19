import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataDealList: null,
  dataDeleteDeal: null,
  dataDealDetail: null,
  dataUpdateDeal: null,
  dataCreateDeal: null,
  dataUpdateDealStatus:null,
  dataLogNote: null,
};

const deal = (state = initState, action: any) => {
  switch (action.type) {
    case t.SEARCH_DEAL:
      return {
        ...state,
        dataDealList: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_DEAL:
      return {
        ...state,
        dataUpdateDeal: action.payload,
        loading: false,
        error: null,
      };
    case t.DETAIL_DEAL:
      return {
        ...state,
        dataDealDetail: action.payload?.data,
        dataLogNote: action.payload.logNote,
        loading: false,
        error: null,
      };
    case t.UPDATE_STATUS_DEAL:
      return {
        ...state,
        dataUpdateDealStatus: action.payload,
        loading: false,
        error: null,
      };
    case t.CREATE_DEAL:
      return {
        ...state,
        dataCreateDeal: action.payload,
        loading: false,
        error: null,
      };
    case t.DELETE_DEAL:
      return {
        ...state,
        dataDeleteDeal: action.payload,
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

export default deal;
