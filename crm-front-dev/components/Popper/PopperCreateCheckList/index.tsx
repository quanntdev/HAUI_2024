import React, { useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import InputBase from '../../Input/InputBase';

import styles from "./styles.module.scss";
import { FactCheck } from '@mui/icons-material';
import useTrans from '../../../utils/useTran';

type DATA_CHECKLIST = {
  title: string;
  taskId: Number | null;
  isDone: Number | null;
}

const INIT_DATA = {
  title: "",
  taskId: null,
  isDone: null,
}

function PopperCreateChecklist(props: any) {
  const trans = useTrans();
  const {
    createChecklist,
    taskId,
    dataCreateChecklist,
  } = props;

  const [dataForm, setDataForm] = useState<DATA_CHECKLIST>(INIT_DATA);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    setDataForm({
      ...dataForm,
      taskId: Number(taskId),
    })
  }, [taskId, dataCreateChecklist]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenChecklist = () => {
    setAnchorEl(null);
    createChecklist(dataForm);
    setDataForm(INIT_DATA);
  }

  const handleChange = (key: string, value: string) => {
    setDataForm({ ...dataForm, [key]: value })
  }

  const handleAddCheckList: any = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }


  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <>
      <Box
        className={`${styles["detail-title"]} ${styles["detail-left-info"]} ${styles["button-click"]} cursor-pointer`}
        onClick={handleAddCheckList}
        aria-describedby={id}
      >
        <FactCheck className={styles["detail-icon-left"]} />
        <span>{trans.task.add_checklist}</span>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box className={styles["checklist-popover-title"]}>
          <Typography className={styles["title"]}>{trans.task.add_checklist}</Typography>
        </Box>
        <Box className={styles["checklist-popover-content"]}>
          <InputBase
            labelText={trans.order.title}
            size="small"
            keyword="title"
            value={dataForm?.title}
            handleChange={handleChange}
          />
        </Box>
        <Box className={styles["checklist-popover-action"]}>
          <Button onClick={handleOpenChecklist}>{trans.task.add}</Button>
        </Box>
      </Popover>
    </>
  );
}

export default PopperCreateChecklist;
