
import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogTitle, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useState } from "react";
import Cropper from "react-cropper";
import { errorToast } from "../../BaseAxios/toast";
import { IMAGE_DEFAULT_LENGTH } from "../../constants";
import useTrans from "../../utils/useTran";

import styles from "./styles.module.scss";

const ModalUploadAvatar = (props: any) => {
  const trans = useTrans();
  const {
    openModalUploadAvatar,
    setOpenModalUploadAvatar,
    setCropData,
    setDataForm,
    dataForm,
    keyword
  } = props

  const [image, setImage] = useState("");
  const [cropper, setCropper] = useState<any>();
  const onChange = (e: any) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    reader.readAsDataURL(files[0]);
  };


  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      if(cropper.getCroppedCanvas().toDataURL().length < IMAGE_DEFAULT_LENGTH) {
        setCropData(cropper.getCroppedCanvas().toDataURL());
      setDataForm({ ...dataForm, [keyword]: cropper.getCroppedCanvas().toDataURL() })
      } else {
        errorToast('File to Large');
      }
    }
    setOpenModalUploadAvatar(false);
  };

  const handleCloseEditModal = useCallback(() => {
    setOpenModalUploadAvatar(false);
  }, []);
  
  return (
    <Dialog
      open={openModalUploadAvatar}
      onClose={handleCloseEditModal}
    >
      <DialogTitle className={styles["dialog-title"]}>
        <Typography>{trans.user.attachment_image}</Typography>
        <Button onClick={handleCloseEditModal}>
          <Close />
        </Button>
      </DialogTitle>
      <Box style={{ width: "100%" }}>
        <Box className={styles["box-input"]}>
          <label htmlFor="input-file" className="text-cursor text-decoration font-14">{trans.user.choose_image}</label>
          <input type="file" id="input-file" onChange={onChange} className={styles["input-file"]} />
        </Box>
        <Cropper
          style={{ height: 400, width: 400 }}
          zoomTo={0.5}
          preview=".img-preview"
          src={image}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          autoCropArea={1}
          dragMode='move'
          aspectRatio={1}
          checkOrientation={false}
          onInitialized={(instance) => {
            setCropper(instance);
          }}
          guides={true}
        />
      </Box>
      <DialogActions className={styles["dialog-actions"]}>
        <Button onClick={getCropData} className={styles["button-cropper"]}>
          {trans.user.crop_image}
        </Button>
      </DialogActions>
      <br style={{ clear: "both" }} />
    </Dialog>
  )
}

export default ModalUploadAvatar;
