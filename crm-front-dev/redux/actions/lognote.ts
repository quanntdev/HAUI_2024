import * as t from "../constants/index";
import { statusCode, REQUEST_METHOD } from "../../constants";
import { baseAxios } from "../../BaseAxios/axiosBase";

export const getLogNote =
  (querySearch: any = "") =>
  async (dispatch: any) => {
    try {
      dispatch({
        type: t.LOADING,
        payload: true,
      });
      const apiResponse: any = await baseAxios.publicRequest({
        url: process.env.NEXT_PUBLIC_API_ADDRESS + `/lognote?${querySearch}`,
        data: { querySearch },
        method: REQUEST_METHOD.GET,
      });
      if (
        apiResponse?.data ||
        [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
      ) {
        dispatch({
          type: t.GET_LIST_LOGNOTE,
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
