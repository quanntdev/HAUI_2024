import axios from "axios";
import { successToast, errorToast } from "./toast";
import { statusCode } from "../constants";
import { CONFIG_AXIOS } from "../constants/axiosBase";

class BaseAxios {
  constructor() {
    const instance = axios.create(CONFIG_AXIOS);
    instance.interceptors.request.use(function (config) {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
          lang: localStorage.getItem("languages")
        };
      }
      return config;
    });
    /**
     * interceptors response
     */
    instance.interceptors.response.use(this.handleSuccess, this.handleError);
    this.instance = instance;
  }

  handleSuccess(response) {
    return response;
  }

  handleError(error) {
    if (error.response) {
      if (error.response?.data?.login === false) {
        localStorage.clear();
        window.location.href = "/login";
      } else if (error.response.status === statusCode.UN_AUTHORIZED) {
        if (error.response.data?.message)
          errorToast(error.response.data?.message);
      } else if (window.location.pathname.includes("/login")) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      } else {
        // errorToast( error?.response?.data?.properties?.email?.isEmail || message || "Error!")
      }
    }
    return Promise.reject(error);
  }

  async publicRequest(payload) {
    return this.request(payload);
  }

  /**
   * @method
   * @description
   * @param {*} payload this is object contain url, method, params, data
   * @param {url} this is url api
   * @param {method} this is method https request
   * @param {params} this params in request
   * @param {data} this data in body
   * @param {showNotification} check show notification
   * @param {showNotificationSuccess} check show notification success
   */
  async request(payload) {
    const { showNotification, showNotificationSuccess, ...rest } =
      this.defaultParamters(payload);
    const token = localStorage.getItem("access_token");
    /**
     * @param {headers} this contain Accept, Authorization
     */
    const newParams = {
      ...rest,
      Authorization: `Bearer ${token}`,
      lang: localStorage.getItem("languages")
    };
    try {
      const response = await this.instance(newParams);
      const data = response?.data;
      if (response?.status === statusCode.CREATED) {
        successToast(data?.message);
      } else if (response?.status === statusCode.UN_AUTHORIZED) {
        if (data?.message) errorToast(data?.message);
      } else if (
        data?.data ||
        data ||
        [statusCode.OK, statusCode.CREATED].includes(data?.status)
      ) {
        if (data?.message) successToast(data?.message);
      } else if (
        (data?.error ||
          ![statusCode.OK, statusCode.CREATED].includes(data?.status)) &&
        showNotification
      ) {
        if (data?.status === statusCode.UN_AUTHORIZED) {
          if (data?.message) errorToast(data?.message);
        }
      }
      return data;
    } catch (error) {
      if (showNotification) errorToast(error?.response?.data?.message);
      throw error;
    }
  }

  defaultParamters(payload) {
    const { showNotification = true, ...args } = payload;

    return {
      showNotification,
      ...args,
    };
  }
}

export const baseAxios = new BaseAxios();
