import { TextField, Typography } from "@mui/material";
import React from "react";

const InputBase = (props: any) => {
  const {
    labelText,
    type,
    handleChange,
    errorText,
    placeholder,
    id,
    maxLength = null,
    value,
    minRows,
    require = false,
    disabled = false,
    onKeyUp,
    size,
    displayErrorText = true,
    label = "",
    variant="outlined",
    labelKey
  } = props;

  return (
    <>
      {labelText && (
        <Typography className={require ? "require" : ""}>
          {labelText}
        </Typography>
      )}
      <TextField
        disabled={disabled}
        multiline={!!minRows}
        minRows={minRows}
        error={!!errorText}
        label={label}
        size={size}
        fullWidth
        variant={variant}
        type={type}
        id={id}
        value={value ?? ""}
        placeholder={placeholder}
        helperText={displayErrorText && errorText}
        inputProps={{ maxLength: maxLength }}
        onChange={(e: any) =>
          props?.keyword
            ? handleChange(props?.keyword, e.target.value, labelKey, e.target.value)
            : handleChange(e.target.value)
        }
        onKeyUp={onKeyUp}
      />
    </>
  );
};

export default InputBase;
