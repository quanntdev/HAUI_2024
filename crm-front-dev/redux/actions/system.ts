import * as t from "../constants/index";
import { statusCode,REQUEST_METHOD } from "../../constants";
import { baseAxios } from "../../BaseAxios/axiosBase";

export const getSystemInfo = () => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/system`,
      method: REQUEST_METHOD.GET,
    });
    if (
      apiResponse?.data ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.GET_SYSTEM_INFOR,
        payload: apiResponse?.data,
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

export const uploadSystemInfor = (body: any) => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/system`,
      data: body,
      method: REQUEST_METHOD.POST,
      headers: { "Content-Type": "multipart/form-data" }
    });
    if (
      apiResponse ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({ type: t.CREATE_SYSTEM , payload: apiResponse });
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

export const clearData = (key: string) => async (dispatch: any) => {
  dispatch({
    type: t.CLEAR_DATA,
    payload: key,
  });
};
