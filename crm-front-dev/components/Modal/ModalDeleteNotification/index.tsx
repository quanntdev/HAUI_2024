import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import useTrans from "../../../utils/useTran";
import styles from "./styles.module.scss";
import { useCallback } from "react";

const ModalDeleteNotification = (props: any) => {
  const { openModalDeleteNotification, setOpenModalDeleteNotification, title, content } = props;

  const handleCloseModal = useCallback(() => {
    setOpenModalDeleteNotification(false);
  }, [setOpenModalDeleteNotification]);

  const trans =useTrans()

  return (
    <Dialog
      open={openModalDeleteNotification}
      onClose={handleCloseModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={styles["dialog-actions"]}>
        <Button className={styles["btn-alert"]} onClick={handleCloseModal}>
          {trans.contact.close}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDeleteNotification;
