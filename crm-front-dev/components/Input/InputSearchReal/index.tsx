import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

const InputSearchReal = (props: any) => {
  const [value, setChangeValue] = useState<any>("")
  const {
    placeholder,
    id,
    maxLength = null,
    minRows,
    onKeyUp,
    size,
    label = "",
    variant="outlined",
    handleSearch
  } = props;

  useEffect(() => {
    handleSearch(`keyword=${value}`)
  }, [value])

  return (
    <>
      <TextField
        multiline={!!minRows}
        label={label}
        size={size}
        fullWidth
        variant={variant}
        id={id}
        value={value ?? ""}
        placeholder={placeholder}
        inputProps={{ maxLength: maxLength }}
        onChange={(e: any) =>setChangeValue(e.target.value)
        }
        onKeyUp={onKeyUp}
      />
    </>
  );
};

export default InputSearchReal;
