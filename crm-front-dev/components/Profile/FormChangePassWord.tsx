import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Divider,
  Grid,
} from "@mui/material";
import styles from "./styles.module.scss";
import { Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getFirstValueInObject } from "../../helpers";
import { updatePasswordProfile } from "../../redux/actions/user";
import PasswordDefault from "../Input/PasswordDefault";
import useTrans from "../../utils/useTran";

type DataFormType = {
  oldPassword: string;
  password: string;
  confirm_password: string;
};

const INIT_ERROR = {
  oldPassword: "",
  password: "",
  confirm_password: "",
};

const FormChangePassWord = (props: any) => {
  const trans = useTrans();
  const { errors, openEditModal, setOpenEditModal, updatePasswordProfile } = props;
  const { dataUpdatePasswordProfile } = props.user;

  const INIT_DATA = {
    oldPassword: "",
    password: "",
    confirm_password: "",
  };

  const [dataForm, setDataForm] = useState<DataFormType>(INIT_DATA);
  const [dataError, setDataError] = useState(INIT_ERROR);
  const [showPass, setShowPass] = useState(false);


  const handleChangeInput = (key: any, value: any) => {
    setDataForm({ ...dataForm, [key]: value ?? "" });
  };


  useEffect(() => {
    setDataError({ ...INIT_ERROR, ...errors });
  }, [errors]);

  const handleCloseEditModal = () => {
    setShowPass(false);
    setOpenEditModal(false);
    setDataForm(INIT_DATA);
  };

  const handleSubmitForm = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    updatePasswordProfile(dataForm);
  };

  useEffect(() => {
    if(dataUpdatePasswordProfile){
      handleCloseEditModal();
    }
  }, [dataUpdatePasswordProfile]);

  return (
    <>
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle
          className={styles["dialog-change-password"]}
          id="scroll-dialog-title"
        >
          <Typography variant="h6">{trans.user.change_password}</Typography>
          <Button onClick={handleCloseEditModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <PasswordDefault
                labelText={trans.user.password}
                handleChange={handleChangeInput}
                value={dataForm?.oldPassword ?? null}
                require={true}
                name="oldPassword"
                errorText={getFirstValueInObject(errors?.oldPassword)}
                showPass={showPass}
                setShowPass={setShowPass}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item mt={1} md={12}>
              <PasswordDefault
                labelText={trans.user.new_password}
                name="password"
                showPass={showPass}
                setShowPass={setShowPass}
                require={true}
                value={dataForm?.password ?? null}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(errors?.password)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item mt={1} md={12}>
              <PasswordDefault
                labelText={trans.user.confirm_password}
                name="confirm_password"
                showPass={showPass}
                setShowPass={setShowPass}
                require={true}
                value={dataForm?.confirm_password ?? null}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(errors?.confirm_password)}
              />
            </Grid>
          </Grid>
          <DialogActions className={styles["dialog-actions"]}>
            <Button onClick={handleSubmitForm} className="btn-save">
              {trans.task.save}
            </Button>
            <Button onClick={handleCloseEditModal} className="btn-cancel">
              {trans.task.cancle}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  errors: state.user?.error?.response?.data?.properties ?? {},
});

const mapDispatchToProps = {
  updatePasswordProfile,
};

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(FormChangePassWord);
