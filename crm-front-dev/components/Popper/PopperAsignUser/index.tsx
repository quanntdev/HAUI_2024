import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Box, FormControl, Popover } from '@mui/material';

import styles from "./styles.module.scss";
import { Add } from '@mui/icons-material';
import SelectDefault from '../../Input/SelectDefault';
import { searchUser } from '../../../redux/actions/user';
import { connect } from 'react-redux';
import useTrans from '../../../utils/useTran';

function PopperAsignUser(props: any) {
  const trans = useTrans();
  const {
    searchUser,
    userAsigned,
    updateTask,
    formUpdateTask,
    task,
  } = props;

  const { dataUserList } = props.user;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!anchorEl) {
      searchUser("");
    }
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const idUserAsigned = userAsigned?.map((item: any) => item?.id);

  const getUserNotAsigned = () => {
    const userNotAsigned: any = [];
    dataUserList?.items?.filter((item: any) => {
      if (!idUserAsigned?.includes(item?.id) && item?.profile !== null) {
        userNotAsigned.push(item?.profile);
      }
    })
    return userNotAsigned;
  }

  const usersId = (id: any) => {
    const getUserAdd = dataUserList?.items?.filter((item: any) => item?.profile?.id === id);
    idUserAsigned?.push(getUserAdd?.[0]?.id);
  }

  const handleChange = (key: string, value: string) => {
    usersId(value);
    updateTask(task?.id, {
      ...formUpdateTask,
      usersId: idUserAsigned.toString(),
    })

    setAnchorEl(null);
  }

  const handleAddCheckList: any = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }


  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Box
        className={`${styles["detail-title"]} cursor-pointer`}
        onClick={handleAddCheckList}
        aria-describedby={id}
      >
        <Add className={`${styles["icon-add"]} cursor-pointer`} />
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
        PaperProps={{
          style: { width: '250px' },
        }}
      >
        <Box className={styles["checklist-popover-title"]}>
          <Typography className={styles["title"]}>{trans.task.assigned_user}</Typography>
        </Box>
        <FormControl className={styles["checklist-popover-content"]}>
          <SelectDefault
            data={getUserNotAsigned()}
            keyMenuItem="id"
            keyValue="first_name"
            keyValueTwo="last_name"
            keyword="usersId"
            handleChange={handleChange}
            fullWidth
            size="small"
          />
        </FormControl>
      </Popover>
    </>
  );
}

const mapStateToProps = (state: any) => ({
  user: state?.user
})

const mapDispatchToProps = {
  searchUser,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PopperAsignUser);
