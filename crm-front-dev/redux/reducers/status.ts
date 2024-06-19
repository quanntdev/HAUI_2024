import * as t from "../constants/index";

const initState = {
    loading: false,
    error: null,
    dataStatusList: null,
};

const status = (state = initState, action: any) => {
    switch (action.type) {
        case t.GET_STATUS_LIST:
            return {
                ...state,
                dataStatusList: action.payload,
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

export default status;
