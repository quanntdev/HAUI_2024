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
  
  const ModalReIssue = (props: any) => {
    const { openModal, setOpenModal, action, title, content } = props;
    const dispatch = useDispatch();
    const handleCloseModal = () => {
      setOpenModal(false);
    };
    const handleReIssue = () => {
      dispatch(action);
      handleCloseModal();
    };

    const trans = useTrans();

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
          <Button className={styles["btn-delete"]} onClick={handleReIssue}>
           {trans.task.save}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  export default ModalReIssue;
