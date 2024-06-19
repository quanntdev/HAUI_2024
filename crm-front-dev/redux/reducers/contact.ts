import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataContactList: null,
  dataDeleteContact: null,
  dataContactDetail: null,
  dataUpdateContact: null,
  dataCreateContact: null,
  dataContactListByCustomerId:null,
  dataUpdateCard: null,
  dataUpdateContactAvatart: null,
};

const contact = (state = initState, action: any) => {
  switch (action.type) {
    case t.SEARCH_CONTACT:
      return {
        ...state,
        dataContactList: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_CONTACT:
      return {
        ...state,
        dataUpdateContact: action.payload,
        loading: false,
        error: null,
      };
    case t.DETAIL_CONTACT:
      return {
        ...state,
        dataContactDetail: action.payload?.data,
        dataLogNote: action.payload.logNote,
        loading: false,
        error: null,
      };
    case t.GET_CARD_IMAGE:
      return {
        ...state,
        dataUpdateCard: action.payload,
        loading: false,
        error: null,
      };
    case t.GET_AVATAR_CONTACT:
      return {
        ...state,
        dataUpdateContactAvatart: action.payload,
        loading: false,
        error: null,
      };
    case t.GET_CONTACT_LIST_BY_CUSTOMER_ID:
      return {
        ...state,
        dataContactListByCustomerId: action.payload,
        loading: false,
        error: null,
      };
    case t.CREATE_CONTACT:
      return {
        ...state,
        dataCreateContact: action.payload,
        loading: false,
        error: null,
      };
    case t.DELETE_CONTACT:
      return {
        ...state,
        dataDeleteContact: action.payload,
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
        loading: action.payload
      };
    case t.ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return { ...state };
  }
};

export default contact;
