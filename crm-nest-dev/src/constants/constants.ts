export const CONSTANTS: any = {
  SALT_OR_ROUNDS: 12,
};

export const MIN_YEAR = '1970';
export const MIN_CHARACTER = 8;
export const CID_MAX_LENGTH = 4;
export const INVOICE_CODE_MAX_LENGTH = 2;
export const DEFAULT_INVOICE_NUMBER_CODE = 18;
export const DEFAULT_LIMIT_PAGINATE = 25;

export const TABLE_EMPTY_STATUS = 0;
export const FOMAT_DATE_TIME = 'YYYY-MM-DD HH:mm:ss.SSSSSS';

export const UPLOAD_CARD_VISIT_FORDER = 'files/upload/card-visit';
export const UPLOAD_CONTACT_AVATAR_FORDER = 'files/upload/contact-avatar';
export const UPLOAD_PROFILE_IMAGE_FORDER = 'files/upload/user-image';
export const LOGS_FOLDER = 'files/logs';
export const SYSTEM_LOGO_FORDER = 'files/upload/system';
export const ATTACHMENT_FORDER = 'files/upload/attachment';
export const ATTACHMENT_FORDER_FILE = 'files/upload/files';
export const DEFAULT_STATUS_ID_TASK = 1;
export const DEFAULT_IS_ARCHIVED_ID_TASK = 0;

export const regexPhoneNumber = /(?:[-+() ]*\d){10,13}/gm;
export const conditionCheckCompany = [
  'Co',
  'Ltd',
  'Company',
  '会社',
  '株式会社',
  'JSC',
  'PLC',
  'INC',
  'CO .LTD',
];

export const salePartnerOption = [
  'Total order revenue',
  'Total revenue by period',
];

export const INVOICE_PARTNERC_CODE = 'IPI';

export const NEW_PASSWORD = 'qi';
export const FORGOT_PASSWORD_TEMPLATES = './forgot-password';
export const INVOICE_TEMPLATES = './send-invoice';

export const extractEmails = (text: string) =>
  text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);

export const BASE_CURRENCY = 'https://api.currencyapi.com/v3/latest';
