import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataListPartnerPayment: null,
  dataListOrderByPartner: null,
  dataCreatePaymentPartner: null,
  dataDetailPaymentPartner: null,
  dataUpdatePaymentPartner: null,
  dataDeletePartnerPayment: null,
  dataManyPartnerInvoice: null,
};

const partnerPayment = (state = initState, action: any) => {
  switch (action.type) {
    case t.LIST_PAYMENT_PARTNER:
      return {
        ...state,
        dataListPartnerPayment: action.payload?.data,
        loading: false,
        error: null,
      };
    case t.GET_ORDER_BY_PARTNER:
      return {
        ...state,
        dataListOrderByPartner: action.payload,
        loading: false,
        error: null,
      };
    case t.CREATE_PARTNER_PAYMENT:
      return {
        ...state,
        dataCreatePaymentPartner: action.payload,
        loading: false,
        error: null,
      };
    case t.DETAIL_PAYMENT_PARTNER:
      return {
        ...state,
        dataDetailPaymentPartner: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_PARTNER_PAYMENT:
      return {
        ...state,
        dataUpdatePaymentPartner: action.payload,
        loading: false,
        error: null,
      };
    case t.CREATE_PAYMENT_MANY_INVOICE:
      return {
        ...state,
        dataManyPartnerInvoice: action.payload?.data,
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
    case t.DELETE_PARTNER_PAYMENT:
      return {
        ...state,
        dataDeletePartnerPayment: action.payload,
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

export default partnerPayment;
