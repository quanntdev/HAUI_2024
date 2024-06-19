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
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import InputBase from "../Input/InputBase";
import DatePickerDefault from "../Input/DatePickerDefault";
import SelectDefault from "../Input/SelectDefault";
import { getFirstValueInObject } from "../../helpers";
import { getContactListByCustomerId } from "../../redux/actions/contact";
import { searchUser } from "../../redux/actions/user";
import { getCategoryList } from "../../redux/actions/category";
import { getStatusList } from "../../redux/actions/status";
import { createDeal, clearData } from "../../redux/actions/deal";
import InputFormatNumber from "../Input/InputFormatNumber";
import { getCurrencyList } from "../../redux/actions/currency";
import InputTiny from "../Input/InputTiny";
import useTrans from "../../utils/useTran";

type DataFormType = {
  name: string;
  customerId: number | null;
  url: string | null;
  contactId: number | null;
  categoryId: number | null;
  probabilityWinning: string | null;
  forecastCloseDate:string | Date | null;
  userAssignId: number | null;
  currencyId:string | number | null;
  price: string;
  description: string;
  statusId: number | null;
  tagId: string;
};

const INIT_DATA = {
  name: "",
  customerId: null,
  url: null,
  contactId: null,
  categoryId: null,
  probabilityWinning: null,
  forecastCloseDate: "",
  userAssignId: null,
  currencyId: null,
  price: "",
  description: "",
  statusId: null,
  tagId: "",
};

const INIT_ERROR = {
  name: "",
  customerId: "",
  url: "",
  contactId: "",
  categoryId: "",
  probabilityWinning: "",
  forecastCloseDate: "",
  userAssignId: "",
  currencyId: "",
  price: "",
  description: "",
  statusId: "",
  tagId: "",
  message: "",
};

const FormCreateDealFromCustomerDetail = (props: any) => {
  const trans = useTrans();
  const {
    createDeal,
    clearData,
    searchUser,
    getCategoryList,
    getStatusList,
    errors,
    customer,
    openModal,
    setOpenModal,
    getCurrencyList,
    listContact,
  } = props;
  const { dataCreateDeal } = props.deal;
  const { dataUserList } = props.user;
  const { dataCategoryList } = props.category;
  const { dataStatusList } = props.status;
  const { dataCurrencyList } = props.currency;
  const [dataForm, setDataForm] = useState<DataFormType>(INIT_DATA);
  const [dataError, setDataError] = useState(INIT_ERROR);

  useEffect(() => {
    if (openModal) {
      searchUser();
      getCategoryList();
      getStatusList();
      getCurrencyList();
      setDataForm({ ...dataForm, customerId: customer?.id, currencyId:customer?.currency?.id ? +customer?.currency?.id : "" });
    }
  }, [openModal]);

  const handleChangeInput = function (key: any, value: any) {
    if (value === "") value = null;
    setDataForm({ ...dataForm, [key]: value });
  };

  const handleChangeSelect = function (key: any, value: any) {
    setDataForm({ ...dataForm, [key]: Number(value) ?? "" });
  };

  useEffect(() => {
    setDataError({ ...INIT_ERROR, ...errors });
    setDataForm({ ...dataForm, customerId: customer?.id, currencyId:customer?.currency?.id ? +customer?.currency?.id : "" });
  }, [errors]);

  const handleCloseEditModal = function () {
    if (dataCreateDeal) clearData("dataCreateDeal");
    setDataForm(INIT_DATA);
    setDataError(INIT_ERROR);
    setOpenModal(false);
  };

  const handleSubmitForm = async function (e: { preventDefault: () => void }) {
    e.preventDefault();
    createDeal(dataForm);
    setDataForm(INIT_DATA);
  };

  useEffect(() => {
    if (dataCreateDeal) {
      setDataForm(INIT_DATA);
      handleCloseEditModal();
    }
  }, [dataCreateDeal]);

  useEffect(() => {
    if (dataError?.message != "") {
      handleCloseEditModal();
    }
  }, [dataError]);

  return (
    <>
      <Dialog
        disableEnforceFocus={true}
        disableAutoFocus={true}
        open={openModal}
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
          {trans.deal.add_deal}
          <Button onClick={handleCloseEditModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box className="box-title">
            <Typography>{trans.menu.customer}</Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item md={6}>
              <InputBase
                labelText={trans.customer.customer_name}
                require={true}
                disabled={true}
                value={customer?.name}
              />
            </Grid>
            <Grid item xs={6}>
              <SelectDefault
                labelText={trans.menu.contact}
                keyword="contactId"
                keyMenuItem="id"
                keyValue="firstName"
                keyValueTwo="lastName"
                data={listContact?.items ?? []}
                handleChange={handleChangeSelect}
                value={dataForm?.contactId}
                errorText={getFirstValueInObject(dataError?.contactId)}
              />
            </Grid>
          </Grid>

          <Box className="box-title">
            <Typography>{trans.deal.deal_detail}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <InputBase
                labelText={trans.deal.deal_name}
                keyword="name"
                type="text"
                placeholder={trans.deal.deal_name}
                require={true}
                value={dataForm?.name}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.name)}
              />
            </Grid>
            <Grid item md={12}>
              <InputBase
                labelText="URL"
                keyword="url"
                type="link"
                placeholder="URL"
                value={dataForm?.url}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.url)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <SelectDefault
                labelText={trans.deal.category}
                keyword="categoryId"
                keyMenuItem="id"
                keyValue="name"
                data={dataCategoryList?.items}
                value={dataForm?.categoryId}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.categoryId)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <Grid container spacing={2}>
                <Grid item md={5}>
                  <SelectDefault
                    labelText={trans.deal.deal_value}
                    keyword="currencyId"
                    keyMenuItem="id"
                    keyValue="name"
                    data={dataCurrencyList}
                    disabled={customer?.currency ? true : false}
                    value={dataForm?.currencyId}
                    handleChange={handleChangeSelect}
                    errorText={getFirstValueInObject(dataError?.currencyId)}
                    require={true}
                  />
                </Grid>
                <Grid item md mt={3}>
                  <InputFormatNumber
                    keyword="price"
                    size="medium"
                    placeholder={trans.deal.value}
                    value={dataForm?.price}
                    handleChange={handleChangeInput}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <DatePickerDefault
                labelText={trans.deal.forecast_close_date}
                keyword="forecastCloseDate"
                value={dataForm?.forecastCloseDate}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.forecastCloseDate)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <InputBase
                labelText={trans.deal.probability_of_winning}
                keyword="probabilityWinning"
                type="text"
                placeholder={trans.deal.probability_of_winning}
                value={dataForm?.probabilityWinning}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.probabilityWinning)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <SelectDefault
                labelText={trans.customer.assigned}
                keyword="userAssignId"
                keyMenuItem="id"
                keyValue="profile"
                keyValuePropertyOne="first_name"
                keyValuePropertyTwo="last_name"
                data={dataUserList?.items}
                value={dataForm?.userAssignId}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.userAssignId)}
              />
            </Grid>
          </Grid>

          <Box className="box-title">
            <Typography>{trans.deal.description_information}</Typography>
          </Box>
          <InputTiny
            handleChange={handleChangeInput}
            keyword="description"
            value={dataForm?.description}
          />
          <Box className="box-title">
            <Typography>{trans.deal.deal_status}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <SelectDefault
                labelText={trans.deal.status}
                keyword="statusId"
                keyMenuItem="id"
                keyValue="name"
                data={dataStatusList}
                value={dataForm?.statusId ? dataForm?.statusId : 1}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.statusId)}
              />
            </Grid>
          </Grid>
          <DialogActions className="dialog-actions">
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
  deal: state.deal,
  category: state.category,
  contact: state.contact,
  currency: state.currency,
  user: state.user,
  status: state.status,
  errors: state.deal?.error?.response?.data?.properties ?? {},
});

const mapDispatchToProps = {
  createDeal,
  getContactListByCustomerId,
  searchUser,
  getCategoryList,
  getStatusList,
  clearData,
  getCurrencyList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormCreateDealFromCustomerDetail);
