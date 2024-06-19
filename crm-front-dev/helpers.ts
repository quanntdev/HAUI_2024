import {keyPage, pageDefault} from "./constants";

export const getParamsToURL = (prams: {[index: string]: any} = {}) => {
  const ojbFilters: {[index: string]: any} = {};
  Object.keys(prams)?.map((key) => [key, prams[key]])?.map((row) => {
    if (!['values want to give up'].includes(row[0])) {
      ojbFilters[row[0]] = row[1];
    }
    (row[0]?.includes(keyPage) && row[1] === pageDefault) && delete ojbFilters[row[0]];
    !ojbFilters[row[0]] && delete ojbFilters[row[0]];
  })
  return ojbFilters;
}

export const getPageFromParams = (value: any) => {
  const page = Number(value ?? 0);
  return page ? page - 1 : page;
}

export const getFirstValueInObject = (value: any) => {
  return Object.values(value ?? {})[0] ?? "";
}
