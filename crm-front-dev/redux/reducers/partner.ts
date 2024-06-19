import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataCreatePartner: null,
  dataListPartner:null,
  dataDeleteParter:null,
  dataDetailPartner:null,
  dataUpdatePartner:null,
  dataPartnerContract: null
};

const partner = (state = initState, action: any) => {
  switch (action.type) {
    case t.CREATE_PARTNER:
      return {
        ...state,
        dataCreatePartner: action.payload,
        loading: false,
        error: null,
      };
    case t.LIST_PARTNER:
      return {
        ...state,
        dataListPartner: action.payload,
        loading: false,
        error: null,
      };
    case t.DELETE_PARTNER:
      return {
        ...state,
        dataDeletePartner: action.payload,
        loading: false,
        error: null,
      };
    case t.DETAIL_PARTNER:
      return {
        ...state,
        dataDetailPartner: action.payload?.data,
        loading: false,
        error: null,
      };
    case t.PARTNER_CONTRACT:
      return {
        ...state,
        dataPartnerContract: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_PARTNER:
      return {
        ...state,
        dataUpdatePartner: action.payload,
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

export default partner;
