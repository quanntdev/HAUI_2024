import React, { useState } from "react";
import "cropperjs/dist/cropper.css";
import { Box, Avatar } from "@mui/material";

import styles from "./styles.module.scss";
import ModalUploadAvatar from "./ModalUploadAvatar";

const ImageCropper = (props: any) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = (event: any) => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  
  const {
    profileImg,
    dataForm,
    setDataForm,
    setCropData,
    cropData,
    keyword = "profileImg",
  } = props;

  const [openModalUploadAvatar, setOpenModalUploadAvatar] =
    useState<boolean>(false);

  const openModleUploadAvatar = () => {
    setOpenModalUploadAvatar(true);
  };

  const handleRemoveAvatar = () => {
    setCropData(null);
    setDataForm({ ...dataForm, [keyword]: profileImg });
  };
  return (
    <div>
      <Box>
        <Box>
          {!cropData ? (
            <Avatar
              alt="avatar"
              src={profileImg ?? null}
              className={
                keyword === "avatar"
                  ? styles["avatar-contact"]
                  : styles["avatar-default"]
              }
              onClick={openModleUploadAvatar}
            />
          ) : (
            <span
              onClick={handleRemoveAvatar}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ position: "relative", display: "inline-block" }}
            >
              <Avatar
                className={
                  keyword === "avatar"
                    ? styles["avatar-contact"]
                    : styles["avatar-default"]
                }
                src={cropData}
                alt="cropped"
                style={{ opacity: isHovered ? 0.4 : 1 }}
              />
              {isHovered && (
                <small
                  style={{
                    position: "fixed",
                    transform: "translate(-50%, -100%)",
                    color: "red",
                    pointerEvents: "none",
                  }}
                ></small>
              )}
            </span>
          )}
        </Box>
      </Box>

      <ModalUploadAvatar
        openModalUploadAvatar={openModalUploadAvatar}
        setOpenModalUploadAvatar={setOpenModalUploadAvatar}
        cropData={cropData}
        setCropData={setCropData}
        setDataForm={setDataForm}
        dataForm={dataForm}
        keyword={keyword}
      />
    </div>
  );
};

export default ImageCropper;
