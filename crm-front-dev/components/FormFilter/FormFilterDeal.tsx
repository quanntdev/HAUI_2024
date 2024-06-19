import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import InputBase from "../Input/InputBase";
import SelectDefault from "../Input/SelectDefault";
import DatePickerDefault from "../Input/DatePickerDefault";
import SelectInput from "../Input/SelectInput/SelectInput";
import { searchCustomer, createCustomer } from "../../redux/actions/customer";
import { connect } from "react-redux";
import { getCurrencyList } from "../../redux/actions/currency";
import { getCategoryList } from "../../redux/actions/category";
import { getStatusList } from "../../redux/actions/status";
import InputFormatNumber from "../Input/InputFormatNumber";
import { useRouter } from "next/router";
import { getParamsToURL } from "../../helpers";
import { keyPage, pageDefault } from "../../constants";
import MutiSelect from "../Input/MutiSelect";
import { CUSTOMER_PRIORITY_LIST } from "../../constants/customer";
import { getCities } from "../../redux/actions/city";
import useTrans from "../../utils/useTran";

type DataFormType = {
  customerId: number | null;
  currencyId: number | null;
  valueFrom: string;
  valueTo: string;
  categoryId: number | null;
  startTime: string | Date | null;
  endTime: string | Date | null;
  statusId: number | null;
  keyword: string;
  methodId: number | null;
  levelId: number | null;
  chanelId: number | null;
  countryId: number | null;
  userAssign: number | null;
  provinceId: number | null;
  genderId: number | null;
  phoneNumber: string;
  email: string;
  cid: string;
  contactName: string;
  taskName: string;
  partnerName: string;
};

type LableFormType = {
  customerIdLabel: string;
  currencyIdLabel: string;
  valueFromLabel: string;
  valueToLabel: string;
  categoryIdLabel: string;
  startTimeLabel: string | Date | null;
  endTimeLabel: string | Date | null;
  statusIdLabel: string;
  keywordLabel: string;
  methodIdLabel: string;
  levelIdLabel: string;
  chanelIdLabel: string;
  countryIdLabel: string;
  userAssignLabel: string;
  provinceIdLabel: string;
  genderIdLabel: string;
  phoneNumberLabel: string;
  emailLabel: string;
  cidLabel: string;
  contactNameLabel: string;
  taskNameLabel: string;
};

const INIT_DATA = {
  customerId: null,
  currencyId: null,
  valueFrom: "",
  valueTo: "",
  categoryId: null,
  startTime: null,
  endTime: null,
  statusId: null,
  keyword: "",
  methodId: null,
  levelId: null,
  chanelId: null,
  countryId: null,
  userAssign: null,
  provinceId: null,
  genderId: null,
  phoneNumber: "",
  email: "",
  cid: "",
  contactName: "",
  taskName: "",
  partnerName: "",
};

const INIT_LABLE = {
  customerIdLabel: "",
  currencyIdLabel: "",
  valueFromLabel: "",
  valueToLabel: "",
  categoryIdLabel: "",
  startTimeLabel: "",
  endTimeLabel: "",
  statusIdLabel: "",
  keywordLabel: "",
  methodIdLabel: "",
  levelIdLabel: "",
  chanelIdLabel: "",
  countryIdLabel: "",
  userAssignLabel: "",
  provinceIdLabel: "",
  genderIdLabel: "",
  phoneNumberLabel: "",
  emailLabel: "",
  cidLabel: "",
  contactNameLabel: "",
  taskNameLabel: "",
};

const INIT_ERROR = {
  customerId: "",
  currencyId: "",
  valueFrom: "",
  valueTo: "",
  categoryId: "",
  startTime: "",
  endTime: "",
  statusId: "",
  methodId: "",
  levelId: "",
  chanelId: "",
  countryId: "",
  userAssign: "",
  provinceId: "",
  genderId: "",
  phoneNumber: "",
  email: "",
  cid: "",
  contactName: "",
  taskName: "",
};

const FormFilterDeal = (props: any) => {
  const trans = useTrans();
  const langGenders = [
    { id: 0, name: trans.contact.female },
    { id: 1, name: trans.contact.male },
  ];
  const {
    openModal,
    setOpenModal,
    title,
    searchCustomer,
    getCurrencyList,
    getCategoryList,
    getStatusList,
    keyword,
    dataFilter,
    customNameStatus,
    getCategory = true,
    type,
    dataLevel,
    dataChanel,
    dataCountry,
    dataUserList,
    getCities,
  } = props;

  let typeDate = "";

  switch (type) {
    case "payment":
      typeDate = trans.home.payment_date;
      break;
    case "order":
      typeDate = trans.home.order_date;
      break;
    case "deal":
      typeDate = trans.deal.forecast_close_date;
      break;
    case "invoice":
      typeDate = trans.invoice.invoice_date;
      break;
    default:
      typeDate = trans.home.sort_by_created_time;
      break;
  }

  const { dataCustomerList } = props.customer;
  const { dataCityList } = props.city;

  const { dataCurrencyList } = props.currency;
  const { dataCategoryList } = props.category;
  const { dataStatusList } = props.status;
  const [dataForm, setDataForm] = useState<DataFormType>(INIT_DATA);
  const [dataLable, setDataLable] = useState<LableFormType>(INIT_LABLE);
  const [dataError, setDataError] = useState(INIT_ERROR);
  const [selectCity, setSelectCity] = useState<any>(true);

  const router = useRouter();
  const params = router.query;

  const queryParams = [
    "customerId",
    "currencyId",
    "categoryId",
    "statusId",
    "startTime",
    "endTime",
    "valueFrom",
    "valueTo",
    "levelId",
    "chanelId",
    "countryId",
    "userAssign",
    "provinceId",
    "genderId",
    "phoneNumber",
    "email",
    "cid",
    "contactName",
    "taskName",
  ];

  const mapQueryToData = (queryKey: any, defaultValue = "") => {
    const value = router.query[queryKey];
    return value ? String(value) : defaultValue;
  };

  const mapQueryToNumber = (queryKey: any, defaultValue = null) => {
    const value = router.query[queryKey];
    return value ? Number(value) : defaultValue;
  };

  const mapQueryToString = (queryKey: any, defaultValue = "") => {
    const value = router.query[`${queryKey}Label`];
    return value ? String(value) : defaultValue;
  };

  useEffect(() => {
    const newDataForm: any = {};
    const newDataLabel: any = {};
    queryParams.forEach((queryKey) => {
      if (queryKey.endsWith("Label")) {
        newDataLabel[`${queryKey}`] = mapQueryToString(queryKey);
      } else if (
        queryKey === "customerId" ||
        queryKey === "currencyId" ||
        queryKey === "categoryId" ||
        queryKey === "statusId" ||
        queryKey === "levelId" ||
        queryKey === "chanelId" ||
        queryKey === "countryId" ||
        queryKey === "userAssign" ||
        queryKey === "provinceId" ||
        queryKey === "genderId"
      ) {
        newDataForm[`${queryKey}`] = mapQueryToNumber(queryKey);
      } else {
        newDataForm[`${queryKey}`] = mapQueryToData(queryKey);
      }
    });
    setDataForm((prevData) => ({ ...prevData, ...newDataForm }));
    setDataLable((prevData) => ({ ...prevData, ...newDataLabel }));
  }, [router.query]);

  useEffect(() => {
    if (openModal) {
      dataCustomerList ?? searchCustomer();
      dataCurrencyList ?? getCurrencyList();
      dataStatusList ?? getCategoryList();
      dataStatusList ?? getStatusList();
    }
  }, [openModal]);

  const CustomerOptions = dataCustomerList?.items?.map(
    (key: { id: any; name: any }) => ({
      id: key?.id,
      value: key?.id,
      label: key?.name,
    })
  );

  const UserAssign = dataUserList?.items?.map(
    (key: { id: any; profile: any }) => ({
      id: Number(key?.id),
      value: Number(key?.id),
      label: key?.profile?.first_name + key?.profile?.last_name,
    })
  );

  const dataCity = dataCityList?.map((key: any) => ({
    id: key?.id,
    name: key?.name,
  }));

  const handleChangeSelect = useCallback(
    (key: any, value: any, label: any, labelValue: any) => {
      let newValue: any;
      if (value) {
        newValue = Number(value);
      } else {
        if (key === "genderId") {
          newValue = "0";
        } else {
          newValue = "";
        }
      }
      setDataForm((prevDataForm) => ({ ...prevDataForm, [key]: newValue }));
      setDataLable((prevDataLable) => ({
        ...prevDataLable,
        [label]: labelValue ?? "",
      }));
    },
    []
  );

  const handleChangeLable = useCallback((key: any, value: any) => {
    setDataLable((prevDataLable) => ({ ...prevDataLable, [key]: value ?? "" }));
  }, []);

  const handleChangeInput = useCallback(
    (key: any, value: any, label: any, labelValue: any) => {
      setDataForm((prevDataForm) => ({ ...prevDataForm, [key]: value ?? "" }));
      setDataLable((prevDataLable) => ({
        ...prevDataLable,
        [label]: labelValue ?? "",
      }));
    },
    []
  );

  useEffect(() => {
    setDataForm({ ...dataForm, keyword: keyword });
  }, [keyword]);

  const handleCloseEditModal = () => {
    router.push({
      pathname: router.route,
    });
    setDataForm(INIT_DATA);
    setDataError(INIT_ERROR);
    setDataLable(INIT_LABLE);
  };

  const handleCloseModal = () => {
    setOpenModal(!openModal);
    setDataLable(INIT_LABLE);
  };

  const checkValueOrNot = (label: any, value: any) => {
    return value ? label : "";
  };

  const handleSubmitForm = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    router.push({
      pathname: router.route,
      query: getParamsToURL({
        ...params,
        keyword: dataForm?.keyword,
        customerId: dataForm?.customerId,
        currencyId: dataForm?.currencyId,
        valueFrom: dataForm?.valueFrom,
        valueTo: dataForm?.valueTo,
        categoryId: dataForm?.categoryId,
        startTime: dataForm?.startTime,
        endTime: dataForm?.endTime,
        statusId: dataForm?.statusId,
        methodId: dataForm?.methodId,
        levelId: dataForm?.levelId,
        chanelId: dataForm?.chanelId,
        countryId: dataForm?.countryId,
        userAssign: dataForm?.userAssign,
        customerIdLabel: checkValueOrNot(
          dataLable?.customerIdLabel,
          dataForm?.customerId
        ),
        currencyIdLabel: checkValueOrNot(
          dataLable?.currencyIdLabel,
          dataForm?.currencyId
        ),
        valueFromLabel: checkValueOrNot(
          dataLable?.valueFromLabel,
          dataForm?.valueFrom
        ),
        valueToLabel: checkValueOrNot(
          dataLable?.valueToLabel,
          dataForm?.valueTo
        ),
        categoryIdLabel: checkValueOrNot(
          dataLable?.categoryIdLabel,
          dataForm?.categoryId
        ),
        startTimeLabel: checkValueOrNot(
          dataLable?.startTimeLabel,
          dataForm?.startTime
        ),
        endTimeLabel: checkValueOrNot(
          dataLable?.endTimeLabel,
          dataCategoryList?.endTime
        ),
        statusIdLabel: checkValueOrNot(
          dataLable?.statusIdLabel,
          dataForm?.statusId
        ),
        keywordLabel: checkValueOrNot(
          dataLable?.keywordLabel,
          dataForm?.keyword
        ),
        methodIdLabel: checkValueOrNot(
          dataLable?.methodIdLabel,
          dataForm?.methodId
        ),
        levelIdLabel: checkValueOrNot(
          dataLable?.levelIdLabel,
          dataForm?.levelId
        ),
        chanelIdLabel: checkValueOrNot(
          dataLable?.chanelIdLabel,
          dataForm?.chanelId
        ),
        countryIdLabel: checkValueOrNot(
          dataLable?.countryIdLabel,
          dataForm?.countryId
        ),
        userAssignLabel: checkValueOrNot(
          dataLable?.userAssignLabel,
          dataForm?.userAssign
        ),
        provinceIdLabel: checkValueOrNot(
          dataLable?.provinceIdLabel,
          dataForm?.provinceId
        ),
        genderIdLabel: checkValueOrNot(
          dataLable?.genderIdLabel,
          dataForm?.genderId
        ),
        genderId: dataForm?.genderId,
        phoneNumber: dataForm?.phoneNumber,
        phoneNumberLabel: checkValueOrNot(
          dataLable?.phoneNumberLabel,
          dataForm?.phoneNumber
        ),
        email: dataForm?.email,
        emailLabel: checkValueOrNot(dataLable?.emailLabel, dataForm?.email),
        cid: dataForm?.cid,
        cidLabel: checkValueOrNot(dataLable?.cidLabel, dataForm?.cid),
        contactName: dataForm?.contactName,
        contactNameLabel: checkValueOrNot(
          dataLable?.contactNameLabel,
          dataForm?.contactName
        ),
        taskName: dataForm?.taskName,
        taskNameLabel: checkValueOrNot(
          dataLable?.taskNameLabel,
          dataForm?.taskName
        ),
        partnerName: dataForm?.partnerName,
        [keyPage]: pageDefault,
      }),
    });
    setOpenModal(false);
  };

  useEffect(() => {
    if (dataForm.countryId) {
      getCities(dataForm.countryId);
      setSelectCity(false);
      setDataForm({
        ...dataForm,
        provinceId: null,
      });
    }
  }, [dataForm.countryId]);

  return (
    <Dialog
      open={openModal}
      onClose={handleCloseModal}
      scroll="body"
      data-width={10}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      className={styles["dialog-Form"]}
      classes={{
        container: "form-dialog-container",
        paper: "filter-form-dialog",
      }}
    >
      <DialogTitle className={styles["dialog-title"]} id="scroll-dialog-title">
        <Typography variant="h6">{title}</Typography>
        <Button onClick={handleCloseModal}>
          <Close />
        </Button>
      </DialogTitle>
      <Divider />
      <DialogContent className={styles["deal-filter-box"]}>
        {type !== "task" ||
          (type !== "partner" && (
            <>
              <div className={styles["deal-filter-header"]}>
                {trans.menu.customer}
              </div>
              <Box className={styles["deal-filter-items"]}>
                <SelectInput
                  labelText={trans.customer.customer_name}
                  keyword="customerId"
                  labelKey="customerIdLabel"
                  keyMenuItem="id"
                  keyValue="name"
                  options={CustomerOptions}
                  value={dataForm?.customerId}
                  handleChange={handleChangeSelect}
                  isCreateNew={false}
                  formFilter={true}
                  handleChangeLable={handleChangeLable}
                />
              </Box>
            </>
          ))}
        {type == "task" && (
          <>
            <div className={styles["deal-filter-header"]}>
              {trans.task.task_name}
            </div>
            <Box className={styles["deal-filter-items"]}>
              <InputBase
                keyword="taskName"
                placeholder={trans.task.task_name}
                value={dataForm?.taskName}
                handleChange={handleChangeInput}
                labelKey="taskNameLabel"
              />
            </Box>
            <div className={styles["deal-filter-header"]}>
              {trans.home.task_infor}
            </div>
            <Box className={styles["deal-filter-items"]}>
              <SelectInput
                labelText={trans.customer.user_assigned}
                keyword="userAssign"
                keyMenuItem="id"
                keyValue="name"
                options={UserAssign}
                value={dataForm?.userAssign}
                handleChange={handleChangeSelect}
                handleChangeLable={handleChangeLable}
                isCreateNew={false}
                //labelKey="userAssignLabel"
              />
            </Box>
            <Box className={styles["deal-filter-items"]}>
              <SelectDefault
                labelText={trans.order.status}
                keyword={"statusId"}
                //labelKey={"statusIdLabel"}
                keyMenuItem="id"
                keyValue="name"
                data={dataFilter}
                value={dataForm?.statusId}
                handleChange={handleChangeSelect}
                handleChangeLable={handleChangeLable}
              />
            </Box>
            <div className={styles["deal-filter-header"]}>
              {trans.home.task_date}
            </div>
            <Box className={styles["deal-filter-items"]}>
              <DatePickerDefault
                labelText={trans.order.start_date}
                keyword="startTime"
                handleChange={handleChangeInput}
                handleChangeLable={handleChangeLable}
                value={dataForm?.startTime}
                maxDate={dataForm?.endTime}
                // labelKey="startTimeLabel"
              />
            </Box>
            <Box className={styles["deal-filter-items"]}>
              <DatePickerDefault
                labelText={trans.deal.end_time}
                keyword="endTime"
                handleChange={handleChangeInput}
                handleChangeLable={handleChangeLable}
                value={dataForm?.endTime}
                minDate={dataForm?.startTime}
                // labelKey="endTimeLabel"
              />
            </Box>
          </>
        )}
        {type == "partner" && (
          <>
            <div className={styles["deal-filter-header"]}>
              {trans.partner.partner_name}
            </div>
            <Box className={styles["deal-filter-items"]}>
              <InputBase
                keyword="keyword"
                placeholder={trans.partner.partner_name}
                value={dataForm?.keyword}
                handleChange={handleChangeInput}
                // labelKey="taskNameLabel"
              />
            </Box>
          </>
        )}
        {type !== "customer" &&
          type !== "contact" &&
          type !== "task" &&
          type !== "partner" && (
            <>
              <div className={styles["deal-filter-header"]}>
                {trans.deal.search_info}
              </div>
              <Box className={styles["deal-filter-items"]}>
                <SelectDefault
                  labelText={trans.deal.value}
                  keyword="currencyId"
                  keyMenuItem="id"
                  keyValue="name"
                  data={dataCurrencyList}
                  value={dataForm?.currencyId}
                  handleChange={handleChangeInput}
                  handleChangeLable={handleChangeLable}
                  labelKey="currencyIdLabel"
                />
              </Box>
              <Box className={styles["deal-filter-items"]}>
                <InputFormatNumber
                  keyword="valueFrom"
                  type="text"
                  placeholder={trans.deal.price_from}
                  handleChange={handleChangeInput}
                  handleChangeLable={handleChangeLable}
                  value={dataForm?.valueFrom}
                  labelKey="valueFromLabel"
                />
              </Box>
              <Box className={styles["deal-filter-items"]}>
                <InputFormatNumber
                  keyword="valueTo"
                  type="text"
                  placeholder={trans.deal.price_to}
                  handleChange={handleChangeInput}
                  handleChangeLable={handleChangeLable}
                  value={dataForm?.valueTo}
                  labelKey="valueToLabel"
                />
              </Box>
              {getCategory && (
                <Box className={styles["deal-filter-items"]}>
                  <SelectDefault
                    labelText={trans.deal.category}
                    keyword="categoryId"
                    keyMenuItem="id"
                    keyValue="name"
                    data={dataCategoryList?.items}
                    handleChange={handleChangeInput}
                    handleChangeLable={handleChangeLable}
                    value={dataForm?.categoryId}
                    labelKey="categoryIdLabel"
                  />
                </Box>
              )}
              <Box className={styles["deal-filter-items"]}>
                <SelectDefault
                  labelText={
                    customNameStatus ? customNameStatus : trans.deal.status
                  }
                  //labelText={ trans.payment.payment_method_}
                  keyword={customNameStatus ? "methodId" : "statusId"}
                  labelKey={customNameStatus ? "methodIdLabel" : ""}
                  keyMenuItem="id"
                  keyValue="name"
                  data={dataFilter}
                  value={
                    customNameStatus ? dataForm?.methodId : dataForm?.statusId
                  }
                  handleChange={handleChangeSelect}
                  handleChangeLable={handleChangeLable}
                />
              </Box>
              {type && (
                <div className={styles["deal-filter-header"]}>{typeDate}</div>
              )}
              <Box className={styles["deal-filter-items"]}>
                <DatePickerDefault
                  labelText={trans.deal.start_time}
                  keyword="startTime"
                  handleChange={handleChangeInput}
                  handleChangeLable={handleChangeLable}
                  value={dataForm?.startTime}
                  maxDate={dataForm?.endTime}
                  labelKey="startTimeLabel"
                />
              </Box>
              <Box className={styles["deal-filter-items"]}>
                <DatePickerDefault
                  labelText={trans.deal.end_time}
                  keyword="endTime"
                  handleChange={handleChangeInput}
                  handleChangeLable={handleChangeLable}
                  value={dataForm?.endTime}
                  minDate={dataForm?.startTime}
                  labelKey="endTimeLabel"
                />
              </Box>
            </>
          )}
        {type == "customer" && (
          <>
            <Box className={styles["deal-filter-items"]}>
              <InputBase
                labelText="CID"
                keyword="cid"
                placeholder="CID"
                value={dataForm?.cid}
                handleChange={handleChangeInput}
                labelKey="cidLabel"
              />
            </Box>
            <div className={styles["labelText"]}>{trans.customer.priority}</div>
            <MutiSelect
              labelText={trans.customer.priority}
              filterBox={true}
              selectOption={CUSTOMER_PRIORITY_LIST}
              object="listPriority"
              placeholder={trans.customer.all_priority}
            />
            <Box className={styles["deal-filter-items"]}>
              <SelectDefault
                labelText={trans.customer.level_id}
                keyword="levelId"
                keyMenuItem="id"
                keyValue="name"
                data={dataLevel}
                value={dataForm?.levelId}
                handleChange={handleChangeInput}
                handleChangeLable={handleChangeLable}
                //labelKey="levelIdLabel"
              />
            </Box>
            <Box className={styles["deal-filter-items"]}>
              <SelectDefault
                labelText={trans.sale_channel.sale_channel}
                keyword="chanelId"
                keyMenuItem="id"
                keyValue="name"
                data={dataChanel}
                value={dataForm?.chanelId}
                handleChange={handleChangeInput}
                handleChangeLable={handleChangeLable}
                //labelKey="levelIdLabel"
              />
            </Box>
            <Box className={styles["deal-filter-items"]}>
              <SelectDefault
                labelText={trans.country.country}
                keyword="countryId"
                keyMenuItem="id"
                keyValue="name"
                data={dataCountry}
                value={dataForm?.countryId}
                handleChange={handleChangeInput}
                handleChangeLable={handleChangeLable}
                //labelKey="countryIdLabel"
              />
            </Box>
            <Box className={styles["deal-filter-items"]}>
              <SelectDefault
                labelText={trans.customer.province}
                keyword="provinceId"
                keyMenuItem="id"
                keyValue="name"
                data={dataCity}
                value={dataForm?.provinceId}
                handleChange={handleChangeInput}
                handleChangeLable={handleChangeLable}
                disabled={selectCity}
                //labelKey="provinceIdLabel"
              />
            </Box>
            <Box className={styles["deal-filter-items"]}>
              <SelectInput
                labelText={trans.customer.user_assigned}
                keyword="userAssign"
                keyMenuItem="id"
                keyValue="name"
                options={UserAssign}
                value={dataForm?.userAssign}
                handleChange={handleChangeSelect}
                handleChangeLable={handleChangeLable}
                isCreateNew={false}
                //labelKey="userAssignLabel"
              />
            </Box>
          </>
        )}
        {type == "contact" && (
          <>
            {/* <Box className={styles["deal-filter-items"]}>
              <InputBase
                labelText="Contact Name"
                keyword="contactName"
                placeholder="contact name"
                value={dataForm?.contactName}
                handleChange={handleChangeInput}
                labelKey="contactNameLabel"
              />
            </Box> */}
            <Box className={styles["deal-filter-items"]}>
              <SelectDefault
                labelText={trans.contact.gender}
                keyword="genderId"
                keyMenuItem="id"
                keyValue="name"
                data={langGenders}
                value={dataForm?.genderId}
                handleChange={handleChangeSelect}
                handleChangeLable={handleChangeLable}
                labelKey="genderIdLabel"
              />
            </Box>
            <Box className={styles["deal-filter-items"]}>
              <InputBase
                labelText={trans.contact.phone_number}
                keyword="phoneNumber"
                placeholder={trans.contact.phone_number}
                value={dataForm?.phoneNumber}
                handleChange={handleChangeInput}
                labelKey="phoneNumberLabel"
              />
            </Box>
            <Box className={styles["deal-filter-items"]}>
              <InputBase
                labelText={trans.contact.email}
                keyword="email"
                placeholder={trans.contact.email}
                value={dataForm?.email}
                handleChange={handleChangeInput}
                labelKey="emailLabel"
              />
            </Box>
          </>
        )}
        {type === "partner" && (
          <>
            <div className={styles["labelText"]}>{trans.customer.priority}</div>
            <MutiSelect
              labelText={trans.customer.priority}
              filterBox={true}
              selectOption={CUSTOMER_PRIORITY_LIST}
              object="listPriority"
              placeholder={trans.customer.all_priority}
            />
            <Box className={styles["deal-filter-items"]}>
              <SelectInput
                labelText={trans.customer.user_assigned}
                keyword="userAssign"
                keyMenuItem="id"
                keyValue="name"
                options={UserAssign}
                value={dataForm?.userAssign}
                handleChange={handleChangeSelect}
                handleChangeLable={handleChangeLable}
                isCreateNew={false}
                //labelKey="userAssignLabel"
              />
            </Box>
            <Box sx={{ height: "400px" }}></Box>
          </>
        )}
      </DialogContent>
      <DialogActions className={styles["dialog-actions"]}>
        <Button className="btn-save" onClick={handleSubmitForm}>
          {trans.customer.apply}
        </Button>
        <Button className="btn-cancel" onClick={handleCloseEditModal}>
          {trans.customer.reset}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state: any) => ({
  customer: state.customer,
  currency: state.currency,
  category: state.category,
  status: state.status,
  city: state?.city,
});

const mapDispatchToProps = {
  searchCustomer,
  getCurrencyList,
  getCategoryList,
  getStatusList,
  createCustomer,
  getCities,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilterDeal);
