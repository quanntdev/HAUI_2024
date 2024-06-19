import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataListPartnerInvoice:null,
  dataInvoicePartnerByOrder: null,
  dataDetailPartnerInvoice: null,
  dataUpdateInvoicePartnerCode: null,
  dataUpdateInvoicePartner: null,
};

const partnerInvoice = (state = initState, action: any) => {
  switch (action.type) {
    case t.LIST_PARTNER_INVOICE:
      return {
        ...state,
        dataListPartnerInvoice: action.payload,
        loading: false,
        error: null,
      };
    case t.GET_INVOICE_PARTNER_BY_ORDER:
      return {
        ...state,
        dataInvoicePartnerByOrder: action.payload,
        loading: false,
        error: null,
      };
    case t.DETAIL_PARTNER_INVOICE:
      return {
        ...state,
        dataDetailPartnerInvoice: action.payload,
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
    case t.UPDATE_INVOICE_PARTNER_CODE:
      return {
        ...state,
        dataUpdateInvoicePartnerCode: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_DETAIL_INVOICE_PARTNER:
      return {
        ...state,
        dataUpdateInvoicePartner: action.payload,
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

export default partnerInvoice;
