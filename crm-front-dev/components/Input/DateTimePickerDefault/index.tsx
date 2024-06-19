import { useState, useEffect } from "react";
import moment from "moment";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FOMAT_DATE } from "../../../constants";

const DateTimePickerDefault = (props: any) => {
  const { value, minDate } = props;
  const [dateTime, setDateTime] = useState<any>(undefined);
  const {
    handleChange,
    errorText,
    labelText,
    keyword,
    require = false,
    disabled = false,
  } = props;

  useEffect(() => {
    if(value == 'Invalid date') {
      const formatValue = moment().format(FOMAT_DATE);
      handleChange(keyword, formatValue)
      return  setDateTime(formatValue);
    }

    if (value && value != 'Invalid date') {
      const formatValue = moment(value).format(FOMAT_DATE);
      return setDateTime(formatValue);
    } else if (minDate) {
      const formatValue = moment(minDate).format(FOMAT_DATE);
      return setDateTime(formatValue);
    }
  }, [value, minDate]);

  const handleChangeDate = (newValue: any) => {

    setDateTime(newValue?.target?.value);
    let value = "";

    if (newValue?.target?.value != null)
      value = moment(newValue?.target?.value).format(FOMAT_DATE);

    return props?.keyword
      ? handleChange(props?.keyword, value ?? newValue?.target?.value)
      : handleChange(value);
  }

  return (
    <div>
      <Typography className={require ? "require" : ""}>{labelText}</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <input
              type="datetime-local"
              value={dateTime ? dateTime : null}
              onChange={handleChangeDate}
              min={minDate}
              disabled={disabled}
              className={errorText ?"datetime-local-error" : "datetime-local"}
            />
            {errorText && (
               <div className="datetime-local-text">{errorText}</div>
            )}
          </Stack>
        </LocalizationProvider>
    </div>
  );
};
export default DateTimePickerDefault;
