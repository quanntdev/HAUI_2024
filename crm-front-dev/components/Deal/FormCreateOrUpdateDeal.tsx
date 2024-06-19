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
  Autocomplete,
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import InputBase from "../Input/InputBase";
import DatePickerDefault from "../Input/DatePickerDefault";
import SelectDefault from "../Input/SelectDefault";
import { getFirstValueInObject } from "../../helpers";
import { rowsPerPage, rowsPerPageLimit } from "../../constants";
import { getContactListByCustomerId } from "../../redux/actions/contact";
import { searchUser } from "../../redux/actions/user";
import {
  searchCustomer,
  searchNameAndIdCustomer,
  createCustomer,
  getDetailCustomer,
} from "../../redux/actions/customer";
import { getCategoryList } from "../../redux/actions/category";
import { getStatusList } from "../../redux/actions/status";
import InputTiny from "../Input/InputTiny";
import {
  searchDeal,
  createDeal,
  getDetailDeal,
  updateDeal,
  clearData,
} from "../../redux/actions/deal";
import InputFormatNumber from "../Input/InputFormatNumber";
import { getCurrencyList } from "../../redux/actions/currency";
import useTrans from "../../utils/useTran";
import tranformDescription from "../../utility/tranformDescription";
import { getDetailProfile } from "../../redux/actions/profile";
type DataFormType = {
  name: string | null;
  customerId: string | number | null;
  url: string | null;
  contactId: string | number | null;
  categoryId: string | number | null;
  probabilityWinning: string | null;
  forecastCloseDate: string | Date | null;
  userAssignId: string | number | null;
  currencyId: string | number | null;
  price: string;
  description: string;
  statusId: string | number | null;
  tagId: string | null;
};

const INIT_DATA = {
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
};

const FormCreateOrUpdateDeal = (props: any) => {
  let typingTimer: any;
  const delay = 500;
  const trans = useTrans();
  const {
    searchDeal,
    createDeal,
    getDetailDeal,
    updateDeal,
    clearData,
    searchCustomer,
    searchNameAndIdCustomer,
    searchUser,
    getCategoryList,
    getContactListByCustomerId,
    getStatusList,
    errors,
    openEditModal,
    setOpenEditModal,
    getDetailCustomer,
    id,
    getCurrencyList,
    contactId,
    getDetailProfile,
  } = props;
  const { dataDealDetail, dataUpdateDeal, dataCreateDeal } = props.deal;
  const {
    dataCustomerList,
    dataListNameAndIDByCustomer,
    dataCreateCustomer,
    dataDetailCustomer,
  } = props.customer;
  const { dataContactListByCustomerId } = props.contact;
  const { dataUserList } = props.user;
  const { dataCategoryList } = props.category;
  const { dataStatusList } = props.status;
  const { dataCurrencyList } = props.currency;
  const { dataDetailProfile } = props?.profile;
  const [dataForm, setDataForm] = useState<DataFormType>(INIT_DATA);
  const [dataError, setDataError] = useState(INIT_ERROR);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [searchNameCustomer, setSearchNameCustomer] = useState("");
  const [listContact, setListContact] = useState([]);
  const [idDefaultAssign, setIdDefaultAssign] = useState(Number);
  const router = useRouter();

  useEffect(() => {
    getDetailProfile();
  }, []);

  useEffect(() => {
    if (id) {
      getDetailDeal(id);
    } else {
      clearData("dataDealDetail");
    }
  }, [id]);
  useEffect(() => {
    if (contactId > 0) getContactListByCustomerId(contactId);
  }, [contactId]);

  useEffect(() => {
    if (openEditModal && !dataDetailProfile) {
      getDetailProfile();
    }
    setDataForm({
      ...dataForm,
      userAssignId: +dataDetailProfile?.id ?? "",
    });
  }, [openEditModal]);

  useEffect(() => {
    setDataForm({
      ...dataForm,
      currencyId: dataDetailCustomer?.currency?.id
        ? +dataDetailCustomer?.currency?.id
        : "",
    });
  }, [dataDetailCustomer]);

  useEffect(() => {
    setDataForm({
      ...INIT_DATA,
      ...dataDealDetail,
      customerId: dataDealDetail?.customer?.id
        ? +dataDealDetail?.customer?.id
        : "",
      categoryId: dataDealDetail?.category?.id
        ? +dataDealDetail?.category?.id
        : "",
      userAssignId: dataDealDetail?.userAssign?.id
        ? +dataDealDetail?.userAssign?.id
        : +dataDetailProfile?.id,
      statusId: dataDealDetail?.status?.id ? +dataDealDetail?.status?.id : "",
      contactId: dataDealDetail?.contact?.id
        ? +dataDealDetail?.contact?.id
        : "",
      currencyId: dataDealDetail?.currency?.id
        ? +dataDealDetail?.currency?.id
        : "",
    });
  }, [dataDealDetail]);

  useEffect(() => {
    const query = `limit=${rowsPerPageLimit}&offset=${0}`;
    searchCustomer(query);
    searchNameAndIdCustomer();
    searchUser(query);
    getCategoryList();
    getStatusList();
    getCurrencyList();
  }, [dataCreateCustomer]);

  useEffect(() => {
    if (dataCustomerList && dataCreateCustomer) {
      setDataForm({
        ...dataForm,
        customerId: Number(dataCustomerList?.items[0]?.id),
      });
    }
  }, [dataCustomerList, dataCreateCustomer]);

  const handleChangeInput = function (key: any, value: any) {
    setDataForm({ ...dataForm, [key]: value ?? "" });
  };

  const handleChangeSelect = function (key: any, value: any) {
    setDataForm({ ...dataForm, [key]: Number(value) ?? "" });
    if (key == "customerId") {
      getContactListByCustomerId(value);
      getDetailCustomer(value);
    }
  };

  useEffect(() => {
    setDataError({ ...INIT_ERROR, ...errors });
  }, [errors]);

  const handleCloseEditModal = function () {
    if (dataCreateDeal) clearData("dataCreateDeal");
    if (dataUpdateDeal) clearData("dataUpdateDeal");
    if (dataCreateCustomer) clearData("dataCreateCustomer");
    setDataError(INIT_ERROR);
    setOpenEditModal(false);
  };

  const handleSubmitForm = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (id) {
      const { tags, ...newBody }: any = dataForm;
      updateDeal(newBody, id);
    } else {
      const { ...payload }: any = dataForm;
      const formData = new FormData();
      Object.keys(payload).forEach((key: any) => {
        if (key == "attachment") {
          Object.values(payload[key]).forEach(function (file: any) {
            formData.append("attachment[]", file);
          });
        } else if (key == "description") {
          formData.append(
            "description",
            tranformDescription(dataForm?.description)
          );
        } else {
          formData.append(key, payload[key]);
        }
      });
      createDeal(formData);
    }
  };

  // Search customerName for input

  useEffect(() => {
    const query = `keyword=${searchNameCustomer}`;
    searchNameAndIdCustomer(query);
  }, [searchNameCustomer]);

  useEffect(() => {
    if (dataListNameAndIDByCustomer) {
      const convert = dataListNameAndIDByCustomer.map(
        (key: { id: any; name: any }) => ({
          id: key?.id,
          value: key?.id,
          label: key?.name,
        })
      );
      setCustomerOptions(convert);
    }
  }, [dataListNameAndIDByCustomer]);

  const handleTextFieldChange = useCallback(
    (event: any) => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        const updatedValue = event.target.value;
        setSearchNameCustomer(updatedValue);
      }, delay);
    },
    [setSearchNameCustomer]
  );

  const handleAutocompleteChange = useCallback(
    (event: any, data: any) => {
      if (data) {
        const { id, value } = data;
        setDataForm((prevDataForm) => ({
          ...prevDataForm,
          customerId: Number(value) ?? "",
        }));
        getContactListByCustomerId(id);
      } else {
        setListContact([]);
      }
    },
    [setDataForm, getContactListByCustomerId, setListContact]
  );

  useEffect(() => {
    if (dataContactListByCustomerId?.items?.length > 0) {
      setListContact(dataContactListByCustomerId?.items);
    }
  }, [dataContactListByCustomerId]);

  useEffect(() => {
    if (dataCreateDeal) {
      setDataForm(INIT_DATA);
      setListContact([]);
      handleCloseEditModal();
      searchDeal();
      router.push(router.route);
    }
  }, [dataCreateDeal]);

  useEffect(() => {
    let querySearch = `limit=${rowsPerPage}`;
    if (router.query?.page) {
      querySearch = `limit=${rowsPerPage}&offset=${
        (Number(router.query.page) - 1) * rowsPerPage
      }`;
    }
    if (dataUpdateDeal) {
      searchDeal(querySearch);
      handleCloseEditModal();
    }
  }, [dataUpdateDeal]);

  useEffect(() => {
    if (!openEditModal) {
      setDataForm(INIT_DATA);
      setListContact([]);
    }
  }, [openEditModal]);

  const renderInput = useCallback(
    (params: any) => (
      <TextField
        {...params}
        onChange={handleTextFieldChange}
        helperText={getFirstValueInObject(dataError?.customerId)}
        error={Boolean(getFirstValueInObject(dataError?.customerId))}
      />
    ),
    [handleTextFieldChange, dataError?.customerId]
  );

  const optionUserAssign = dataUserList?.items?.map(
    (key: { id: any; profile: any }) => ({
      id: key?.id,
      label: key?.profile?.first_name + " " + key?.profile?.last_name,
      value: key?.id,
    })
  );

  useEffect(() => {
    optionUserAssign?.findIndex((item: any, index: any) => {
      if (item.id === dataDetailProfile?.id) {
        setIdDefaultAssign(index);
      }
    });
  }, [dataUserList, dataDetailProfile, idDefaultAssign, optionUserAssign]);

  const handleAutocompleteUserAssignt = useCallback(
    (event: any, data: any) => {
      if (data) {
        setDataForm({ ...dataForm, ["userAssignId"]: data?.id ?? "" });
      } else {
        setDataForm({ ...dataForm, ["userAssignId"]: "" });
      }
    },
    [dataForm]
  );

  const renderInputUserAssign = useCallback(
    (params: any) => <TextField {...params} />,
    []
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
          {dataDealDetail ? trans.deal.update_deal : trans.deal.add_deal}
          <Button onClick={handleCloseEditModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box className="box-title">
            <Typography>{trans.menu.customer}</Typography>
          </Box>

          <Grid item md={6}>
            <Autocomplete
              disablePortal
              options={customerOptions}
              sx={{ width: "100%" }}
              renderInput={renderInput}
              onChange={handleAutocompleteChange}
            />

            <Grid item xs={6} sx={{ marginTop: 1 }}>
              <SelectDefault
                labelText={trans.menu.contact}
                keyword="contactId"
                keyMenuItem="id"
                keyValue="firstName"
                keyValueTwo="lastName"
                data={listContact}
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
                    value={dataForm?.currencyId}
                    disabled={dataDetailCustomer?.currency?.id ? true : false}
                    handleChange={handleChangeSelect}
                    require={true}
                    errorText={getFirstValueInObject(dataError?.currencyId)}
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
              <InputFormatNumber
                label={trans.deal.probability_of_winning}
                keyword="probabilityWinning"
                type="text"
                placeholder={trans.deal.probability}
                value={dataForm?.probabilityWinning}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.probabilityWinning)}
                probability={true}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid sx={{ zIndex: 100 }} item md={6} mt={2}>
              <Typography variant="body1" color="initial">
                {trans.customer.assigned}
              </Typography>

              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={optionUserAssign}
                defaultValue={
                  optionUserAssign ? optionUserAssign[idDefaultAssign] : ""
                }
                sx={{ width: "100%" }}
                renderInput={renderInputUserAssign}
                onChange={handleAutocompleteUserAssignt}
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
            setDataForm={setDataForm}
            dataForm={dataForm}
            canDrop={true}
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
  customer: state.customer,
  contact: state.contact,
  currency: state.currency,
  user: state.user,
  status: state.status,
  profile: state.profile,
  errors: state.deal?.error?.response?.data?.properties ?? {},
});

const mapDispatchToProps = {
  searchDeal,
  createDeal,
  getDetailDeal,
  updateDeal,
  searchCustomer,
  searchNameAndIdCustomer,
  createCustomer,
  getContactListByCustomerId,
  searchUser,
  getCategoryList,
  getStatusList,
  clearData,
  getCurrencyList,
  getDetailCustomer,
  getDetailProfile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormCreateOrUpdateDeal);
