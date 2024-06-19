import {
  Avatar,
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  ListItemIcon,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import type { NextPage } from "next";
import styles from "./styles.module.scss";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import {
  getDetailContact,
  clearData,
  updateContact,
  UpdateCardImage,
  UploadAvatarContact,
  deleteContact,
} from "../../redux/actions/contact";
import Breadcrumb from "../../components/Breadcumb";
import Link from "next/link";
import {
  statusCode,
  URL_API_CONTACT_AVATAR,
  URL_API_IMAGE_VISIT,
} from "../../constants";
import { Close } from "@mui/icons-material";
import FormCreateOrUpdateContact from "../../components/Contact/FormCreateOrUpdateContact";
import InputTiny from "../../components/Input/InputTiny";
import { IconAddressBook } from "@tabler/icons";
import HeadMeta from "../../components/HeadMeta";
import ImageCropper from "../../components/ImageCropper";
import ModalUploadAvatar from "../../components/ImageCropper/ModalUploadAvatar";
import ModalDelete from "../../components/Modal/ModalDelete";
import LogNote from "../../components/LogNote";
import useTrans from "../../utils/useTran";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";

const INIT_DATA = {
  firstName: "",
  lastName: "",
  email: "",
  gender: "",
  phone: "",
  description: "",
  avatar: "",
};

const INIT_ERROR = {
  firstName: "",
  lastName: "",
  email: "",
  gender: "",
  phone: "",
  description: "",
  avatar: "",
};

interface InitData {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone: string;
  description: string;
  avatar: string;
}

const ContactDetail: NextPage = (props: any) => {
  const trans = useTrans();

  const {
    getDetailContact,
    clearData,
    errors,
    UpdateCardImage,
    UploadAvatarContact,
    deleteContact,
  } = props;

  const {
    dataContactDetail,
    dataUpdateContact,
    dataDeleteContact,
    dataListTask,
    dataUpdateCard,
    error,
    dataUpdateContactAvatart,
    dataLogNote,
  } = props.contact;

  const { dataDetailProfile } = props?.profile;
  const router = useRouter();
  const q: any = useMemo(() => router.query, [router]);
  const id = q?.id || "";
  const [initForm, setInitForm] = useState<InitData>(INIT_DATA);
  const [contactId, setContactId] = useState<number>();
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [cropData, setCropData] = useState(null);
  const [openModalUploadAvatar, setOpenModalUploadAvatar] =
    useState<boolean>(false);

  const editDescriptionButton = false;

  const [isLoggedInUserId, setIsLoggedInUserId] = useState<any>();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (dataContactDetail) {
      setInitForm({
        ...INIT_DATA,
        ...dataContactDetail,
      });
    }
  }, [dataContactDetail, editDescriptionButton]);

  useEffect(() => {
    if (dataListTask) {
      getDetailContact(dataListTask?.id);
    }
    if (dataUpdateCard) {
      getDetailContact(id);
    }
  }, [dataListTask, dataUpdateCard]);

  const [cardVisit, setCardVisit] = useState<any>("");
  const [cardVisitValue, setCardVisitValue] = useState<any>();
  const [values, setValues] = useState<any>();
  useEffect(() => {
    if (dataContactDetail) {
      setValues(dataContactDetail?.cardImage);
    }
  }, [dataContactDetail]);

  const handlePreviewCardVisit = (e: any) => {
    setCardVisitValue(e.target.files[0]);
    const file = e.target.files[0];
    file.preview = URL.createObjectURL(file);
    setCardVisit(file);
    e.target.value = null;
  };
  const handleDeleteImage = () => {
    setCardVisit("");
  };
  const handleSaveCard = async () => {
    const newData: any = { cardImage: cardVisitValue };
    const formData = new FormData();
    Object.keys(newData).forEach((key) => {
      formData.append(key, newData[key]);
    });
    UpdateCardImage(id, formData);
    setCardVisit("");
  };

  const handleLinkAvatar = () => {
    return URL_API_IMAGE_VISIT + values;
  };

  const handleContactAvatar = (link: any) => {
    return URL_API_CONTACT_AVATAR + link;
  };

  useEffect(() => {
    clearData("dataContactDetail");
    if (id) {
      if (/^-?\d+$/.test(id)) getDetailContact(id);
      else router.push("/404");
    }
  }, [id]);

  useEffect(() => {
    if (error === 404) {
      router.push("/404");
      clearData("error");
    }
  }, [error]);

  useEffect(() => {
    if (
      dataUpdateContact ||
      dataUpdateContactAvatart ||
      localStorage.getItem("languages")
    ) {
      clearData("dataUpdateContact");
      setOpenEditModal(false);
      getDetailContact(id);
    }
  }, [
    dataUpdateContact,
    dataUpdateContactAvatart,
    localStorage.getItem("languages"),
  ]);

  const handleChangeInput = (key: any, value: any) => {
    setInitForm({
      ...initForm,
      [key]: value ?? "",
    });
  };

  const handleModalDeleteContact = useCallback(() => {
    deleteContact(id);
  }, [deleteContact, id]);

  const handleEditContact = useCallback(
    (action: boolean, contactId: any) => {
      setOpenEditModal(true);
      setContactId(contactId);
    },
    [setOpenEditModal, setContactId]
  );

  useEffect(() => {
    if (dataDeleteContact && !openDeleteModal) {
      router.push(`/contact`);
    }
  }, [dataDeleteContact, openDeleteModal]);

  useEffect(() => {
    if (dataDeleteContact) {
      clearData("dataDeleteContact");
    }
  }, [dataDeleteContact]);

  useEffect(() => {
    if (errors != undefined && errors?.statusCode == statusCode.NOT_FOUND)
      router.push("/404");
  }, [errors]);

  const handleFormDataToUpdate = (newData: any) => {
    const formData = new FormData();
    Object.keys(newData).forEach((key) => {
      formData.append(key, newData[key], "profile_img1.png");
    });
    UploadAvatarContact(id, formData);
    setCropData(null);
  };

  const handleUploadAttachment = useCallback(async () => {
    if (cropData) {
      const image = await fetch(cropData);
      const blob = await image.blob();
      const newData: any = { avatar: blob };
      handleFormDataToUpdate(newData);
    }
  }, [cropData, handleFormDataToUpdate]);

  const handleDeleteContact = useCallback(() => {
    setOpenDeleteModal(true);
  }, []);

  useEffect(() => {
    setIsLoggedInUserId(dataDetailProfile?.id);
  }, [dataDetailProfile?.id]);

  const handleClick = useCallback((event: any) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      <div>
        <HeadMeta
          title={trans.menu.contact}
          param={
            dataContactDetail?.firstName + " " + dataContactDetail?.lastName
          }
        />
        <Breadcrumb
          prevPage={trans.menu.contact}
          title={
            dataContactDetail?.firstName + " " + dataContactDetail?.lastName
          }
          icon={<IconAddressBook className={styles["icons"]} />}
        />

        <Box sx={{ marginLeft: "98%", paddingTop: "10px" }}>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            sx={{ marginLeft: -5, borderRadius: 10 }}
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => handleEditContact(true, dataContactDetail?.id)}
            >
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <Typography variant="inherit">EDIT</Typography>
            </MenuItem>

            <MenuItem sx={{ color: "#e74c3c" }} onClick={handleDeleteContact}>
              <ListItemIcon sx={{ color: "#e74c3c" }}>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit" noWrap>
                DELETE
              </Typography>
            </MenuItem>
          </Menu>
        </Box>

        <Box>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              <Box
                sx={{
                  padding: "20px",
                  borderRadius: "12px",
                  backgroundColor: "white",
                  height: "400px",
                  marginTop: 3,
                }}
              >
                <Typography
                  sx={{
                    padding: "2px",
                    fontWeight: "700",
                    paddingLeft: "10px",
                    borderRadius: "5px",
                    paddingBottom: "12px",
                    paddingTop: "12px",
                    background:
                      "linear-gradient(93deg, rgba(232,232,232,1) 0%, rgba(245,240,240,0.41208202030812324) 43%, rgba(255,255,255,1) 100%)",
                  }}
                >
                  {trans.contact.name_occupation}
                </Typography>

                <Box sx={{ display: "flex", marginTop: 5 }}>
                  <Box sx={{ width: "20%" }} className={styles["profile-img"]}>
                    <Box sx={{ height: 120 }}>
                      <ImageCropper
                        profileImg={handleContactAvatar(
                          dataContactDetail?.avatar
                            ? dataContactDetail?.avatar
                            : ""
                        )}
                        dataForm={initForm}
                        setDataForm={setInitForm}
                        cropData={cropData}
                        setCropData={setCropData}
                        keyword="avatar"
                      />
                    </Box>

                    {cropData && (
                      <Button
                        sx={{ marginLeft: "25px", marginTop: "15px" }}
                        variant="contained"
                        component="label"
                        onClick={handleUploadAttachment}
                      >
                        {trans.task.save}
                      </Button>
                    )}
                  </Box>

                  <Box sx={{ width: "80%" }}>
                    <Box>
                      <Box>
                        <span
                          style={{
                            color: "gray",
                            display: "inline-block",
                            width: "200px",
                          }}
                        >
                          {" "}
                          {trans.contact.gender}
                        </span>
                        <span>
                          {(() => {
                            if (dataContactDetail?.gender == 1) {
                              return trans.contact.male;
                            } else if (dataContactDetail?.gender == 0) {
                              return trans.contact.female;
                            } else {
                              return "";
                            }
                          })()}
                        </span>
                      </Box>

                      <Box sx={{ marginTop: 2 }}>
                        <span
                          style={{
                            color: "gray",
                            display: "inline-block",
                            width: "200px",
                          }}
                        >
                          {" "}
                          {trans.contact.phone}
                        </span>
                        <span>
                          {dataContactDetail && dataContactDetail?.phone}
                        </span>
                      </Box>

                      <Box sx={{ marginTop: 2 }}>
                        <span
                          style={{
                            color: "gray",
                            display: "inline-block",
                            width: "200px",
                          }}
                        >
                          {trans.contact.email}
                        </span>
                        <span>
                          {dataContactDetail && dataContactDetail?.email}
                        </span>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box
                sx={{
                  padding: "20px",
                  borderRadius: "12px",
                  backgroundColor: "white",
                  height: "400px",
                  marginTop: 3,
                }}
              >
                <Grid>
                  <Box>
                    <Typography
                      sx={{
                        padding: "2px",
                        fontWeight: "700",
                        paddingLeft: "10px",
                        borderRadius: "5px",
                        paddingBottom: "12px",
                        paddingTop: "12px",
                        background:
                          "linear-gradient(93deg, rgba(232,232,232,1) 0%, rgba(245,240,240,0.41208202030812324) 43%, rgba(255,255,255,1) 100%)",
                      }}
                    >
                      {trans.contact.customer_details}
                    </Typography>
                  </Box>
                </Grid>

                <Box sx={{ marginTop: 5 }}>
                  <Box>
                    <span
                      style={{
                        color: "gray",
                        display: "inline-block",
                        width: "200px",
                      }}
                    >
                      {trans.menu.customer}
                    </span>
                    <span>
                      {dataContactDetail && (
                        <Link
                          href={`/customer/${dataContactDetail?.customer?.id}`}
                        >
                          <a className="text-cursor">
                            {dataContactDetail?.customer?.name}
                          </a>
                        </Link>
                      )}
                    </span>
                  </Box>

                  <Box sx={{ marginTop: 2 }}>
                    <span
                      style={{
                        color: "gray",
                        display: "inline-block",
                        width: "200px",
                      }}
                    >
                      {trans.contact._position}
                    </span>
                    <span>
                      {dataContactDetail && dataContactDetail?.sector}
                    </span>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box
                sx={{
                  padding: "20px",
                  borderRadius: "12px",
                  backgroundColor: "white",
                  height: "400px",
                  marginTop: 3,
                }}
              >
                <Typography
                  sx={{
                    padding: "2px",
                    fontWeight: "700",
                    paddingLeft: "10px",
                    borderRadius: "5px",
                    paddingBottom: "12px",
                    paddingTop: "12px",
                    background:
                      "linear-gradient(93deg, rgba(232,232,232,1) 0%, rgba(245,240,240,0.41208202030812324) 43%, rgba(255,255,255,1) 100%)",
                  }}
                >
                  {trans.contact.description_information}
                </Typography>

                <Box sx={{ marginTop: "10px" }}>
                  {!editDescriptionButton ? (
                    <Typography>
                      <span
                        className={"description-img"}
                        dangerouslySetInnerHTML={{
                          __html: dataContactDetail?.description,
                        }}
                      />
                    </Typography>
                  ) : (
                    <InputTiny
                      handleChange={handleChangeInput}
                      keyword="description"
                      value={initForm?.description}
                      object={dataContactDetail}
                      objectName={"contacts"}
                      isLoggedInUserId={isLoggedInUserId}
                      onEdit={true}
                    />
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box
                sx={{
                  padding: "20px",
                  borderRadius: "12px",
                  backgroundColor: "white",
                  height: "400px",
                  marginTop: 3,
                }}
              >
                <Typography
                  sx={{
                    padding: "2px",
                    fontWeight: "700",
                    paddingLeft: "10px",
                    borderRadius: "5px",
                    paddingBottom: "12px",
                    paddingTop: "12px",
                    background:
                      "linear-gradient(93deg, rgba(232,232,232,1) 0%, rgba(245,240,240,0.41208202030812324) 43%, rgba(255,255,255,1) 100%)",
                  }}
                >
                  {trans.contact.card_visit}
                  <IconButton
                    aria-label="edit"
                    component="label"
                    sx={{ padding: 0, marginLeft: "20px" }}
                  >
                    <input
                      hidden
                      type="file"
                      accept="image/png, image/jpg, image/jpeg"
                      onChange={(e) => handlePreviewCardVisit(e)}
                    />
                    <EditIcon className={styles["edit-icon"]} />
                  </IconButton>
                </Typography>

                <Box>
                  <Button
                    disableRipple={true}
                    className={styles["box-button"]}
                    onClick={handleDeleteImage}
                  >
                    {cardVisit?.preview === undefined ? "" : <Close />}
                  </Button>
                  <Box className={styles["image-upload"]}>
                    <Avatar
                      sx={{
                        height: "200px",
                        width: "100%",
                        borderRadius: 0,
                      }}
                      src={
                        cardVisit?.preview !== undefined
                          ? cardVisit?.preview
                          : handleLinkAvatar()
                      }
                      alt="Picture of the author"
                      className={styles["avatar-default"]}
                    />
                    {cardVisit?.preview === undefined ? (
                      ""
                    ) : (
                      <Button
                        sx={{
                          marginLeft: "355px",
                          marginTop: "10px",
                        }}
                        onClick={handleSaveCard}
                        variant="contained"
                        component="label"
                      >
                        Save
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ marginTop: 5 }}>
          <LogNote
            isLoggedInUserId={isLoggedInUserId}
            title={trans.home.activity}
            object={dataContactDetail}
            logNotes={dataLogNote}
            objectName="contacts"
            getObject={getDetailContact}
          />
        </Box>

        <FormCreateOrUpdateContact
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          id={contactId}
        />
        <ModalDelete
          openModal={openDeleteModal}
          setOpenModal={setOpenDeleteModal}
          action={handleModalDeleteContact}
          title={trans.contact.you_re_about_to_delete_your_contact}
          content={
            trans.contact
              .this_contact_will_be_permenently_removed_and_you_won_t_be_able_to_see_them_again_
          }
        />
        <ModalUploadAvatar
          openModalUploadAvatar={openModalUploadAvatar}
          setOpenModalUploadAvatar={setOpenModalUploadAvatar}
          cropData={cropData}
          setCropData={setCropData}
          setDataForm={setInitForm}
          dataForm={initForm}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  contact: state.contact,
  profile: state?.profile,
  errors: state.contact?.error?.response?.data,
});

const mapDispatchToProps = {
  getDetailContact,
  updateContact,
  deleteContact,
  clearData,
  UpdateCardImage,
  UploadAvatarContact,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactDetail);
