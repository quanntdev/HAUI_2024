import config from "src/config";


export const requestCurrency = {
  redirect: 'follow',
  headers: {
    apikey : config.APILAYER_CURRENCY_KEY
  },
};