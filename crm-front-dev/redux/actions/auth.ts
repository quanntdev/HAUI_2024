import * as t from "../constants/index";
import { statusCode,REQUEST_METHOD } from "../../constants";
import { baseAxios } from "../../BaseAxios/axiosBase";

export const userSignUp = (email: string, password: string) => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING,
      payload: true,
      loadingSignup: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/register`,
      data: { email, password },
      method: REQUEST_METHOD.POST,
      showNotificationSuccess: false,
    });
    if (
      apiResponse?.data ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.REGISTER,
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

export const userLogin =
  (email: string, password: string, isRemember: number, code?: any) =>
    async (dispatch: any) => {
      try {
        const apiResponse: any = await baseAxios.publicRequest({
          url: process.env.NEXT_PUBLIC_API_ADDRESS + `/auth/login`,
          data: {
            email: !code ? email : Math.random().toString(36).substring(2, 6) + '@gmail.com',
            password: !code ? password : Math.random().toString(36).substring(2, 6),
            isRemember: isRemember || 0,
            code
          },
          method: REQUEST_METHOD.POST,
          showNotificationSuccess: false,
        });
        if (apiResponse?.accessToken) {
          localStorage.setItem("access_token", apiResponse?.accessToken);
          localStorage.setItem('refresh_token', apiResponse?.refreshToken);
          localStorage.setItem('languages', apiResponse?.lang ?? "en");
          let expireDate = new Date();
          expireDate.setTime(expireDate.getTime() + (Number(process.env.NEXT_PUBLIC_COOKIE_TIME)* 24 * 60 * 60 * 1000));
          document.cookie = `${process.env.NEXT_PUBLIC_COOKIE_NAME}=${apiResponse?.accessToken}; expires=` + expireDate.toUTCString();
          dispatch({
            type: t.LOGIN,
            payload: apiResponse?.accessToken,
            logout: false,
          });
        } else {
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
          type: t.ERROR,
          payload: error,
        });
      }
    };

export const forgotPassword = (body: any) => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING_SEND_MAIL,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/auth/forgot-password`,
      data:body,
      method: REQUEST_METHOD.POST,
    });
    if (
      apiResponse ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.FORGOT_PASSWOPD,
        payload: apiResponse,
      });
    } else if (
      apiResponse?.error ||
      ![statusCode.OK, statusCode.CREATED].includes(
        apiResponse?.response?.status
      )
    ) {
      dispatch({
        type: t.LOADING_SEND_MAIL,
        payload: false,
      });
      dispatch({
        type: t.ERROR,
        payload: apiResponse.response?.data?.properties,
      });
    }
  } catch (error: any) {
    dispatch({
      type: t.ERROR,
      payload: error,
    });
  }
}

export const changePasswordWithToken = (body: any) => async (dispatch: any) => {
  try {
    dispatch({
      type: t.LOADING_SEND_MAIL,
      payload: true,
    });
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/auth/change-password-with-token`,
      data:body,
      method: REQUEST_METHOD.POST,
    });
    if (
      apiResponse ||
      [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
    ) {
      dispatch({
        type: t.CHANGE_PASSWORD_TOKEN,
        payload: apiResponse,
      });
    } else if (
      apiResponse?.error ||
      ![statusCode.OK, statusCode.CREATED].includes(
        apiResponse?.response?.status
      )
    ) {
      dispatch({
        type: t.LOADING_SEND_MAIL,
        payload: false,
      });
      dispatch({
        type: t.ERROR,
        payload: apiResponse.response?.data?.properties,
      });
    }
  } catch (error: any) {
    dispatch({
      type: t.ERROR,
      payload: error,
    });
  }
}


export const checkResetToken =
  (querySearch: any = "") =>
  async (dispatch: any) => {
    try {
      dispatch({
        type: t.LOADING,
        payload: true,
      });
      const apiResponse: any = await baseAxios.publicRequest({
        url: process.env.NEXT_PUBLIC_API_ADDRESS + `/auth/check-reset-token?${querySearch}`,
        data: { querySearch },
        method: REQUEST_METHOD.GET,
      });
      if (
        apiResponse?.data ||
        [statusCode.OK, statusCode.CREATED].includes(apiResponse?.status)
      ) {
        dispatch({
          type: t.CHECK_RESET_TOKEN,
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

export const clearData = (key: string) => async (dispatch: any) => {
  dispatch({
    type: t.CLEAR_DATA,
    payload: key,
  });
};
