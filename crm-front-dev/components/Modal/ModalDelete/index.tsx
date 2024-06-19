import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import styles from "./styles.module.scss";
import { useDispatch } from "react-redux";
import useTrans from "../../../utils/useTran";

const ModalDelete = (props: any) => {
  const trans = useTrans();
  const {
    openModal,
    setOpenModal,
    action,
    title,
    content,
    textAction = `${trans.contact.delete}`,
    status = "delete",
  } = props;
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleDeleteContact = () => {
    dispatch(action);
    handleCloseModal();
  };

  return (
    <Dialog
      open={openModal}
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
        <Button className={styles["btn-cancel"]} onClick={handleCloseModal}>
          {trans.task.cancle}
        </Button>
        <Button className={styles["btn-delete"]} onClick={handleDeleteContact}>
          {textAction}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDelete;
