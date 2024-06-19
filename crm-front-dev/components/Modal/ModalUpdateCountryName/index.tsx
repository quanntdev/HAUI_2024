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

const ModalUpdateCountryName = (props: any) => {
  const { openModalUpdateCountryName, setOpenModalUpdateCountryName, title, content } =
    props;

    const handleCloseModal = useCallback(() => {
      setOpenModalUpdateCountryName(false);
    }, [setOpenModalUpdateCountryName]);

  const train = useTrans();

  return (
    <Dialog
      open={openModalUpdateCountryName}
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
          {train.contact.close}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalUpdateCountryName;
