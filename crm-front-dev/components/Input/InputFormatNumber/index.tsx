import { Box, TextField, Typography } from "@mui/material";
import { useCallback } from "react";
import { NumericFormat } from "react-number-format";

const InputFormatNumber = (props: any) => {
  const {
    labelText,
    handleChange,
    errorText,
    placeholder,
    value,
    require = false,
    disabled = false,
    size,
    variant = "outlined",
    onKeyUp,
    allowNegative,
    allowedDecimalSeparators,
    decimalScale,
    decimalSeparator,
    prefix,
    suffix,
    displayErrorText = true,
    label,
    disable = false,
    labelKey,
    probability,
    currency,
  } = props;

  const handleNumericFormatChange = useCallback(
    (event: any) => {
      const inputValue = event.target.value;
      if (props?.keyword) {
        handleChange(props.keyword, inputValue, labelKey, inputValue);
      } else {
        handleChange(inputValue);
      }
    },
    [props, handleChange, labelKey]
  );

  return (
    <Box sx={{ position: "relative" }}>
      {label && (
        <Typography className={require ? "require" : ""}>{label}</Typography>
      )}
      <NumericFormat
        customInput={TextField}
        label={labelText}
        variant={variant}
        placeholder={placeholder}
        size={size}
        required={require}
        disabled={disabled}
        value={value}
        onChange={handleNumericFormatChange}
        error={!!errorText}
        onKeyUp={onKeyUp}
        helperText={displayErrorText && errorText}
        allowNegative={allowNegative}
        allowedDecimalSeparators={allowedDecimalSeparators}
        decimalScale={decimalScale}
        decimalSeparator={decimalSeparator}
        prefix={prefix}
        suffix={suffix}
        fullWidth
        thousandSeparator={!disable}
      />
      {probability && <span className="probability">%</span>}
      {currency && <span className="probability">{currency}</span>}
    </Box>
  );
};

export default InputFormatNumber;
