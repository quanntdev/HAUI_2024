import { Button, Card, Grid } from "@mui/material";
import Breadcrumb from "../../components/Breadcumb";
import { connect } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import { NextPage } from "next";
import useTrans from "../../utils/useTran";
import styles from "./styles.module.scss";
import logo from "../../assets/images/Logo.png";
import { uploadSystemInfor, getSystemInfo, clearData } from "../../redux/actions/system";
import { URL_API_FILE_LOGO } from "../../constants";


type INIT_FILE = {
  logo: string | null
}

const INIT_DATA = {
  logo : ""
}

const System: NextPage = (props: any) => {
 const {uploadSystemInfor, getSystemInfo, clearData} = props;
 const { dataSystem,dataUploadSystem } = props.system;
  const [image, setImage] = useState("");
  const [dataForm, setDataform] = useState<INIT_FILE>(INIT_DATA)
  const trans = useTrans();

  const handleOnChange = (e: any) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    if(e.target.files[0]) {
      setDataform({...dataForm, logo: e.target.files[0]})
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    reader?.readAsDataURL(files[0]);
  };

  const handleUpdateLogo = useCallback(() => {
    const { ...payload }: any = dataForm;
    const formData = new FormData();
    Object.keys(payload).forEach((key: any) => {
      formData.append(key, payload[key]);
    });
    uploadSystemInfor(formData);
  }, [dataForm, uploadSystemInfor]);


  useEffect(() => {
    if(!dataSystem || dataUploadSystem) {
      getSystemInfo();
    }

    setImage(handleLinkFile(dataSystem?.logo))
    clearData("dataUploadSystem")
  }, [dataSystem, dataUploadSystem])

  const handleLinkFile = (url:any) => {
    return URL_API_FILE_LOGO + url;
  };

  return (
    <>
      <Breadcrumb title={trans.task.settings} />
      <Card sx={{ marginTop: 2, padding: 2 }}>
        <Grid container>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <div className={styles["logo"]}>
                <img src={image ? image : logo.src} />
              </div>
              <label
                htmlFor="input-file"
                className={styles["upload-label"]}
              >
                 {trans.setting.Upload_new_Logo}
              </label>
              <input
                id="input-file"
                type="file"
                accept=".png, .jpeg, .jpg"
                className={styles["logo-btn"]}
                onChange={handleOnChange}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} className="mt-8 text-align-center">
              <Button
                className="btn_create ml-8"
                sx={{ marginTop: 1 }}
                onClick={handleUpdateLogo}
              >
                {trans.task.save}
              </Button>
            </Grid>
        </Grid>
      </Card>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  system: state.system
});

const mapDispatchToProps = {
  uploadSystemInfor,
  getSystemInfo,
  clearData
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
