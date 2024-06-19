import { useState, useEffect } from "react";
import * as React from "react";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import moment from "moment";
import { Typography } from "@mui/material";
import { FOMAT_DATE } from "../../../constants";

const DatePickerDefault = (props: any) => {
  const { value, size, minDate, maxDate } = props;
  const [startDate, setStartDate] = useState(null);
  const {
    handleChange,
    errorText,
    labelText,
    disableFuture,
    require = false,
    disabled = false,
    variant = "outlined",
    labelKey
  } = props;
  useEffect(() => {
    setStartDate(value);
  }, [value]);
  const handleChangeDate = (newValue: any) => {
    setStartDate(newValue);
    let value = "";
    if (newValue != null)
      value = moment(new Date(newValue)).format(
        props?.format?.replace("dd", "DD")?.replace("yyyy", "YYYY") ||
          "YYYY-MM-DD"
      );
    return props?.keyword
      ? handleChange(props?.keyword, value ?? newValue, labelKey, value ?? newValue)
      : handleChange(value);
  };

  return (
    <div>
      <Typography className={require ? "require" : ""}>{labelText}</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          inputFormat={FOMAT_DATE}
          value={startDate}
          onChange={handleChangeDate}
          disableFuture={!!disableFuture}
          minDate={minDate ? new Date(minDate) : ""}
          disabled={disabled}
          maxDate={maxDate ? new Date(maxDate) : ""}
          renderInput={(params) => (
            <TextField
              size={size}
              fullWidth
              {...params}
              variant={variant}
              error={!!errorText}
              helperText={errorText || ""}
            />
          )}
        />
      </LocalizationProvider>
    </div>
  );
};
export default DatePickerDefault;
