import {
  Select,
  Typography,
  MenuItem,
  FormHelperText,
  FormControl,
} from "@mui/material";
import useTrans from "../../../utils/useTran";
import { useCallback } from "react";

const SelectDefault = (props: any) => {
  const {
    labelText,
    value,
    data,
    handleChange,
    handleOpen,
    errorText,
    keyword,
    keyMenuItem,
    keyValue,
    keyValueTwo,
    keyValuePropertyOne,
    keyValuePropertyTwo,
    require = false,
    disabled = false,
    variant = "outlined",
    size,
    placeholder = false,
    fillterAll = false,
    sx,
    padding,
    title,
    labelKey,
  } = props;
  

  const trans = useTrans();

  const convertString = (str: any) => {
    if (str) {
      return str?.charAt(0)?.toUpperCase() + str.slice(1)?.toLowerCase();
    }
    return str;
  };

  const handleInputChange = useCallback(
    (e: any) => {
      const selected = data.find((option: any) => option.id === e.target.value);
      const selectedLabel: any =
        labelKey === "userAssignLabel"
          ? selected?.profile?.first_name + selected?.profile?.last_name
          : selected?.name;
      if (keyword) {
        handleChange(
          keyword,
          e.target.value,
          labelKey ?? "",
          labelKey ? selectedLabel : ""
        );
      } else {
        handleChange(e.target.value);
      }
    },
    [data, keyword, labelKey, handleChange]
  );

  return (
    <>
      <Typography className={require ? "require" : ""}>{labelText}</Typography>
      <FormControl sx={{ width: "100%" }} error>
        <Select
          size={size}
          disabled={disabled}
          displayEmpty
          style={{ backgroundColor: "white", padding: padding }}
          inputProps={{ "aria-label": "Without label" }}
          value={value ?? ""}
          fullWidth
          margin="dense"
          variant={variant}
          error={!!errorText}
          onOpen={handleOpen}
          onChange={handleInputChange}
          sx={sx}
        >
          <MenuItem disabled value="">
            <em>
              {placeholder
                ? placeholder
                : `${trans.task.select} ` + (title ?? "")}
            </em>
          </MenuItem>
          {fillterAll && <MenuItem value={0}>{placeholder}</MenuItem>}
          {data?.map((item: any, index: number) => {
            if (item[keyValue] != null)
              return (
                <MenuItem key={index} value={item[keyMenuItem] ?? index}>
                  {(keyValuePropertyOne && keyValuePropertyTwo &&`${convertString(
                      item[keyValue][keyValuePropertyOne]  )} ${convertString(
                      item[keyValue][keyValuePropertyTwo]
                    )}`) ||
                    (keyValuePropertyOne &&
                      `${convertString(
                        item[keyValue][keyValuePropertyOne]
                      )}`) ||
                    (keyValueTwo &&
                      keyValue &&
                      `${convertString(item[keyValue])} ${convertString(
                        item[keyValueTwo]
                      )}`) ||
                    convertString(item[keyValue])}
                </MenuItem>
              );
          })}
        </Select>
        <FormHelperText>{!!errorText && errorText}</FormHelperText>
      </FormControl>
    </>
  );
};
export default SelectDefault;
