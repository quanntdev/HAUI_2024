import React, { useCallback, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Box, Button, FormControl, Popover } from "@mui/material";

import styles from "./styles.module.scss";

import moment from "moment";
import NewDateTime from "../../Input/DateTimePickerDefault/NewDateTime";
import { FOMAT_DATE_TIME } from "../../../constants";
import useTrans from "../../../utils/useTran";
import { getFirstValueInObject } from "../../../helpers";

type DATA_UPDATE_TASK = {
  name: string;
  priorityId: number | null;
  usersId: string;
  statusId: number | null;
  startDate: Date | null;
  dueDate: Date | null;
  description: string;
  isArchived: number | null;
  isPublic: number | null;
};

function PopperDatePicker(props: any) {
  const trans = useTrans();
  const {
    updateTask,
    formUpdateTask,
    setFormUpdateTask,
    handleChangeInput,
    task,
    keyword,
    value,
    title,
    minDate,
    dataError
  } = props;


  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setFormUpdateTask((prevFormUpdateTask:any) => ({
      ...prevFormUpdateTask,
      startDate: task?.startDate,
      dueDate: task?.dueDate
    }));
  }, [setAnchorEl, setFormUpdateTask, task?.startDate, task?.dueDate]);
  

  const handleAddCheckList: any = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUpdateDate = useCallback(() => {
    updateTask(task?.id, formUpdateTask);
    handleClose();
  }, [formUpdateTask, handleClose, task?.id, updateTask, moment]);

  useEffect(() => {
    setFormUpdateTask({
      ...formUpdateTask,
      startDate: moment(new Date(formUpdateTask?.startDate)).format(
        "YYYY-MM-DD HH:mm"
      ),
      dueDate: moment(new Date(formUpdateTask?.dueDate)).format(
        "YYYY-MM-DD HH:mm"
      ),
    });
  }, [formUpdateTask?.startDate, formUpdateTask?.dueDate])

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Box
        className={`${styles["detail-title"]} cursor-pointer`}
        onClick={handleAddCheckList}
        aria-describedby={id}
      >
        <span>{value ? moment(value).format(FOMAT_DATE_TIME) : "None"}</span>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: { width: "300px" },
        }}
      >
        <Box className={styles["checklist-popover-title"]}>
          <Typography className={styles["title"]}>{title}</Typography>
        </Box>
        <FormControl className={styles["checklist-popover-content"]}>
          <NewDateTime
            keyword={keyword}
            labelText={title}
            value={moment(value).format(FOMAT_DATE_TIME)}
            handleChange={handleChangeInput}
            errorText={getFirstValueInObject(dataError?.dueDate)}
            // minDate={dataForm?.startDate}
             minDate={minDate}
          />
        </FormControl>
        <Box
          className={`${styles["checklist-popover-action"]} mt-8 flex-end mr-8`}
        >
          <Button onClick={handleUpdateDate}>{trans.task.save}</Button>
          <Button onClick={handleClose}>{trans.task.cancle}</Button>
        </Box>
      </Popover>
    </>
  );
}

export default PopperDatePicker;
