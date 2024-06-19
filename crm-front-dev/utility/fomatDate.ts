import moment from "moment";
import { FOMAT_DATE } from "../constants";

const fomatDate = (date: string) => {
  const value = moment(date).format(FOMAT_DATE);
  if (value != "Invalid date") {
    return value;
  } else {
    return "";
  }
};

export default fomatDate;
