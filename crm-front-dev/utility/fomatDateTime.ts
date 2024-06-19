import moment from "moment";
import { FOMAT_DATE_TIME } from "../constants";

const fomatDateTime = (date: string) => {
  const value = moment(date).format(FOMAT_DATE_TIME);
  if (value != "Invalid date") {
    return value;
  } else {
    return "";
  }
};

export default fomatDateTime;
