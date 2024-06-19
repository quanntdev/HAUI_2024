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
import { Close } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import InputBase from "../Input/InputBase";
import { getFirstValueInObject } from "../../helpers";
import { searchUser } from "../../redux/actions/user";
import { createOrder } from "../../redux/actions/order";
import SelectInput from "../Input/SelectInput/SelectInput";
import InputTiny from "../Input/InputTiny";
import useTrans from "../../utils/useTran";
import { CUSTOMER_PRIORITY_LIST } from "../../constants/customer";
import { createPartner, clearData } from "../../redux/actions/partner";
import { getDetailProfile } from "../../redux/actions/profile";

type DataFormType = {
  email: string | null;
  name: string | null;
  phone: string | null;
  fax: string;
  website: string | null;
  address: string;
  description: string;
  assignedId: string | number | null;
  priorityId: string | number | null;
};

const INIT_DATA = {
  email: "",
  name: "",
  phone: "",
  fax: "",
  website: "",
  address: "",
  description: "",
  assignedId: "",
  priorityId: "",
};

const INIT_ERROR = {
  email: "",
  name: "",
  phone: "",
  fax: "",
  website: "",
  address: "",
  description: "",
  assignedId: "",
  priorityId: "",
};

const FormCreatePartner = (props: any) => {
  //use Hook
  const trans = useTrans();

  //varriable (if default)

  //props
  const { openEditModal,setOpenEditModal, searchUser,createPartner, errors, getDetailProfile } = props;
  const { dataUserList } = props.user;
  const { dataCreatePartner } = props.partner;
  const { dataDetailProfile } = props?.profile;

  //useState
  const [dataForm, setDataForm] = useState<DataFormType>(INIT_DATA);
  const [dataError, setDataError] = useState<any>(INIT_ERROR);

  //list handle open/close modal
  const handleCloseEditModal = useCallback(() => {
    setDataForm({ ...dataForm, ...INIT_DATA });
    setDataError({ ...dataError, ...INIT_ERROR })
    setOpenEditModal(false);
  }, [setDataForm, setDataError, setOpenEditModal]);

  // list handle Change data
  const handleChangeInput = useCallback(function (key: any, value: any) {
    if (value === "") value = "";
    setDataForm({ ...dataForm, [key]: value });
  }, [dataForm, setDataForm]);

  const handleChangeSelect = useCallback(function (key: any, value: any) {
    setDataForm({ ...dataForm, [key]: Number(value) });
  }, [dataForm, setDataForm]);

  const handleSubmitForm = useCallback(() => {
    createPartner(dataForm)
  }, [createPartner, dataForm]);


  //useEfffect
  useEffect(() => {
    searchUser();
    !dataDetailProfile && getDetailProfile()
    setDataForm({
      ...dataForm,
      assignedId: dataDetailProfile?.id
    });
  }, [openEditModal]);

  useEffect(() => {
    setDataError({ ...INIT_ERROR, ...errors });
  }, [errors]);

  useEffect(() => {
    if(dataCreatePartner) {
      handleCloseEditModal()
    }
  }, [dataCreatePartner])

  // other (like const, varriable, ...)
  const userAssignDefault = dataUserList?.items?.map(
    (key: { id: any; profile: any }) => ({
      id: key?.id,
      label: key?.profile?.first_name + key?.profile?.last_name,
      value: key?.id,
    })
  );

  return (
    <>
      <Dialog
        disableEnforceFocus={true}
        disableAutoFocus={true}
        open={openEditModal}
        onClose={handleCloseEditModal}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        className="dialog-form"
        classes={{
          container: "form-dialog-container",
          paper: "form-dialog-paper",
        }}
      >
        <DialogTitle
          className="dialog-title"
          id="scroll-dialog-title"
          variant="h6"
        >
          {trans.partner.add_sale_partner}
          <Button onClick={handleCloseEditModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box className="box-title">
            <Typography>{trans.partner.partner_detail}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <InputBase
                labelText={trans.partner.partner_name}
                keyword="name"
                placeholder={trans.partner.partner_name}
                type="text"
                require={true}
                value={dataForm?.name}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.name)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <SelectInput
                labelText={trans.customer_detail.priority}
                keyword="priorityId"
                keyMenuItem="id"
                keyValue="name"
                options={CUSTOMER_PRIORITY_LIST}
                value={dataForm?.priorityId}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.priorityId)}
              />
            </Grid>
          </Grid>
          <Box className="box-title">
            <Typography mt={1}>
              {trans.customer_detail.address_infomation}
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item md={6} mt={1}>
              <InputBase
                labelText={trans.customer_detail.phone}
                keyword="phone"
                placeholder={trans.customer_detail.phone}
                type="text"
                value={dataForm?.phone}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.phone)}
              />
            </Grid>
            <Grid item md={6} mt={1}>
              <InputBase
                labelText={trans.customer_detail.fax}
                keyword="fax"
                placeholder={trans.customer_detail.fax}
                type="text"
                value={dataForm?.fax}
                handleChange={handleChangeInput}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <InputBase
                labelText={trans.customer_detail.website}
                keyword="website"
                placeholder={trans.customer_detail.website}
                type="text"
                value={dataForm?.website}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.website)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <InputBase
                labelText={trans.customer_detail.email}
                keyword="email"
                placeholder={trans.customer_detail.email}
                type="text"
                value={dataForm?.email}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.email)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={12} mt={2} sx={{zIndex: 10}}>
              <SelectInput
                labelText={trans.customer_detail.assigned}
                keyword="assignedId"
                keyMenuItem="id"
                keyValue="name"
                options={userAssignDefault}
                value={dataForm?.assignedId}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.assignedId)}
              />
            </Grid>
            <Grid item md={12} mt={1}>
              <InputBase
                labelText={trans.customer_detail.address}
                keyword="address"
                placeholder={trans.customer_detail.address}
                type="text"
                value={dataForm?.address}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.address)}
              />
            </Grid>
          </Grid>
          <Box className="box-title">
            <Typography>{trans.customer_detail.address_infomation}</Typography>
          </Box>
          <InputTiny
            handleChange={handleChangeInput}
            keyword="description"
            value={dataForm?.description}
            setDataForm={setDataForm}
            dataForm={dataForm}
            canDrop={false}
          />
          <DialogActions className="dialog-actions">
            <Button className="btn-save" onClick={handleSubmitForm}>
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
  partner: state.partner,
  profile: state?.profile,
  errors: state.deal?.error?.response?.data?.properties ?? {},
});

const mapDispatchToProps = {
  createPartner,
  createOrder,
  searchUser,
  clearData,
  getDetailProfile
};

export default connect(mapStateToProps, mapDispatchToProps)(FormCreatePartner);
