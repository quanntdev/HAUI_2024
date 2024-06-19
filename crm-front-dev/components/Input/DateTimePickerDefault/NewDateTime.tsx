import moment from "moment";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "flatpickr/dist/themes/airbnb.css";

import Flatpickr from "react-flatpickr";
import { FOMAT_DATE_TIME } from "../../../constants";

const newDateTime = (props: any) => {
  const { value, minDate } = props;
  const {
    handleChange,
    errorText,
    labelText,
    require = false,
    disabled = false,
  } = props;

  function handleChangeDate(newValue: any) {
    let value = "";

    if (moment(new Date(newValue)).format(FOMAT_DATE_TIME) != null)
      value = moment(new Date(newValue)).format(FOMAT_DATE_TIME);
    return props?.keyword
      ? handleChange(
          props?.keyword,
          value ?? moment(new Date(newValue)).format(FOMAT_DATE_TIME)
        )
      : handleChange(value);
  }

  return (
    <div>
      <Typography className={require ? "require" : ""}>{labelText}</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={3}>
          <Flatpickr
            data-enable-time
            value={
              minDate
                ? moment(minDate).add(1, "d").format(FOMAT_DATE_TIME)
                : moment(value).format(FOMAT_DATE_TIME)
            }
            onChange={handleChangeDate}
            options={{
              dateFormat: "Y/m/d H:i",
              minDate: minDate,
              minuteIncrement: 1,
            }}
            disabled={disabled}
            className={errorText ? "datetime-local-error" : "datetime-local"}
          />
          {errorText && <div className="datetime-local-text">{errorText}</div>}
        </Stack>
      </LocalizationProvider>
    </div>
  );
};
export default newDateTime;
