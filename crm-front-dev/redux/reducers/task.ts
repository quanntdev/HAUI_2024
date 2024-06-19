import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataCreateTask: null,
  dataListTask: null,
  dataTaskDetail: null,
  dataTaskObject: null,
  dataTaskArchive: null,
  dataTaskDelete: null,
  dataUpdateTask: null,
  dataUpdateTaskStatus: null,
  total: null,
};

const task = (state = initState, action: any) => {
  switch (action.type) {
    case t.GET_LIST_TASK:
      return {
        ...state,
        dataListTask: action.payload,
        loading: false,
        error: null,
      };
    case t.GET_TOTAL_LIST_TASK:
      return {
        ...state,
        total: action.payload,
        loading: false,
        error: null,
      };
    case t.GET_TASK_OBJECT:
      return {
        ...state,
        dataTaskObject: action.payload,
        loading: false,
        error: null,
      };
    case t.CREATE_TASK:
      return {
        ...state,
        dataCreateTask: action.payload,
        loading: false,
        error: null,
      };
    case t.GET_TASK:
      return {
        ...state,
        dataTaskDetail: action.payload,
        loading: false,
        error: null,
      };
    case t.ARCHIVE_TASK:
      return {
        ...state,
        dataTaskArchive: action.payload,
        loading: false,
        error: null,
      };
    case t.DELETE_TASK:
      return {
        ...state,
        dataTaskDelete: action.payload,
        loading: false,
        error: null,
      };
    case t.UPDATE_TASK:
      return {
        ...state,
        dataUpdateTask: action.payload,
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
    case t.UPDATE_TASK_STATUS:
      return {
        ...state,
        dataUpdateTaskStatus: action.payload,
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

export default task;
