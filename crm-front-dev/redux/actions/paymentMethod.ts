import { baseAxios } from "../../BaseAxios/axiosBase";
import { REQUEST_METHOD, statusCode } from "../../constants";
import * as t from "../constants/index";

export const getPaymentMethods = () => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
    });

    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/payment-methods`,
      method: REQUEST_METHOD.GET,
    });

    if (
      apiResponse?.data || [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.GET_PAYMENT_METHODS,
        payload: apiResponse?.data,
      })
    } else if (apiResponse?.error || ![statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)) {
      dispatch({
        type: t.LOADING,
        payload: false,
      });
      dispatch({
        type: t.ERROR,
        payload: apiResponse?.message,
      });
    }
  } catch (error: any) {
    dispatch({
      type: t.LOADING,
      payload: false,
    });
    dispatch({
      type: t.ERROR,
      payload: error
    });
  }
}

export const clearData = (key: string) => async (dispatch: any) => {
  dispatch({
    type: t.CLEAR_DATA,
    payload: key,
  });
};
