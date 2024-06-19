import * as t from "../constants/index";
import { statusCode,REQUEST_METHOD } from "../../constants";
import { baseAxios } from "../../BaseAxios/axiosBase";

export const getTags =
  (querySearch: any = "") =>
  async (dispatch: any) => {
    try {
      dispatch({
        type: t.LOADING,
        payload: true,
      });
      const apiResponse: any = await baseAxios.publicRequest({
        url: process.env.NEXT_PUBLIC_API_ADDRESS + `/tags`,
        data: { querySearch },
        method: REQUEST_METHOD.GET,
      });
      if (
        apiResponse?.data ||
        [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
      ) {
        dispatch({
          type: t.SEARCH_TAG,
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

export const createTag = (body: any) => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/tags`,
      data: body,
      method: REQUEST_METHOD.POST,
    });
    if (
      apiResponse ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.CREATE_TAG,
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
