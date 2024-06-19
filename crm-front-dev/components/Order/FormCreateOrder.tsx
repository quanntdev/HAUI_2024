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
import { getContactListByCustomerId } from "../../redux/actions/contact";
import { searchUser, clearData } from "../../redux/actions/user";
import {
  searchCustomer,
  createCustomer,
  getDetailCustomer,
  getListDealByCustomerId,
  searchNameAndIdCustomer,
} from "../../redux/actions/customer";
import { getCategoryList } from "../../redux/actions/category";
import { getOrderStatusList } from "../../redux/actions/orderStatus";
import { getListBilling } from "../../redux/actions/billing";
import { createOrder } from "../../redux/actions/order";
import InputFormatNumber from "../Input/InputFormatNumber";
import { getCurrencyList } from "../../redux/actions/currency";
import InputTiny from "../Input/InputTiny";
import {
  todayMoment,
  tomorrowMoment,
  partnerSaleOption,
} from "../../constants";
import useTrans from "../../utils/useTran";
import tranformDescription from "../../utility/tranformDescription";
import { getDetailProfile } from "../../redux/actions/profile";

type DataFormType = {
  name: string | null;
  startDate: string | null;
  dueDate: string | null;
  deleveryDate: string | Date | null;
  description: string;
  orderManager: string | null;
  review: string | null;
  ratePoint: string | number | null;
  billingTypeId: string | number | null;
  currencyId: string | number | null;
  orderValue: string;
  categoryId: string | number | null;
  dealId: string | number | null;
  customerId: string | number | null;
  contactId: string | number | null;
  userAssignId: string | number | null;
  price: string | number | null;
  statusId: string | number | null;
  partnerSalePercent: string | number | null;
};

const INIT_DATA = {
  name: "",
  startDate: todayMoment.format("YYYY-MM-DD"),
  dueDate: tomorrowMoment.format("YYYY-MM-DD"),
  deleveryDate: "",
  description: "",
  orderManager: "",
  review: "",
  ratePoint: "",
  billingTypeId: "",
  currencyId: "",
  orderValue: "",
  categoryId: "",
  dealId: "",
  customerId: "",
  contactId: "",
  userAssignId: "",
  price: "",
  statusId: "",
  partnerSalePercent: "",
};

const INIT_ERROR = {
  name: "",
  startDate: "",
  dueDate: "",
  deleveryDate: "",
  description: "",
  orderManager: "",
  review: "",
  ratePoint: "",
  billingTypeId: "",
  currencyId: "",
  orderValue: "",
  categoryId: "",
  dealId: "",
  customerId: "",
  contactId: "",
  userAssignId: "",
  price: "",
  statusId: "",
  partnerSalePercent: "",
};

const FormCreateOrder = (props: any) => {
  let typingTimer: any;
  const delay = 500;
  const trans = useTrans();
  const {
    createOrder,
    searchNameAndIdCustomer,
    searchUser,
    getCategoryList,
    getContactListByCustomerId,
    getListDealByCustomerId,
    getOrderStatusList,
    errors,
    openEditModal,
    setOpenEditModal,
    getCurrencyList,
    getListBilling,
    getDetailCustomer,
    clearData,
    getDetailProfile,
  } = props;

  const { dataUserList } = props.user;
  let { dataCreateOrder } = props.order;
  const { dataListNameAndIDByCustomer, dataListDeals, dataDetailCustomer } =
    props.customer;
  const { dataDetailProfile } = props?.profile;
  const { dataCategoryList } = props.category;
  const { dataOrderStatusList } = props.orderStatus;
  const { dataBillingList } = props.billing;
  const { dataCurrencyList } = props.currency;
  const [dataForm, setDataForm] = useState<DataFormType>(INIT_DATA);
  const [dataError, setDataError] = useState(INIT_ERROR);
  const [dealList, setDealList] = useState<any>(null);

  const [searchNameCustomer, setSearchNameCustomer] = useState("");
  const [customerOptions, setCustomerOptions] = useState([]);

  const router = useRouter();

  useEffect(() => {
    setDataForm({
      ...INIT_DATA,
    });
  }, []);

  useEffect(() => {
    if (dataListDeals) {
      setDealList(
        dataListDeals?.items?.filter(
          (item: any) => item?.status?.name === "WON"
        )
      );
    }
  }, [dataListDeals]);

  useEffect(() => {
    searchUser();
    getCategoryList();
    getOrderStatusList();
    getCurrencyList();
  }, []);

  const handleChangeInput = useCallback(
    (key: any, value: any) => {
      setDataForm((prevDataForm: any) => ({
        ...prevDataForm,
        [key]: value ?? "",
      }));
    },
    [setDataForm]
  );

  const handleChangeSelect = useCallback(
    (key: any, value: any) => {
      setDataForm((prevDataForm: any) => ({
        ...prevDataForm,
        [key]: Number(value),
      }));
      if (key === "customerId") {
        getContactListByCustomerId(value);
        getListDealByCustomerId(value);
        getListBilling();
        getDetailCustomer(value);
      }
    },
    [
      setDataForm,
      getContactListByCustomerId,
      getListDealByCustomerId,
      getListBilling,
      getDetailCustomer,
    ]
  );

  useEffect(() => {
    setDataForm({
      ...dataForm,
      currencyId: dataDetailCustomer?.currency?.id
        ? +dataDetailCustomer?.currency?.id
        : "",
      partnerSalePercent: dataDetailCustomer?.partners[0]
        ? dataDetailCustomer?.partners[0]?.salePercent
        : "",
    });
  }, [dataDetailCustomer]);

  useEffect(() => {
    setDataError({ ...dataError, ...errors });
  }, [errors]);

  useEffect(() => {
    if (openEditModal) {
      !dataDetailProfile && getDetailProfile();
      setDataForm({
        ...dataForm,
        userAssignId: dataDetailProfile?.id,
      });
    }
  }, [openEditModal]);

  const handleCloseEditModal = () => {
    setDataError(INIT_ERROR);
    setOpenEditModal(false);
    setDealList([]);
    clearData("dataDetailCustomer");
  };

  const handleSubmitForm = async (e: { preventDefault: () => void }) => {
    if (dataForm?.customerId == null) {
      setDataError({
        ...INIT_ERROR,
        ...errors,
        customerId: { isNotEmpty: "customer should not be empty" },
      });
    }
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
    openEditModal && createOrder(formData);
  };

  useEffect(() => {
    if (dataCreateOrder) {
      setDataForm(INIT_DATA);
      handleCloseEditModal();
      router.push(router.route);
      clearData("dataCreateOrder");
    }
  }, [dataCreateOrder]);

  const handleTextFieldChange = useCallback((event: any) => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      const updatedValue = event.target.value;
      setSearchNameCustomer(updatedValue);
    }, delay);
  }, []);
  
  useEffect(() => {
    const query = `keyword=${searchNameCustomer}`;
    searchNameAndIdCustomer(query);
  }, [searchNameCustomer]);

  useEffect(() => {
    const CustomerOptions = dataListNameAndIDByCustomer?.map(
      (key: { id: any; name: any }) => ({
        id: key?.id,
        value: key?.id,
        label: key?.name,
      })
    );
    setCustomerOptions(CustomerOptions);
  }, [dataListNameAndIDByCustomer]);

  const handleAutocompleteChange = useCallback(
    (event: any, value: any) => {
      if (value) {
        const { id } = value;
        getListDealByCustomerId(id);
      } else {
        setDealList([]);
      }
    },
    [getListDealByCustomerId, setDealList]
  );

  const renderInput = useCallback(
    (params:any) => (
      <TextField {...params} onChange={handleTextFieldChange} />
    ),
    [handleTextFieldChange]
  );

   const optionUserAssign = dataUserList?.items?.map(
    (key: { id: any; profile: any }) => ({
      id: key?.id,
      label: key?.profile?.first_name + " " + key?.profile?.last_name,
      value: key?.id,
    })
  );

  const handleAutocompleteUserAssignt = useCallback((event: any, data: any) => {
    if (data) {
      setDataForm({ ...dataForm, ["userAssignId"]: data?.id ?? "" });
    }
  }, [dataForm]);

  const renderInputUserAssign = useCallback(
    (params:any) => <TextField {...params} />,
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
          {trans.order.add_order}
          <Button onClick={handleCloseEditModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box className="box-title">
            <Typography>{trans.menu.customer}</Typography>
          </Box>

          <Grid item md={12}>
            <Typography>{trans.customer.customer_name}</Typography>
            <Autocomplete
              disablePortal
              options={customerOptions}
              sx={{ width: '100%' }}
              renderInput = {renderInput}
              onChange={handleAutocompleteChange}
            />
          </Grid>

          <Grid container spacing={2}>
            <Grid item md={12} mt={2}>
              <SelectDefault
                labelText={trans.deal.deal_name}
                keyword="dealId"
                keyMenuItem="id"
                keyValue="name"
                data={dealList ?? []}
                require={true}
                handleChange={handleChangeSelect}
                value={dataForm?.dealId}
                errorText={getFirstValueInObject(dataError?.dealId)}
              />
            </Grid>
            <Grid item md={12}>
              <InputBase
                labelText={trans.order.order_name}
                keyword="name"
                placeholder={trans.order.order_name}
                value={dataForm?.name}
                require={true}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.name)}
              />
            </Grid>
            <Grid item md={12}>
              <Typography variant="body1" color="initial">
               {trans.customer.user_assigned}
              </Typography>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={optionUserAssign}
                sx={{ width: "100%" }}
                renderInput={renderInputUserAssign}
                onChange={handleAutocompleteUserAssignt}
              />
            </Grid>
          </Grid>
          <Box className="box-title">
            <Typography>Order Detail</Typography>
          </Box>
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
                <Grid item md={4}>
                  <SelectDefault
                    labelText={trans.order.order_value}
                    keyword="currencyId"
                    keyMenuItem="id"
                    keyValue="name"
                    data={dataCurrencyList}
                    value={dataForm?.currencyId}
                    disabled={
                      !!dataDetailCustomer?.currency?.id || !dataDetailCustomer
                    }
                    handleChange={handleChangeSelect}
                    errorText={getFirstValueInObject(dataError?.currencyId)}
                  />
                </Grid>
                <Grid item md mt={3}>
                  <InputFormatNumber
                    keyword="orderValue"
                    size="medium"
                    placeholder={trans.deal.value}
                    value={dataForm?.orderValue}
                    handleChange={handleChangeInput}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <InputBase
                labelText={trans.deal.order_manager}
                keyword="orderManager"
                placeholder={trans.deal.order_manager}
                value={dataForm?.orderManager}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.orderManager)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <SelectDefault
                labelText={trans.deal.billing_type}
                keyword="billingTypeId"
                keyMenuItem="id"
                keyValue="name"
                data={dataBillingList}
                value={dataForm?.billingTypeId}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.userAssignId)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <DatePickerDefault
                labelText={trans.order.start_date}
                keyword="startDate"
                value={dataForm?.startDate}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.startDate)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <DatePickerDefault
                disabled={!dataForm?.startDate}
                labelText={trans.order.due_date_}
                keyword="dueDate"
                value={dataForm?.dueDate}
                handleChange={handleChangeInput}
                minDate={dataForm?.startDate}
                errorText={getFirstValueInObject(dataError?.dueDate)}
              />
            </Grid>
          </Grid>
          {dataDetailCustomer?.partners.length > 0 &&
            Number(dataDetailCustomer?.partners[0]?.saleType) ===
              partnerSaleOption.TOTAL_PAYMENT_REVENUE && (
              <>
                <Box className="box-title">
                  <Typography>{trans.menu.partner}</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item md={12} mt={1} sx={{ zIndex: 10 }}>
                    <InputBase
                      labelText={trans.partner.partner_name}
                      value={dataDetailCustomer?.partners[0]?.partners?.name}
                      disabled={true}
                    />
                  </Grid>
                  <Grid item md={12} mt={1} sx={{ zIndex: 10 }}>
                    <InputFormatNumber
                      keyword="partnerSalePercent"
                      size="medium"
                      placeholder={trans.partner.sale}
                      value={dataForm?.partnerSalePercent}
                      handleChange={handleChangeInput}
                      errorText={getFirstValueInObject(
                        dataError?.partnerSalePercent
                      )}
                      probability={true}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          <Box className="box-title">
            <Typography>{trans.order.description_information}</Typography>
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
            <Typography>{trans.order.order_status}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <SelectDefault
                labelText="Status"
                keyword="statusId"
                keyMenuItem="id"
                keyValue="name"
                data={dataOrderStatusList}
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
  billing: state.billing,
  order: state.order,
  category: state.category,
  customer: state.customer,
  contact: state.contact,
  currency: state.currency,
  user: state.user,
  orderStatus: state.orderStatus,
  profile: state?.profile,
  errors: state.deal?.error?.response?.data?.properties ?? {},
});

const mapDispatchToProps = {
  createOrder,
  searchCustomer,
  createCustomer,
  getContactListByCustomerId,
  getListDealByCustomerId,
  searchUser,
  getCategoryList,
  getOrderStatusList,
  getCurrencyList,
  getListBilling,
  getDetailCustomer,
  clearData,
  getDetailProfile,
  searchNameAndIdCustomer,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormCreateOrder);
