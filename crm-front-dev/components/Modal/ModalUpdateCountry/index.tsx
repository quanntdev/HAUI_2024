import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import styles from "./styles.module.scss";

import useTrans from "../../../utils/useTran";

const ModalUpdateCountry = (props: any) => {
  const {
    openModalUpdateCountry,
    setOpenModalUpdateCountry,
    title,
    content,
    setOnOpenModalCustomer,
  } = props;
  const handleCloseModal = () => {
    setOpenModalUpdateCountry(false);
    if (setOnOpenModalCustomer) {
      setOnOpenModalCustomer(false);
    }
  };

  const trans = useTrans();

  return (
    <Dialog
      open={openModalUpdateCountry}
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

export default ModalUpdateCountry;
