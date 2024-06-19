import * as t from "../constants/index";
import { statusCode, REQUEST_METHOD } from "../../constants";
import { baseAxios } from "../../BaseAxios/axiosBase";

export const createOrderItem = (body: any) => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/order-items`,
      data: body,
      method: REQUEST_METHOD.POST,
    });
    if (
      apiResponse ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.CREATE_ORDER_ITEM,
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

export const deleteOrderItem = (id: any) => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/order-items/${id}`,
      method: REQUEST_METHOD.DELETE,
    });
    if (
      apiResponse ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.DELETE_ORDER_ITEM,
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

export const getDetailOrderItem = (id: number) => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/order-items/${id}`,
      method: REQUEST_METHOD.GET,
    });
    if (
      apiResponse ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.DETAIL_ORDER_ITEM,
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

export const updateOrderItem =
  (body: any, id: any) => async (dispatch: any) => {
    try {
      dispatch({
        type: t.LOADING,
        payload: true,
      });
      const apiResponse: any = await baseAxios.publicRequest({
        url: process.env.NEXT_PUBLIC_API_ADDRESS + `/order-items/${id}`,
        data: body,
        method: REQUEST_METHOD.PATCH,
      });
      if (
        apiResponse ||
        apiResponse.data ||
        [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
      ) {
        dispatch({
          type: t.UPDATE_ORDER_ITEM,
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

export const clearData = (key: string) => async (dispatch: any) => {
  dispatch({
    type: t.CLEAR_DATA,
    payload: key,
  });
};
