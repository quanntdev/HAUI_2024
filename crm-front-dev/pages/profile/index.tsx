import { Box, Button, Card, Grid } from "@mui/material";
import Breadcrumb from "../../components/Breadcumb";
import DatePickerDefault from "../../components/Input/DatePickerDefault";
import InputBase from "../../components/Input/InputBase";
import SelectDefault from "../../components/Input/SelectDefault";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { getDetailProfile } from "../../redux/actions/profile";
import { clearData, updateUserProfile } from "../../redux/actions/user";
import FormChangePassWord from "../../components/Profile/FormChangePassWord";
import { genders } from "../../constants";
import ImageCropper from "../../components/ImageCropper";
import { getFirstValueInObject } from "../../helpers";
import getLinkAvatar from "../../utility/getLinkAvatar";
import useTrans from "../../utils/useTran";

const INIT_DATA_UPDATE = {
  email: "",
  first_name: "",
  last_name: "",
  gender: null,
  phone: "",
  address: "",
  birth_of_date: "",
  profileImg: null,
};

const INIT_ERROR = {
  email: "",
  first_name: "",
  last_name: "",
  gender: "",
  phone: "",
  address: "",
  birth_of_date: "",
};

const Profile: NextPage = (props: any) => {
  const trans = useTrans();
  const { getDetailProfile, updateUserProfile, errors } = props;
  const { dataDetailProfile, dataUpdateProfile } = props.profile;
  const { dataUpdateUserProfile } = props.user;

  const [dataForm, setDataForm] = useState<any>(INIT_DATA_UPDATE);
  const [dataError, setDataError] = useState<any>(INIT_ERROR);
  const [openFormModal, setOpenFormModal] = useState<boolean>(false);
  const [cropData, setCropData] = useState(null);

  const handleOpenForm = (action: boolean) => {
    setOpenFormModal(action);
  };

  const handleChangeInput = (key: any, value: any) => {
    setDataForm({ ...dataForm, [key]: value ?? "" });
  };

  const handleChangeSelect = (key: any, value: any) => {
    setDataForm({ ...dataForm, [key]: Number(value) });
  };

  useEffect(() => {
    getDetailProfile();
  }, [dataUpdateUserProfile, dataUpdateProfile]);

  useEffect(() => {
    setDataForm({
      ...dataForm,
      email: dataDetailProfile?.email ?? "",
      phone: dataDetailProfile?.profile?.phone ?? "",
      address: dataDetailProfile?.profile?.address ?? "",
      last_name: dataDetailProfile?.profile?.last_name ?? "",
      first_name: dataDetailProfile?.profile?.first_name ?? "",
      gender: Number(dataDetailProfile?.profile?.gender) ?? "",
      birth_of_date: dataDetailProfile?.profile?.birth_of_date ?? null,
    });
  }, [dataDetailProfile]);

  const handleFormDataToUpdate = (newData: any) => {
    const formData = new FormData();
    Object.keys(newData).forEach((key) => {
      if (key === "profileImg") {
        formData.append(key, newData[key], "profile_img1.png");
      } else {
        formData.append(key, newData[key]);
      }
    });
    updateUserProfile(formData);
    setCropData(null);
  };
  useEffect(() => {
    setDataError({ ...INIT_ERROR, ...errors });
  }, [errors]);
  const handleUpdateProfile = async () => {
    if (
      !!dataForm?.profileImg &&
      dataForm?.profileImg !== dataDetailProfile?.profile?.profileImg
    ) {

      const image = await fetch(dataForm?.profileImg);
      const blob = await image.blob();
      const newData = { ...dataForm, profileImg: blob };
      handleFormDataToUpdate(newData);
    } else if (
      dataForm?.email !== dataDetailProfile?.email ||
      dataForm?.phone !== dataDetailProfile?.profile?.phone ||
      dataForm?.address !== dataDetailProfile?.profile?.address ||
      dataForm?.last_name !== dataDetailProfile?.profile?.last_name ||
      dataForm?.first_name !== dataDetailProfile?.profile?.first_name ||
      dataForm?.gender !== Number(dataDetailProfile?.profile?.gender) ||
      dataForm?.birth_of_date !== dataDetailProfile?.profile?.birth_of_date
    ) {
      const { profileImg, ...newData } = dataForm;
      handleFormDataToUpdate(newData);
    }
  };


  return (
    <>
      <Breadcrumb title={trans.task.settings} />
      <Card sx={{ marginTop: 2, padding: 2 }}>
        <Grid container>
          <Grid item xs={12} md sx={{ padding: 5, textAlign: "center" }}>
            <Box sx={{ height: 350 }}>
              <ImageCropper
                profileImg={getLinkAvatar(dataDetailProfile?.profile?.profileImg)}
                dataForm={dataForm}
                setDataForm={setDataForm}
                cropData={cropData}
                setCropData={setCropData}
                keyword = 'profileImg'
              />
            </Box>
          </Grid>
          <Grid container xs mt={5}>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <InputBase
                  value={dataForm?.first_name}
                  keyword="first_name"
                  labelText={trans.user.first_name}
                  handleChange={handleChangeInput}
                  require={true}
                  errorText={getFirstValueInObject(dataError?.first_name)}
                />
              </Grid>
              <Grid item md={6}>
                <InputBase
                  value={dataForm?.last_name}
                  keyword="last_name"
                  labelText={trans.user.last_name}
                  handleChange={handleChangeInput}
                  require={true}
                  errorText={getFirstValueInObject(dataError?.last_name)}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <SelectDefault
                  require={true}
                  handleChange={handleChangeSelect}
                  keyword="gender"
                  value={dataForm?.gender}
                  keyMenuItem="id"
                  keyValue="name"
                  data={genders}
                  labelText={trans.contact.gender}
                  errorText={getFirstValueInObject(dataError?.gender)}
                />
              </Grid>
              <Grid item md={6}>
                <DatePickerDefault
                  keyword="birth_of_date"
                  value={dataForm?.birth_of_date}
                  labelText={trans.user.date_of_birth}
                  handleChange={handleChangeInput}
                  errorText={getFirstValueInObject(dataError?.birth_of_date)}
                />
              </Grid>
            </Grid>
            <Grid item md={12}>
              <InputBase
                value={dataForm?.email}
                labelText="Email"
                keyword={trans.contact.email}
                handleChange={handleChangeInput}
                disabled={dataDetailProfile?.role == 1 ? false : true}
                errorText={getFirstValueInObject(dataError?.email)}
              />
            </Grid>
            <Grid item xs={12}>
              <InputBase
                value={dataForm?.phone ?? ""}
                labelText={trans.contact.phone_number}
                keyword="phone"
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.phone)}
              />
            </Grid>
            <Grid item xs={12}>
              <InputBase
                value={dataForm?.address ?? ""}
                labelText={trans.customer_detail.address}
                keyword="address"
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.address)}
              />
            </Grid>
            <Grid item xs={12} className="mt-8 text-align-center">
              <Button
                onClick={() => handleOpenForm(true)}
                className="btn_create mr-8"
                sx={{ marginTop: 1 }}
              >
                {trans.user.change_password}
              </Button>
              <Button
                className="btn_create ml-8"
                sx={{ marginTop: 1 }}
                onClick={handleUpdateProfile}
              >
                {trans.task.save}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Card>
      <FormChangePassWord
        openEditModal={openFormModal}
        setOpenEditModal={setOpenFormModal}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  profile: state.profile,
  user: state.user,
  errors: state.profile?.error?.response?.data?.properties ?? {},
});

const mapDispatchToProps = {
  getDetailProfile,
  updateUserProfile,
  clearData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
