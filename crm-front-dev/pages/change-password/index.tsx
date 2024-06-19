import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Box,
  FormGroup,
  TextField,
  Button,
  FormLabel,
} from "@mui/material";
import logo from "../../assets/images/Logo.png";
import styles from "../../styles/Login.module.css";
import { NextPage } from "next";
import {
  userLogin,
  clearData,
  forgotPassword,
  checkResetToken,
  changePasswordWithToken,
} from "../../redux/actions/auth";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import {
  statusCode,
  URL_API_FILE_LOGO,
} from "../../constants";
import { getSystemInfo } from "../../redux/actions/system";

export const INIT_DATA = {
  password: "",
  reset_token: "",
};

const ChangePassword: NextPage = (props: any) => {
  const {
    error,
    dataChangePassword,
  } = props.auth;
  const { dataSystem } = props.system;
  const router = useRouter();
  const {
    getSystemInfo,
    checkResetToken,
    changePasswordWithToken,
  } = props;
  const refPass = useRef<any>("");
  const refConFirmPass = useRef<any>("");
  const [dataForm, setDataForm] = useState<any>(INIT_DATA);
  const [errorsConfirmPass, setErrorsConFirm] = useState<any>();

  const handleLinkFile = (url: any) => {
    return URL_API_FILE_LOGO + url;
  };

  useEffect(() => {
    if (!dataSystem) {
      getSystemInfo();
    }
  }, [dataSystem]);

  useEffect(() => {
    if (router.query.token) {
      setDataForm({
        ...dataForm,
        reset_token: router?.query?.token,
      });
      checkResetToken(`token=${router.query.token}`);
    }
  }, [router.query]);

  useEffect(() => {
    if (error?.response?.status === 500) {
      router.push("/login");
    }
  });

  const getErrorPassWord = (error: any): string => {
    const response = error?.response
    const code = response?.status
    if (code === statusCode.NOT_FOUND) {
      return response?.data?.message
    }

    return response?.data?.properties?.password?.isMinLengthCustom
  };

  useEffect(() => {
    if (refConFirmPass.current.value !== refPass.current.value) {
      setErrorsConFirm("Confirm Password not true");
    } else {
      setErrorsConFirm("");
    }
  }, [refConFirmPass]);

  useEffect(() => {
    if (dataChangePassword) {
      router.push("/login");
    }
  }, [dataChangePassword]);

  const handleForgotPassword = useCallback(async () => {
    if (refPass.current.value !== refConFirmPass.current.value) {
      setErrorsConFirm("Confirm Password not true");
    } else {
      setErrorsConFirm("");
      await changePasswordWithToken({
        reset_token: router.query.token,
        password: refPass.current.value,
      });
    }
  }, [refPass, refConFirmPass, setErrorsConFirm, changePasswordWithToken, router.query.token]);


  return (
    <Box className={styles.wrapContent} sx={{ width: "100%" }}>
      <Box className={styles.wrapLogin} sx={{ width: "500px !important" }}>
        <img
          src={dataSystem?.logo ? handleLinkFile(dataSystem?.logo) : logo?.src}
          alt="Logo"
          className={styles.loginImage}
        />
        <Box className={styles.logContent}>
          <FormGroup>
            <Box className={styles.inputPass}>
              <FormLabel className={styles.inputText}>New Password</FormLabel>
              <TextField
                error={!!getErrorPassWord(error)}
                helperText={getErrorPassWord(error)}
                inputRef={refPass}
                className={styles.loginInput}
                id="outlined-basic"
                variant="outlined"
                type="password"
              />
            </Box>

            <Box className={styles.inputPass}>
              <FormLabel className={styles.inputText}>
                Confirm Password
              </FormLabel>
              <TextField
                error={!!errorsConfirmPass}
                helperText={errorsConfirmPass}
                inputRef={refConFirmPass}
                className={styles.loginInput}
                id="outlined-basic"
                variant="outlined"
                type="password"
              />
            </Box>
            <Button
                sx={{ marginTop: "20px" }}
                variant="contained"
                onClick={handleForgotPassword}
              >
                Change Password
              </Button>
          </FormGroup>
        </Box>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  auth: state.auth,
  system: state.system,
});

const mapDispatchToProps = {
  userLogin,
  clearData,
  getSystemInfo,
  forgotPassword,
  checkResetToken,
  changePasswordWithToken,
};
export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
