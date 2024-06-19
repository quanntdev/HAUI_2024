import {
  Box,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment";
import router from "next/router";
import React, { useCallback, useState } from "react";
import { FOMAT_DATE } from "../../../constants";
import useTrans from "../../../utils/useTran";
import styles from "./styles.module.scss";

function FilterDate() {
  const trans = useTrans();
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterDueDate, setFilterDueDate] = useState("");

  const handleChangeDate = useCallback(
    (newValue: any, filterType: any, keyword: any) => {
      if (newValue != null && !isNaN(newValue.$d)) {
        const formattedDate = moment(newValue.$d).format(FOMAT_DATE);

        filterType(formattedDate);
        router.push({
          pathname: router?.pathname,
          query: {
            [keyword]: formattedDate,
          },
        });
      }
    },
    [router]
  );

  const createHandleChangeDate = (filterType: any, keyword: string) => {
    return (e: any) => handleChangeDate(e, filterType, keyword);
  };

  const handleChangeStartDate = createHandleChangeDate(
    setFilterStartDate,
    "filterStartDate"
  );
  const handleChangeDueDate = createHandleChangeDate(
    setFilterDueDate,
    "filterDueDate"
  );

  const handleCloseDate = (filterType: any, keyword: any) => {
    filterType("");
    const q = router.query;
    delete q[`${keyword}`];
    router.push({
      pathname: router?.pathname,
      query: q,
    });
  };

  const handleRenderInput = useCallback((params: any) => {
    return <TextField {...params} error={false} />;
  }, []);

  return (
    <>
      <FormControl sx={{ m: 1, width: 200 }}>
        <Box className={styles["list-date"]}>
          {!filterStartDate && !filterDueDate ? (
            <i>{trans.home.filter_by_date}</i>
          ) : (
            <Box>
              {filterStartDate && (
                <Typography className={styles["item"]}>
                  <span>{moment(filterStartDate).format(FOMAT_DATE)}</span>
                  <span
                    onClick={() =>
                      handleCloseDate(setFilterStartDate, "filterStartDate")
                    }
                  >
                    &times;
                  </span>
                </Typography>
              )}

              {filterDueDate && (
                <Typography className={styles["item"]}>
                  <span>{moment(filterDueDate).format(FOMAT_DATE)}</span>
                  <span
                    onClick={() =>
                      handleCloseDate(setFilterDueDate, "filterDueDate")
                    }
                  >
                    &times;
                  </span>
                </Typography>
              )}
            </Box>
          )}
        </Box>
        <Select
          sx={{
            backgroundColor: "white",
            height: 45,
            position: "relative",
            top: -7,
          }}
        >
          <MenuItem className={styles["input-item"]}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                disabled={!!filterDueDate}
                label={
                  !filterDueDate ? (
                    <div style={{ color: "black" }}>
                      {trans.order.start_date}
                    </div>
                  ) : (
                    <div style={{ color: "lightgray" }}>
                      {trans.order.start_date}
                    </div>
                  )
                }
                value={filterStartDate}
                inputFormat={FOMAT_DATE}
                onChange={handleChangeStartDate}
                renderInput={handleRenderInput}
              />
            </LocalizationProvider>
          </MenuItem>

          <MenuItem className={styles["input-item"]}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                disabled={!!filterStartDate}
                label={
                  !filterStartDate ? (
                    <div style={{ color: "black" }}>
                      {trans.order.due_date_}
                    </div>
                  ) : (
                    <div style={{ color: "lightgray" }}>
                      {trans.order.due_date_}
                    </div>
                  )
                }
                value={filterDueDate}
                inputFormat={FOMAT_DATE}
                onChange={handleChangeDueDate}
                renderInput={handleRenderInput}
              />
            </LocalizationProvider>
          </MenuItem>
        </Select>
      </FormControl>
    </>
  );
}

export default FilterDate;
