import * as t from "../constants/index";
import { statusCode, REQUEST_METHOD } from "../../constants";
import { baseAxios } from "../../BaseAxios/axiosBase";

export const listPartnerInvoice = (querySearch: any = "") => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/partner-invoices?${querySearch}`,
      data: { querySearch },
      method: REQUEST_METHOD.GET,
    });
    if (
      apiResponse ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.LIST_PARTNER_INVOICE,
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

export const getInvoicePartnerByOrderId =
  (orderId: number, keyId: number) => async (dispatch: any) => {
    try {
      dispatch({
        type: t.LOADING,
        payload: true,
      });

      const apiResponse: any = await baseAxios.publicRequest({
        url:
        process.env.NEXT_PUBLIC_API_ADDRESS +
        "/partner-invoices/invoice-partner-order/" + orderId +
        (keyId ? "?keyId=" + keyId : ""),
        data: { orderId },
        method: REQUEST_METHOD.GET,
      });

      if (
        apiResponse?.data ||
        [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
      ) {
        dispatch({
          type: t.GET_INVOICE_PARTNER_BY_ORDER,
          payload: apiResponse,
        });
      } else if (
        apiResponse?.data ||
        ![statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
      ) {
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
        payload: error,
      });
    }
  };

  export const updateInvoicePartner = (body: any, id: any) => async (dispatch: any) => {
    try {
      dispatch({
        type: t.LOADING,
        payload: true,
      });
      const apiResponse: any = await baseAxios.publicRequest({
        url: process.env.NEXT_PUBLIC_API_ADDRESS + `/partner-invoices/${id}`,
        data: body,
        method: REQUEST_METHOD.PATCH,
      });
      if (
        apiResponse ||
        apiResponse.data ||
        [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
      ) {
        dispatch({
          type: t.UPDATE_DETAIL_INVOICE_PARTNER,
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

  export const getDetailPartnerInvoice = (id: number, querySearch: any = "") => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/partner-invoices/${id}?${querySearch}`,
      method: REQUEST_METHOD.GET,
    });

    if (
      apiResponse ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.DETAIL_PARTNER_INVOICE,
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

export const updateInvoicePartnerCode =
  (body: any, id: any) => async (dispatch: any) => {
    try {
      dispatch({
        type: t.LOADING,
        payload: true,
      });
      const apiResponse: any = await baseAxios.publicRequest({
        url:
          process.env.NEXT_PUBLIC_API_ADDRESS + `/partner-invoices/update-code/${id}`,
        data: body,
        method: REQUEST_METHOD.PATCH,
      });
      if (
        apiResponse ||
        apiResponse.data ||
        [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
      ) {
        dispatch({
          type: t.UPDATE_INVOICE_PARTNER_CODE,
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
