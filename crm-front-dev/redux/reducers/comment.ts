import * as t from "../constants/index";

const initState = {
  loading: false,
  error: null,
  dataPostComment: null,
  dataCommentDelete: null,
  dataUploadFile: null,
  dataUpdateComment: null,
  loadingComment: false,
};

const comment = (state = initState, action: any) => {
  switch (action.type) {
    case t.CREATE_COMMENT:
      return {
        ...state,
        dataPostComment: action.payload,
        loading: false,
        loadingComment: false,
        error: null,
      };
    case t.UPDATE_COMMENT:
      return {
        ...state,
        dataUpdateComment: action.payload,
        loading: false,
        loadingComment: false,
        error: null,
      }

    case t.DELETE_COMMENT:
      return {
        ...state,
        dataCommentDelete: action.payload,
        loading: false,
        loadingComment: false,
        error: null,
      };

    case t.UPLOAD_FILE:
      return {
        ...state,
        dataPostComment: action.payload,
        dataUploadFile: action.payload,
        loadingComment: false,
        loading: false,
        error: null,
      };
  
    case t.CLEAR_DATA:
      return {
        ...state,
        [action.payload]: null,
        loading: false,
        loadingComment: false,
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
    case t.LOADING_COMMENT:
      return {
        ...state,
        loadingComment: action.payload,
      };
    default:
      return { ...state };
  }
};

export default comment;
