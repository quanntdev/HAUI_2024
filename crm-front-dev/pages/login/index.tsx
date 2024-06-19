import React, { useCallback, useEffect, useRef } from "react";
import { Box, FormGroup, Checkbox, TextField, Button, FormLabel } from "@mui/material";
import logo from '../../assets/images/Logo.png';
import styles from '../../styles/Login.module.css'
import { NextPage } from "next";
import { userLogin, clearData } from '../../redux/actions/auth';
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { statusCode, URL_API_FILE_LOGO } from "../../constants";
import { getSystemInfo } from "../../redux/actions/system";

const Login: NextPage = (props: any) => {
  const { dataLogin, error } = props.auth;
  const { dataSystem } = props.system;
  const router = useRouter();
  const { userLogin, getSystemInfo, clearData } = props
  const refEmail = useRef<any>('')
  const refPass = useRef<any>('')
  const refRemember = useRef<any>('')

  useEffect(() => {
    if (dataLogin && localStorage.getItem('access_token')) {
      router.push('/')
    }
    clearData("dataForgotPassword")
  }, [dataLogin, router])

  const handleLinkFile = (url:any) => {
    return URL_API_FILE_LOGO + url;
  };

  useEffect(() => {
    if(!dataSystem) {
      getSystemInfo();
    }
  }, [dataSystem])

  const getErrorEmail = (error: any): string => {
    const response = error?.response
    const code = response?.status
    if (code === statusCode.NOT_FOUND) {
      return response?.data?.message
    }

    return response?.data?.properties?.email?.isEmail
  }

  const getErrorPassWord = (error: any): string => {
    const response = error?.response
    const code = response?.status
    if (code === statusCode.BAD_REQUEST && !response?.data?.properties?.email?.isEmail) {
      return response?.data?.message
    }
    return ''
  }

  const handleLogin = useCallback(async () => {
    await userLogin(refEmail.current.value, refPass.current.value, +refRemember.current.value);
  }, [userLogin, refEmail, refPass, refRemember]);


  const handleLoginWithSSO = useCallback(() => {
    window.location.href = `${process.env.NEXT_PUBLIC_SSO_ADDRESS}/login?clientId=${process.env.NEXT_PUBLIC_CLIENT_ID}&urlRedirect=${process.env.NEXT_PUBLIC_URL_REDIRECT}`;
  }, []);

  const handleShowForgot = () => {
    router.push("/forgot-password");
  }

  return (
    <Box className={styles.wrapContent}>
      <Box className={styles.wrapLogin}>
        <img
          src={dataSystem?.logo ? handleLinkFile(dataSystem?.logo) : logo?.src}
          alt="Logo"
          className={styles.loginImage}
        />
        <Box className={styles.logContent}>
          <FormGroup>
            <Box>
              <FormLabel className={styles.inputText}>Email</FormLabel>
              <TextField
                error={!!getErrorEmail(error)}
                helperText={getErrorEmail(error)}
                inputRef={refEmail}
                className={styles.loginInput}
                id="outlined-basic"
                variant="outlined"
                type="text"
              />
            </Box>
            <Box className={styles.inputPass}>
              <FormLabel className={styles.inputText}>Password</FormLabel>
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
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box className={styles.remember}>
                <Checkbox
                  inputRef={refRemember}
                  id="checkbox"
                  sx={{
                    width: 15,
                  }}
                />
                <FormLabel className={styles.rememberText}>
                  Remember password.
                </FormLabel>
              </Box>
              <Box
                sx={{
                  fontSize: "14px",
                  lineHeight: "13px",
                  marginTop: "19px",
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                <span onClick={handleShowForgot}>Forgot password</span>
              </Box>
            </Box>
            <Button variant="contained" onClick={handleLogin}>
              Login
            </Button>
          </FormGroup>
        </Box>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  auth: state.auth,
  system: state.system
});

const mapDispatchToProps = { userLogin, clearData, getSystemInfo };
export default connect(mapStateToProps, mapDispatchToProps)(Login);
