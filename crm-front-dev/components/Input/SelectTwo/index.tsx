import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { Typography } from "@mui/material";
import styles from "./styles.module.scss";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, item: readonly string[], theme: Theme) {
  return {
    fontWeight:
      item?.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const SelectTwo = (props: any) => {
  const {
    labelText,
    value,
    data,
    handleChange,
    size,
    keyNameOne,
    keyNameTwo,
    keyNamePropertyOne,
    keyNamePropertyTwo,
  } = props;

  const theme = useTheme();

  return (
    <>
      <Typography>{labelText}</Typography>
      <Select
        size={size}
        fullWidth
        id="demo-multiple-chip"
        multiple
        value={value}
        onChange={(event: any) => handleChange(event)}
        input={<OutlinedInput id="select-multiple-chip" />}
        renderValue={(selected) => (
          <Box className={styles["box-chip-list"]}>
            {selected?.map((value: any, index: any) => (
              <Chip
                key={index}
                label={
                  (keyNamePropertyOne &&
                    keyNamePropertyTwo &&
                    `${value[keyNameOne][keyNamePropertyOne]} ${value[keyNameOne][keyNamePropertyTwo]}`) ||
                  (keyNamePropertyOne &&
                    value[keyNameOne][keyNamePropertyOne]) ||
                  (keyNameOne &&
                    keyNameTwo &&
                    `${value[keyNameOne]} ${value[keyNameTwo]}`) ||
                  (keyNameOne && value[keyNameOne])
                }
              />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
        inputProps={{ "aria-label": "Without label" }}
      >
        {data?.map((item: any) => {
          if (item[keyNameOne] != null) {
            return (
              <MenuItem
                key={item.id}
                value={item}
                style={getStyles(item, value, theme)}
              >
                {(keyNamePropertyOne &&
                  keyNamePropertyTwo &&
                  `${item[keyNameOne][keyNamePropertyOne]} ${item[keyNameOne][keyNamePropertyTwo]}`) ||
                  (keyNamePropertyOne &&
                    item[keyNameOne][keyNamePropertyOne]) ||
                  (keyNameOne &&
                    keyNameTwo &&
                    `${item[keyNameOne]} ${item[keyNameTwo]}`) ||
                  (keyNameOne && item[keyNameOne])}
              </MenuItem>
            );
          }
        })}
      </Select>
    </>
  );
};

export default SelectTwo;
