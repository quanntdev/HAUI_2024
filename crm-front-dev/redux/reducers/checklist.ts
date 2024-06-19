import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataCreateChecklist: null,
  dataDeleteChecklist: null,
};

const checklist = (state = initState, action: any) => {
  switch (action.type) {
    case t.CREATE_CHECKLIST:
      return {
        ...state,
        dataCreateChecklist: action.payload,
        loading: false,
        error: null,
      };
    case t.DELETE_CHECKLIST:
      return {
        ...state,
        dataDeleteChecklist: action.payload,
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

export default checklist;
