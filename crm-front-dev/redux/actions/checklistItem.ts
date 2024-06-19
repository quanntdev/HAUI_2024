import * as t from "../constants/index";
import { statusCode, REQUEST_METHOD } from "../../constants";
import { baseAxios } from "../../BaseAxios/axiosBase";

export const createChecklistItem = (body: any) => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/tasks/checklist/item`,
      data: body,
      method: REQUEST_METHOD.POST,
    });
    if (
      apiResponse ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.CREATE_CHECKLIST_ITEM,
        payload: apiResponse,
      });
    } else if (
      apiResponse?.error ||
      ![statusCode.OK, statusCode.CREATED].includes(
        apiResponse?.response?.status
      )
    ) {
      dispatch({
        type: t.LOADING,
        payload: false,
      });
      dispatch({
        type: t.ERROR,
        payload: apiResponse.response?.data?.properties,
      });
    }
  } catch (error: any) {
    dispatch({
      type: t.LOADING,
      payload: false,
    });
    dispatch({
      type: t.ERROR,
      payload: error,
    });
  }
};

export const deleteChecklistItem = (id: any) => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/tasks/checklist/item/${id}`,
      method: REQUEST_METHOD.DELETE,
      showNotification: true,
    });
    if (
      apiResponse ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.DELETE_CHECKLIST_ITEM,
        payload: apiResponse,
      });
    } else if (
      apiResponse?.error ||
      ![statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.LOADING,
        payload: false,
      });
      dispatch({
        type: t.ERROR,
        payload: apiResponse.message,
      });
    }
  } catch (error: any) {
    dispatch({
      type: t.LOADING,
      payload: false,
    });
    dispatch({
      type: t.ERROR,
      payload: error,
    });
  }
};

export const updateChecklistItem = (id: number, body: any) => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/tasks/checklist/item/${id}`,
      data: body,
      method: REQUEST_METHOD.PATCH,
    });
    if (
      apiResponse || apiResponse.data ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.UPDATE_CHECKLIST_ITEM,
        payload: apiResponse,
      });
    } else if (
      apiResponse?.error ||
      ![statusCode.OK, statusCode.CREATED].includes(apiResponse?.response?.status)
    ) {
      dispatch({
        type: t.LOADING,
        payload: false,
      });
      dispatch({
        type: t.ERROR,
        payload: apiResponse.response?.data?.properties,
      });
    }
  } catch (error: any) {
    dispatch({
      type: t.LOADING,
      payload: false,
    });
    dispatch({
      type: t.ERROR,
      payload: error,
    });
  }
}

export const clearData = (key: string) => async (dispatch: any) => {
  dispatch({
    type: t.CLEAR_DATA,
    payload: key,
  });
};
