import * as t from "../constants/index";
import { statusCode, REQUEST_METHOD } from "../../constants";
import { baseAxios } from "../../BaseAxios/axiosBase";

export const listPaymentPartner = (querySearch: any = "") => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/payment-partner?${querySearch}`,
      data: { querySearch },
      method: REQUEST_METHOD.GET,
    });
    if (
      apiResponse ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.LIST_PAYMENT_PARTNER,
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

export const getDetailPaymentPartner = (id: number, querySearch: any = "") => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/payment-partner/${id}?${querySearch}`,
      method: REQUEST_METHOD.GET,
    });

    if (
      apiResponse ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.DETAIL_PAYMENT_PARTNER,
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

export const createPartnerPayment = (body: any) => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/payment-partner`,
      data: body,
      method: REQUEST_METHOD.POST,
      headers: { "Content-Type": "multipart/form-data" }
    });
    if (
      apiResponse ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.CREATE_PARTNER_PAYMENT,
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


export const getOrderByPartnerId =
  (partnerId: number) => async (dispatch: any) => {
    try {
      dispatch({
        type: t.LOADING,
        payload: true,
      });

      const apiResponse: any = await baseAxios.publicRequest({
        url:
          process.env.NEXT_PUBLIC_API_ADDRESS +
          `/orders/partner-order-invoice/${partnerId}`,
        data: { partnerId },
        method: REQUEST_METHOD.GET,
      });

      if (
        apiResponse?.data ||
        [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
      ) {
        dispatch({
          type: t.GET_ORDER_BY_PARTNER,
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

export const updatePartnerPayment = (body: any, id: any) => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/payment-partner/${id}`,
      data: body,
      method: REQUEST_METHOD.PUT,
    });
    if (
      apiResponse ||
      apiResponse.data ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.UPDATE_PARTNER_PAYMENT,
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

export const deletePartnerPayment = (id: any) => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/payment-partner/${id}`,
      method: REQUEST_METHOD.DELETE,
      showNotification: true
    });
    if (
      apiResponse ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.DELETE_PARTNER_PAYMENT,
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

export const createPaymentWithManyInvoice = (body: any) => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/payment-partner/many-invoice`,
      data:body,
      method: REQUEST_METHOD.POST,
      headers: { "Content-Type": "multipart/form-data" }
    });
    if (
      apiResponse ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.CREATE_PAYMENT_MANY_INVOICE,
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


export const clearData = (key: string) => async (dispatch: any) => {
  dispatch({
    type: t.CLEAR_DATA,
    payload: key,
  });
};
