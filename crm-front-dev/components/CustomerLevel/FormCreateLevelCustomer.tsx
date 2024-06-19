import { Close } from "@mui/icons-material";
import {
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

import {
  clearData,
  createCustomerlevel,
  searchCustomerLevel,
  updateLevelCustomer,
} from "../../redux/actions/customerLevel";
import { connect } from "react-redux";
import { getFirstValueInObject } from "../../helpers";

const INIT_ERROR = {
  name: "",
  description: "",
};

const INIT_DATA = {
  name: "",
  description: "",
};

function FormCreateLevelCustomer(props: any) {
  const trans = useTrans();
  const {
    openModal,
    setOpenModal,
    createCustomerlevel,
    updateLevelCustomer,
    errors,
    itemEdit,
  } = props;

  const [dataForm, setDataForm] = useState<any>(INIT_DATA);
  const [dataError, setDataError] = useState<any>(INIT_ERROR);

  const { dataCreateLevelCustomer, dataUpdateLevelCustomer } =
    props.customerLevel;

  useEffect(() => {
    if (itemEdit && openModal) {
      setDataForm({
        ...INIT_DATA,
        name: itemEdit?.name,
        description: itemEdit?.description,
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

  const handleCreateLevelCustomer = async (e: {
    preventDefault: () => void;
  }) => {
    e.preventDefault();
    createCustomerlevel(dataForm);
  };

  const handleUpdateLevelCustomer = async (e: {
    preventDefault: () => void;
  }) => {
    e.preventDefault();
    updateLevelCustomer(dataForm, itemEdit?.id);
  };

  useEffect(() => {
    if (dataCreateLevelCustomer) {
      handleCloseModal();
    }
  }, [dataCreateLevelCustomer]);

  useEffect(() => {
    setDataError({ ...INIT_ERROR, ...errors });
  }, [errors]);

  useEffect(() => {
    if (dataUpdateLevelCustomer) {
      handleCloseModal();
    }
  }, [dataUpdateLevelCustomer]);

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
            {!itemEdit
              ? trans.level.add_level_customer
              : trans.level.update_level_customer}
          </Typography>
          <Button onClick={handleCloseModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <InputBase
                labelText={trans.customer.name}
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
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <InputBase
                labelText={trans.task.description}
                keyword="description"
                placeholder={trans.task.description}
                type="text"
                require={true}
                value={dataForm?.description ?? ""}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.description)}
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
            onClick={
              !itemEdit ? handleCreateLevelCustomer : handleUpdateLevelCustomer
            }
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
}

const mapStateToProps = (state: any) => ({
  customerLevel: state.customerLevel,
  errors: state.customerLevel?.error?.response?.data?.properties ?? {},
});
const mapDispatchToProps = {
  clearData,
  createCustomerlevel,
  updateLevelCustomer,
  searchCustomerLevel,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormCreateLevelCustomer);
