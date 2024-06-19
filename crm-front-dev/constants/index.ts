import moment from "moment";

export const REQUEST_METHOD = {
  POST: "post",
  GET: "get",
  PATCH: "patch",
  PUT: "put",
  DELETE: "delete",
};

export const statusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  UN_AUTHORIZED: 401,
  NOT_FOUND: 404,
};
export const LogNoteActions = {
  CREATE: 1,
  EDIT: 2,
  COMMENT: 3,
  UPLOAD_FILE: 19,
  UPLOAD_FILE_RAW: 23,
  REACTION: 32,
};

export const InvoiceStatus = {
  CREATE: 1,
};

export const TYPE_LOGNOTE_COMMENT = "comment";
export const TYPE_LOGNOTE_FILE = "file";
export const TYPE_LOGNOTE_FILE_RAM = "file-raw";

export const EMOJI = {
  LIKE: "👍",
  TYM: "❤️",
  LOOK: "👀",
  DONE: "✅",
  NICELY_DONE: "🙌",
  MINE: "🕛",
  PEOPLE: "😀",
  NATURE: "🍀",
  FOOD_AND_DRINK: "🍎",
  ACTIVITY: "⚽️",
  TRAVEL_AND_PLACES: "🚗",
  OBJECTS: "⌚️",
  SYMBOLS: "❤️",
  FLAGS: "🇻🇳",
};

export const ISO3166API = "https://restcountries.com/v3.1/all";

export const CONVERTED_ORDER_STATUS = 5;
export const CREATE_ORDER_STATUS = 1;
export const OVER_ORDER_STATUS = 3;
export const REQUEST_SENDING = 2;
export const PAID = 4;
export const rowsPerPage = 25;
export const rowsPerPageLimit = 1000;
export const keyPerPage = "limit";
export const pageDefault = 1;
export const keyPage = "page";
export const SELECT_ALL_INDEX = 0;
export const REGEX_NUMBER = /^[0-9]+$/;
export const ORDER_ITEM_COMPLETED_STATUS = 5;
export const todayMoment = moment();
export const tomorrowMoment = todayMoment.clone().add(1, "days");

export const genders = [
  { id: 0, name: "Female" },
  { id: 1, name: "Male" },
];

export const currencyList = ["VN", "JP"];

export const employee = ["1-50", "50-200", "200-500", "500-1000", "> 1000"];

export const tagList = ["Success", "Error", "Pending"];
export const userRoles = [
  { key: 1, value: "Admin" },
  { key: 2, value: "Sale" },
  { key: 3, value: "Sale Assistant" },
];

export enum partnerSaleOption {
  TOTAL_PAYMENT_REVENUE = 1,
  TOTAL_PAYMENT_BY_PERIOD = 2,
}

export const invoiceStatus = [
  { id: 1, name: "CREATED" },
  { id: 2, name: "REQUEST SENDING" },
  { id: 3, name: "OVER DUE" },
  { id: 4, name: "PAID" },
  { id: 5, name: "COMPLETED" },
];

export const PRIORITY_LIST = [
  { id: 1, name: "Low", color: "#99D9EA" },
  { id: 2, name: "Normal", color: "#B5E61E" },
  { id: 3, name: "High", color: "#FFF200" },
  { id: 4, name: "Urgent", color: "#ED2A23" },
];

export const RELATED_ITEMS = [
  { id: 1, name: "Customer" },
  { id: 2, name: "Deal" },
  { id: 3, name: "Order" },
  { id: 4, name: "Invoice" },
];

export const STATUS_TASK = [
  { id: 1, name: "New" },
  { id: 2, name: "In Progress" },
  { id: 3, name: "Done" },
  { id: 4, name: "All" },
];

export const LOGNOTE_FILLTER = [
  { id: "activity", name: "Activity" },
  { id: "comment", name: "Comment" },
];

export const PUBLIC_STATUS_LIST = [
  { id: 0, name: "Private" },
  { id: 1, name: "Public" },
];

export const UPLOAD_FILE = 19;
export const UPLOAD_FILE_RAW = 23;

export const NOTIFICATION_SOCKET_CREATED = 1;

export const IMAGE_DEFAULT_LENGTH = 20 * 1000000;
export const FILE_SIZE_MAX = 104857600;
export const IMAGE_SIZE_MAX = 20971520;

export const URL_API_IMAGE_AVATAR =
  process.env.NEXT_PUBLIC_API_ADDRESS + "/images/user/";
export const URL_API_IMAGE_VISIT =
  process.env.NEXT_PUBLIC_API_ADDRESS + "/images/card-visit/";
export const URL_API_IMAGE_ATTACHMENT =
  process.env.NEXT_PUBLIC_API_ADDRESS + "/images/attachment/";

export const URL_API_FILE_ATTACHMENT =
  process.env.NEXT_PUBLIC_API_ADDRESS + "/images/file/";

export const URL_API_FILE_LOGO =
  process.env.NEXT_PUBLIC_API_ADDRESS + "/images/setting/";

export const URL_API_CONTACT_AVATAR =
  process.env.NEXT_PUBLIC_API_ADDRESS + "/images/contact-avatar/";

export const FOMAT_DATE = "YYYY/MM/DD";
export const FOMAT_DATE_TIME = "YYYY/MM/DD HH:mm";
export const FOMAT_DATE_DEFAULT = "DD/MM/YYYY";
