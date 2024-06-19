import Select from "react-select";
import { Typography, Button } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import React from "react";

const customStyles = {
  control: (base: any, state: { isFocused: any }) => ({
    ...base,
    height: "46px",
    width: "150px",
  }),
  menu: ((provided:any) => ({ ...provided, zIndex: 100 })),
  placeholder: (base:any) => ({
    ...base,
    fontStyle: 'italic',
    zIndex: 100
  })
};

const customStylesValidate = {
  control: (base: any, state: { isFocused: any }) => ({
    ...base,
    height: "46px",
    border: "1px solid red",
  }),
  placeholder: (base:any) => ({
    ...base,
    fontStyle: 'italic',
    marginTop: '20px',
    position: 'absolute',
  })
}

const SelectInputSort = (props: any) => {
  const {
    options,
    labelText,
    value,
    handleChange,
    keyword,
    require = false,
    disabled = false,
    formFilter,
    errorText,
  } = props;

  const defaults = options?.filter((key: { id: any }) => {
    return key?.id == value;
  });

  const handleChangeData = () => {
    keyword ? handleChange(keyword, null) : handleChange(null);
  };

  return (
    <>
      <Typography className={require ? "require" : "" + "arrow-icon"}>
        {labelText}
        {formFilter && (
          <Button onClick={handleChangeData}>
            <CachedIcon />
          </Button>
        )}
      </Typography>
        <Select
          styles={
            (errorText) ? customStylesValidate : customStyles
          }
          options={options}
          isDisabled={disabled}
          required={require}
          value={
            defaults
              ? { label: defaults[0]?.label, value: defaults[0]?.id }
              : ""
          }
          placeholder="coide"
          onChange={(e: any) =>
            keyword ? handleChange(keyword, e?.value) : handleChange(e?.value)
          }
        />
      <span className="text-fail-validate">
        {errorText ? errorText : ""}
      </span>
    </>
  );
};

export default SelectInputSort;
