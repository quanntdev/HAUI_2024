import React, { useCallback, useRef, useEffect } from "react";
import { Box, FormGroup, TextField, Button, FormLabel } from "@mui/material";
import logo from '../../assets/images/Logo.png';
import styles from '../../styles/Login.module.css'
import { NextPage } from "next";
import { userLogin, clearData, forgotPassword } from '../../redux/actions/auth';
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { statusCode, URL_API_FILE_LOGO } from "../../constants";
import { getSystemInfo } from "../../redux/actions/system";
import CircularProgress from '@mui/material/CircularProgress';



const Login: NextPage = (props: any) => {
  const { dataForgotPassword, error, loadingEmail } = props.auth;
  const { dataSystem } = props.system;
  const router = useRouter();
  const { getSystemInfo, forgotPassword } = props
  const refEmail = useRef<any>('')

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

  const handleForgotPassword = useCallback(async () => {
    await forgotPassword({ email: refEmail.current.value });
  }, [forgotPassword, refEmail]);

  const backHome = useCallback(() => {
    router.push("/login");
  }, [router]);


  return (
    <Box className={styles.wrapContent} sx={{width: "100%"}}>
      <Box className={styles.wrapLogin} sx={{width: "500px !important"}}>
        <img
          src={dataSystem?.logo ? handleLinkFile(dataSystem?.logo) : logo?.src}
          alt="Logo"
          className={styles.loginImage}
        />
        <Box sx={{marginTop: "20px", textAlign: "center", fontSize: "14px", }}>Lost your password ?. Please enter your email address. We will send new password your email</Box>
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
            {!loadingEmail ? (
               <Button sx={{marginTop: "20px"}} variant="contained" onClick={handleForgotPassword}>
              Reset Password
            </Button>
            ) : (
              <Button disabled={true} sx={{height: "35px", marginTop: "20px"}}  variant="contained">
              <CircularProgress disableShrink sx={{ height: "25px !important",  width: "25px !important"  }} />
            </Button>
            )}
            {dataForgotPassword && (
               <Button
               sx={{ marginTop: 2 }}
               variant="contained"
               color="success"
               onClick={backHome}
             >
               Back to Login
             </Button>
            )}
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

const mapDispatchToProps = { userLogin, clearData, getSystemInfo, forgotPassword };
export default connect(mapStateToProps, mapDispatchToProps)(Login);
