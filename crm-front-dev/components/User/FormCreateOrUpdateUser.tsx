import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import styles from "./styles.module.scss";
import { Close } from "@mui/icons-material";
import { connect, useDispatch } from "react-redux";
import { genders, userRoles } from "../../constants";
import InputBase from "../Input/InputBase";
import SelectDefault from "../Input/SelectDefault";
import DatePickerDefault from "../Input/DatePickerDefault";
import { createUser, clearData, updateUser } from "../../redux/actions/user";
import { useEffect, useState } from "react";
import PasswordDefault from "../Input/PasswordDefault";
import { getFirstValueInObject } from "../../helpers";
import { useRouter } from "next/router";
import useTrans from "../../utils/useTran";

const FormCreateOrUpdateUser = (props: any) => {
  const trans = useTrans();
  const {
    openModal,
    setOpenModal,
    errors,
    dataCreateUser,
    user,
    dataUpdateUser,
  } = props;
  const initData = {
    email: user?.email ?? "",
    first_name: user?.profile?.first_name ?? "",
    last_name: user?.profile?.last_name ?? "",
    gender: user?.profile?.gender ?? "",
    phone: user?.profile?.phone ?? null,
    address: user?.profile?.address ?? "",
    role: user?.role ?? "",
    date_of_joining: user?.profile?.date_of_joining ?? null,
    birth_of_date: user?.profile?.birth_of_date ?? null,
  };
  const [dataForm, setDataForm] = useState<any>(initData);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    setDataForm({
      ...initData,
    });
  }, [user]);

  const handleChangeInput = (key: any, value: any) => {
    if (key === "phone" && value.length === 0) {
      delete dataForm["phone"];
      return setDataForm({ ...dataForm });
    }
    if (key === "password" && value.length === 0) {
      delete dataForm["password"];
      return setDataForm({ ...dataForm });
    }
    if (key === "confirm_password" && value.length === 0) {
      delete dataForm["confirm_password"];
      return setDataForm({ ...dataForm });
    }
    setDataForm({ ...dataForm, [key]: value ?? "" });
  };

  const handleCloseModal = () => {
    setShowPass(false);
    setOpenModal(false);
    setDataForm(initData);
    // @ts-ignore
    dispatch(clearData("dataCreateUser"));
    // @ts-ignore
    dispatch(clearData("dataUpdateUser"));
  };

  const handleCreateUser = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // @ts-ignore
    dispatch(createUser(dataForm));
  };

  const handleUpdateUser = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const gender = dataForm?.gender ? 1 : 0;
    // @ts-ignore
    dispatch(updateUser({ ...dataForm, gender }, user?.id));
  };

  useEffect(() => {
    if (dataUpdateUser || dataCreateUser) {
      handleCloseModal();
    }
  }, [dataUpdateUser, dataCreateUser]);

  useEffect(() => {
    if (dataCreateUser) {
      router.push(router.route);
    }
  }, [dataCreateUser]);

  function genderValue(user: any, dataForm: any) {
    if (user) {
      if (dataForm && dataForm.gender) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return "";
    }
  }

  return (
    <>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        className="dialog-edit"
        classes={{
          container: "form-dialog-container",
          paper: "form-dialog-paper",
        }}
      >
        <DialogTitle
          className={styles["dialog-title"]}
          id="scroll-dialog-title"
        >
          <Typography variant="h6">
            {user ? trans.user.edit_user : trans.user.add_user}
          </Typography>
          <Button onClick={handleCloseModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box className={styles["box-title"]}>
            <Typography>{trans.contact.name_occupation}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <InputBase
                require={true}
                labelText={trans.user.first_name}
                handleChange={handleChangeInput}
                placeholder={trans.user.first_name}
                value={dataForm?.first_name ?? ""}
                keyword="first_name"
                errorText={getFirstValueInObject(errors?.first_name)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <InputBase
                require={true}
                labelText={trans.user.last_name}
                type="text"
                handleChange={handleChangeInput}
                placeholder={trans.user.last_name}
                value={dataForm?.last_name ?? null}
                keyword="last_name"
                errorText={getFirstValueInObject(errors?.last_name)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <SelectDefault
                require={true}
                handleChange={handleChangeInput}
                keyword="gender"
                value={!!user ? genderValue(user, dataForm) : dataForm?.gender}
                // value={dataForm?.gender ?? ""}
                keyMenuItem="id"
                keyValue="name"
                data={genders}
                labelText={trans.contact.gender}
                errorText={getFirstValueInObject(errors?.gender)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <SelectDefault
                require={true}
                handleChange={handleChangeInput}
                value={dataForm?.role ?? ""}
                data={userRoles}
                keyword="role"
                labelText={trans.contact._position}
                keyMenuItem="key"
                keyValue="value"
                errorText={getFirstValueInObject(errors?.role)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={-1}>
            <Grid item md={6} mt={2}>
              <PasswordDefault
                labelText={trans.user.password}
                handleChange={handleChangeInput}
                value={dataForm?.password ?? null}
                name="password"
                errorText={getFirstValueInObject(errors?.password)}
                showPass={showPass}
                setShowPass={setShowPass}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <PasswordDefault
                labelText={trans.user.confirm_password}
                handleChange={handleChangeInput}
                value={dataForm?.confirm_password ?? null}
                name="confirm_password"
                errorText={getFirstValueInObject(errors?.confirm_password)}
                showPass={showPass}
                setShowPass={setShowPass}
              />
            </Grid>
          </Grid>
          <Box className={styles["box-title"]}>
            <Typography>{trans.user.contact_details}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <InputBase
                require={true}
                labelText={trans.contact.email}
                type="text"
                handleChange={handleChangeInput}
                placeholder={trans.contact.email}
                value={dataForm?.email}
                keyword="email"
                errorText={getFirstValueInObject(errors?.email)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <InputBase
                labelText={trans.contact.phone}
                type="text"
                handleChange={handleChangeInput}
                placeholder={trans.contact.phone}
                value={dataForm?.phone}
                keyword="phone"
                errorText={getFirstValueInObject(errors?.phone)}
              />
            </Grid>
          </Grid>
          <Grid item md={6} mt={2}>
            <InputBase
              labelText={trans.customer_detail.address}
              type="text"
              handleChange={handleChangeInput}
              placeholder={trans.customer_detail.address}
              value={dataForm?.address}
              keyword="address"
              errorText={getFirstValueInObject(errors?.address)}
            />
          </Grid>
          <Box className={styles["box-title"]}>
            <Typography>{trans.user.dates_to_remember}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <DatePickerDefault
                labelText={trans.user.join_time}
                handleChange={handleChangeInput}
                value={dataForm?.date_of_joining}
                keyword="date_of_joining"
                errorText={getFirstValueInObject(errors?.date_of_joining)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <DatePickerDefault
                labelText={trans.user.date_of_birth}
                disableFuture={true}
                handleChange={handleChangeInput}
                value={dataForm?.birth_of_date}
                keyword="birth_of_date"
                errorText={getFirstValueInObject(errors?.birth_of_date)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={styles["dialog-actions"]}>
          <Button
            className="btn-save"
            onClick={user ? handleUpdateUser : handleCreateUser}
          >
            {trans.task.save}
          </Button>
          <Button onClick={handleCloseModal} className="btn-cancel">
            {trans.task.cancle}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  errors: state.user?.error?.response?.data?.properties ?? {},
  dataCreateUser: state.user?.dataCreateUser,
  dataUpdateUser: state.user?.dataUpdateUser,
});

const mapDispatchToProps = {
  createUser,
  clearData,
  updateUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormCreateOrUpdateUser);
