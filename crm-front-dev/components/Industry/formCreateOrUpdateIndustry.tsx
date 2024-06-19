import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import useTrans from "../../utils/useTran";
import styles from "./styles.module.scss";
import InputBase from "../Input/InputBase";
import { getFirstValueInObject } from "../../helpers";
import { connect } from "react-redux";
import {
  createIndustry,
  getIndustry,
  updateIndustry,
} from "../../redux/actions/industry";

const INIT_ERROR = {
  name: "",
};

const INIT_DATA = {
  name: "",
};

function FormCreateOrUpdateIndustry(props: any) {
  const [dataForm, setDataForm] = useState<any>(INIT_DATA);
  const [dataError, setDataError] = useState<any>(INIT_ERROR);
  const trans = useTrans();
  const {
    openModal,
    setOpenModal,
    itemEdit,
    createIndustry,
    getIndustry,
    updateIndustry,
    errors
  } = props;
  const { dataCreateIndustry, dataUpdateIndustry } = props.industry;
  

  useEffect(() => {
    setDataError({ ...INIT_ERROR, ...errors });
  }, [errors]);

  useEffect(() => {
    if (itemEdit && openModal) {
      setDataForm({
        ...INIT_DATA,
        name: itemEdit?.name,
      });
    }
  }, [openModal]);


  const handleCloseModal = useCallback(() => {
    setDataForm({ ...dataForm, ...INIT_DATA });
    setDataError({ ...dataError, ...INIT_ERROR });
    setOpenModal(false);
  }, [dataForm, dataError]);

  useEffect(() => {
    if (!openModal) {
      setDataForm(INIT_DATA);
    }
  }, [openModal]);

  const handleChangeInput = useCallback((key: any, value: any) => {
    if (value === "") value = "";
    setDataForm((prevDataForm: any) => ({ ...prevDataForm, [key]: value }));
  }, []);

  const handleCreateIndustry = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    createIndustry(dataForm);
  };

  useEffect(() => {
    handleCloseModal();
    getIndustry();
  }, [dataCreateIndustry, dataUpdateIndustry]);

  const handleUpdateIndustry = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    updateIndustry(dataForm, itemEdit?.id);
  };

  return (
    <div>
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
          {!itemEdit
            ? trans.industry.add_industry
            : trans.industry.update_industry}
          <Button onClick={handleCloseModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box className={styles["box-title"]}>
            <Typography> {trans.menu.industry}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <InputBase
                keyword="name"
                placeholder={trans.customer.name}
                type="text"
                require={true}
                value={dataForm?.name ?? ""}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.name)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            className="btn-save"
            onClick={!itemEdit ? handleCreateIndustry : handleUpdateIndustry}
          >
            {trans.task.save}
          </Button>
          <Button onClick={handleCloseModal} className="btn-cancel">
            {trans.task.cancle}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  industry: state.industry,
  errors: state.industry?.error?.response?.data?.properties ?? {},
});
const mapDispatchToProps = {
  createIndustry,
  getIndustry,
  updateIndustry,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormCreateOrUpdateIndustry);
