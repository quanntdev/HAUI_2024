export const CONFIG_URL = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
};

export const CONFIG_AXIOS = {
  baseURL: process.env.NEXT_PUBLIC_API_ADDRESS,
  ...CONFIG_URL
};
