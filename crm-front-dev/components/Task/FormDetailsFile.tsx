import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./styles.module.scss";
import {
  FOMAT_DATE_TIME,
  UPLOAD_FILE,
  UPLOAD_FILE_RAW,
  URL_API_FILE_ATTACHMENT,
} from "../../constants";
import moment from "moment";
import fileImg from "../../assets/images/file.png";
import Link from "next/link";
import useTrans from "../../utils/useTran";
import getNameFileUpload from "../../utility/getNameFileUpload";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const FormDetailFile = (props: any) => {
  const trans = useTrans();
  const { file, deleteComment, key } = props;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const handleClick = (e: any) => {
    e.preventDefault()
    deleteComment(file?.id)
    e.stopPropagation();
  };

  const handleLinkFile = (file: any) => {
    return URL_API_FILE_ATTACHMENT + file;
  };

  return (
    <div key={key}>
      {file?.action === UPLOAD_FILE && (
        <div
          className={styles["image-previews"]}
          onClick={handleClickOpen}
        >
          <img
            className={styles["image-previews-img"]}
            src={
              file?.action === UPLOAD_FILE_RAW
                ? fileImg.src
                : handleLinkFile(file?.attachment)
            }
          />
          <div className={styles["content"]}>
            <div className={styles["title"]}>{getNameFileUpload(file?.attachment)}</div>
            <div className={styles["time"]}>
              {moment(file?.created_at).format(FOMAT_DATE_TIME)}
              <span className={styles["action"]} onClick={handleClick}>{trans.task.delete}</span>
            </div>
          </div>
        </div>
      )}
      {file?.action === UPLOAD_FILE_RAW && (
        <Link href={ handleLinkFile(file?.attachment)} passHref>
          <a
            target="_blank"
            className={`text-cursor text-link ml-8 ${styles["image-previews-items"]}`}
          >
            <img
              className={styles["image-previews-img"]}
              src={
                file?.action === UPLOAD_FILE_RAW
                  ? fileImg.src
                  : handleLinkFile(file?.attachment)
              }
            />
            <div className={styles["content"]}>
              <div className={styles["title"]}>{getNameFileUpload(file?.attachment)}</div>
              <div className={styles["time"]}>
                {moment(file?.created_at).format(FOMAT_DATE_TIME)}
                <span className={styles["action"]} onClick={handleClick}>{trans.task.delete}</span>
              </div>
            </div>
          </a>
        </Link>
      )}
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className={styles["image-privew-modal"]}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
        </BootstrapDialogTitle>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          {file?.attachment}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <img
            className={styles["image-Modal-img"]}
            src={handleLinkFile(file?.attachment)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormDetailFile;
