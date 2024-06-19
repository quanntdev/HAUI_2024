import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataCreateChecklistItem: null,
  dataDeleteChecklistItem: null,
  dataUpdateChecklistItem: null,
};

const checklistItem = (state = initState, action: any) => {
  switch (action.type) {
    case t.CREATE_CHECKLIST_ITEM:
      return {
        ...state,
        dataCreateChecklistItem: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_CHECKLIST_ITEM:
      return {
        ...state,
        dataUpdateChecklistItem: action.payload,
        loading: false,
        error: null,
      };
    case t.DELETE_CHECKLIST_ITEM:
      return {
        ...state,
        dataDeleteChecklistItem: action.payload,
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

export default checklistItem;
