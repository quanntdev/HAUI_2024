import {
  Box,
  Grid,
  CardContent,
  Typography,
  Table,
  TableBody,
  Paper,
  IconButton,
  Button,
  TableHead,
  TableCell,
  TableRow,
  Card,
  TableContainer,
  Stack,
  Hidden,
  TextField,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { NextPage } from "next";
import styles from "./styles.module.scss";
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import EditIcon from "@mui/icons-material/Edit";
import { clearData, updateDeal } from "../../redux/actions/deal";
import { getPayment } from "../../redux/actions/payment";
import { getOrderListByDealId } from "../../redux/actions/order";
import { getCategoryList } from "../../redux/actions/category";
import {
  getInvoiceStatusList,
  getDetailInvoice,
  updateStatusInvoices,
  updateInvoice,
  deleteInvoice,
  updateInvoiceCode,
} from "../../redux/actions/invoice";
import { getCurrencyList } from "../../redux/actions/currency";
import Breadcrumb from "../../components/Breadcumb";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import styled from "styled-components";
import { getStatusList } from "../../redux/actions/status";
import {
  FOMAT_DATE,
  InvoiceStatus,
  REGEX_NUMBER,
  rowsPerPage,
  statusCode,
  CREATE_ORDER_STATUS,
  REQUEST_SENDING,
  PAID,
  OVER_ORDER_STATUS,
} from "../../constants";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import ModalUpdateStatusInvoice from "../../components/Modal/ModalUpdateStatusInvoice";
import ModalReIssue from "../../components/Modal/ModalReIssue";
import InputBase from "../../components/Input/InputBase";
import SaveIcon from "@mui/icons-material/Save";
import SelectDefault from "../../components/Input/SelectDefault";
import { getCountries } from "../../redux/actions/countries";
import { getCities } from "../../redux/actions/city";
import DatePickerDefault from "../../components/Input/DatePickerDefault";
import { getObjectTask } from "../../redux/actions/task";
import FormUpdateDetailInvoice from "../../components/Invoice/FormUpdateDetailInvoice";
import removeCommaCurrencyValue from "../../utility/removeCommaCurrencyValue";
import FormCreatePaymentFromInvoiceDetail from "../../components/Payment/FormCreatePaymentFromInvoiceDetail";
import { Close } from "@mui/icons-material";
import getTotalValueInvoiceOrderItem from "../../utility/getTotalValueInvoiceOrderItem";
import InputFormatNumber from "../../components/Input/InputFormatNumber";
import ClearIcon from "@mui/icons-material/Clear";
import FormCreateTask from "../../components/Task/FormCreateTask";
import TabPanelTaskList from "../../components/TabList/TabPanelTaskList";
import { IconFileInvoice } from "@tabler/icons";
import HeadMeta from "../../components/HeadMeta";
import LogNote from "../../components/LogNote";
import { getDetailProfile } from "../../redux/actions/profile";
import { getFirstValueInObject } from "../../helpers";
import TabPanelPaymentList from "../../components/TabList/TabPanelPaymentList";
import ModalUpdateCountry from "../../components/Modal/ModalUpdateCountry";
import removeQueryParam from "../../utility/removeQueryParam";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModalDeleteNotification from "../../components/Modal/ModalDeleteNotification";
import ModalDelete from "../../components/Modal/ModalDelete";
import useTrans from "../../utils/useTran";
import moment from "moment";
import FormCreatePaymentStripe from "./FormCreatePaymentStripe";

const AntTabs = styled(Tabs)({});
const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    "&.Mui-selected": {
      clipPath: "polygon(8% 50%, 0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
      backgroundColor: "rgb(216, 247, 213)",
    },
  })
);

function TabPanel(props: any) {
  const { children, value, index } = props;
  return (
    <div>
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

type DataFormOrderItemType = {
  id: string;
  uid: string;
  name: string;
  value: string;
  tax_rate: string;
  total_value: string;
};

const INIT_DATA_ORDER_ITEM = {
  id: "",
  uid: "",
  name: "",
  value: "",
  tax_rate: "",
  total_value: "",
};

const EDIT_CODE = {
  code: "",
};

const InvoiceDetail: NextPage = (props: any) => {
  const trans = useTrans();
  const {
    getDetailInvoice,
    clearData,
    getCities,
    getInvoiceStatusList,
    updateStatusInvoices,
    getCountries,
    updateInvoice,
    errors,
    getObjectTask,
    getDetailProfile,
    updateInvoiceCode,
    deleteInvoice,
  } = props;
  const {
    dataInvoiceStatusList,
    dataDetailInvoice,
    dataUpdateStatusInvoice,
    dataUpdateInvoice,
    dataUpdateInvoiceCode,
    error,
  } = props.invoice;
  const { dataTaskObject, dataCreateTask } = props.task;
  const { dataDetailProfile } = props?.profile;
  const { dataDeleteInvoice } = props?.invoice;
  const tabRef = useRef<HTMLDivElement>(null);
  const [tabValue, setTabValue] = useState(0);
  const { dataCityList } = props.city;
  const { dataCountryList } = props.country;
  const router = useRouter();

  console.log(router.query)
  const q: any = useMemo(() => router.query, [router]);
  const invoiceId = q?.id || "";
  const [pageOrderItem, setPageOrderItem] = useState<number>(1);
  const INIT_DATA = {
    customer_name: dataDetailInvoice?.customer_name ?? "",
    postal_code: dataDetailInvoice?.postal_code ?? "",
    address: dataDetailInvoice?.address ?? "",
    due_date: dataDetailInvoice?.due_date ?? "",
    start_date: dataDetailInvoice?.start_date ?? "",
    country_id: +dataDetailInvoice?.country?.id ?? "",
    province_id: +dataDetailInvoice?.city?.id ?? "",
    invoice_order_items: dataDetailInvoice?.invoiceOrderItems?.map(
      (item: any) => ({
        ...item,
        tax_rate: +item?.tax_rate,
        total_value: +item?.total_value,
        value: +item?.value,
      })
    ),
  };
  const INIT_ERROR = {
    customer_name: "",
    postal_code: "",
    address: "",
    due_date: "",
    start_date: "",
    country_id: "",
    province_id: "",
    invoice_order_items: "",
  };
  const [dataForm, setDataForm] = useState<any>(INIT_DATA);
  const [value, setValue] = useState(0);
  const [values, setValues] = useState<any>(0);
  const [statusUpdate, setStatusUpdate] = useState<any>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openUpdateInvoice, setOpenUpdateInvoice] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openReIssueModal, setOpenReIssueModal] = useState<boolean>(false);
  const [newLineOrderItem, setNewLineOrderItem] = useState<any>(null);
  const [orderItemList, setOrderItemList] = useState<DataFormOrderItemType[]>(
    []
  );
  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalTaxRate, setTotalTaxRate] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [dataFormOrderItem, setDataFormOrderItem] =
    useState<DataFormOrderItemType>(INIT_DATA_ORDER_ITEM);
  const [dataError, setDataError] = useState(INIT_ERROR);
  const [taxRateEachRowError, setTaxRateEachRowError] =
    useState<boolean>(false);
  const [editOrderItem, setEditOrderItem] = useState<boolean>(false);
  const [openTaskFormModal, setOpenTaskModal] = useState<boolean>(false);
  const [uid, setUid] = useState<string>("");
  const [openDeleteInvoiceModal, setOpenDeleteInvoiceModal] =
    useState<boolean>(false);
  const [openModalDeleteNotification, setOpenModalDeleteNotification] =
    useState<boolean>(false);
  const [isLoggedInUserId, setIsLoggedInUserId] = useState<any>();
  const [changeInvoiceCode, setChangeInvoiceCode] = useState<boolean>(false);
  const [formEditCode, setFormEditCode] = useState<any>(EDIT_CODE);
  const [applyData, setApplyData] = useState<boolean>(true);
  const [openModalUpdateCountry, setOpenModalUpdateCountry] =
    useState<boolean>(false);

  const handleChangeValue = (event: any, newValue: any) => {
    if (
      newValue === CREATE_ORDER_STATUS &&
      dataDetailInvoice?.status === CREATE_ORDER_STATUS
    ) {
      setOpenDeleteModal(true);
      setStatusUpdate(newValue + 1);
      setValue(newValue);
    }
  };

  useEffect(() => {
    if (dataDetailInvoice) {
      setFormEditCode({ ...formEditCode, code: dataDetailInvoice?.code });
    }
  }, [invoiceId, dataDetailInvoice]);

  const handleChangeInvoiceCode = () => {
    setChangeInvoiceCode(true);
  };

  useEffect(() => {
    if (dataDeleteInvoice && !openDeleteModal) {
      router.push(`/invoices`);
    }
  }, [dataDeleteInvoice, openDeleteModal]);

  useEffect(() => {
    if (
      dataCreateTask ||
      dataUpdateStatusInvoice ||
      dataUpdateInvoice ||
      dataUpdateInvoiceCode ||
      (tabValue && tabValue !== 0)
    ) {
      if (router?.query?.view) {
        removeQueryParam(router, ["view"]);
      }
    }
  }, [
    dataCreateTask,
    dataUpdateStatusInvoice,
    dataUpdateInvoice,
    dataUpdateInvoiceCode,
    tabValue,
  ]);

  useEffect(() => {
    if (changeInvoiceCode) {
      setOpenModalUpdateCountry(true);
    }
  }, [changeInvoiceCode]);

  const handleSaveInvoiceCode = () => {
    if (formEditCode?.code != "") {
      if (formEditCode?.code !== dataDetailInvoice?.code) {
        updateInvoiceCode(formEditCode, invoiceId);
      }
      setChangeInvoiceCode(false);
    }
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    removeQueryParam(router, ["view", "tab"]);
    setTabValue(newValue);
    setApplyData(false);
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        tab: newValue,
      },
    });
  };

  function setTabId(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const getTaxRate = (value: number, taxRate: number) => {
    if (taxRate != 0) return value * (taxRate / 100);
    return 0;
  };

  const addNewLine = useCallback(() => {
    if (!newLineOrderItem) {
      addFormNewOrderItem();
    }
  }, [newLineOrderItem]);

  const addFormNewOrderItem = function () {
    setNewLineOrderItem(
      <FormUpdateDetailInvoice
        setNewLineOrderItem={setNewLineOrderItem}
        dataDetailInvoice={dataDetailInvoice}
        orderItemList={orderItemList}
        indexOrderItem={orderItemList?.length ?? ""}
      />
    );
  };

  useEffect(() => {
    if (invoiceId && applyData) {
      switch (tabValue) {
        case 2: {
          getObjectTask(
            `limit=${rowsPerPage}&offset=${
              (pageOrderItem - 1) * rowsPerPage
            }&invoiceId=${invoiceId}`
          );
          break;
        }
        default: {
          break;
        }
      }
    }
  }, [tabValue, invoiceId]);

  useEffect(() => {
    if (dataCreateTask) {
      getObjectTask(
        `limit=${rowsPerPage}&offset=${
          (pageOrderItem - 1) * rowsPerPage
        }&invoiceId=${invoiceId}`
      );
    }
  }, [dataCreateTask]);

  const handleChangeSelect = function (key: any, value: any) {
    if (key === "country_id") getCities(value);
    setDataForm({ ...dataForm, [key]: Number(value) });
  };

  const handleChangeEditInvoice = function () {
    setOpenUpdateInvoice(!openUpdateInvoice);
  };

  useEffect(() => {
    if (errors) {
      setDataError({ ...INIT_ERROR, ...errors });
      setOpenUpdateInvoice(!openUpdateInvoice);
    }
  }, [errors]);

  const handleChangeUpdateInvoice = () => {
    setDataError({ ...INIT_ERROR });
    updateInvoice(dataForm, invoiceId);
    setOpenUpdateInvoice(!openUpdateInvoice);
  };

  const handleChangeInput = (key: any, value: any) => {
    if (key == "tax_rate" || key == "name" || key == "value")
      setDataFormOrderItem({ ...dataFormOrderItem, [key]: value ?? "" });
    else setDataForm({ ...dataForm, [key]: value ?? "" });
  };

  const handleChangeCode = (value: any) => {
    setFormEditCode({ ...formEditCode, code: value ?? "" });
  };

  const handleCodeChange = useCallback(
    (e: any) => {
      handleChangeCode(e.target.value);
    },
    [handleChangeCode]
  );

  const handleDeleteOrderItem = (uid: number) => {
    const newOrderItemList = [...orderItemList];
    const index = newOrderItemList.findIndex((item: any) => item.uid == uid);
    if (index > -1) newOrderItemList.splice(index, 1);
    setOrderItemList(newOrderItemList);
  };

  const handleEditOrderItem = (uid: string) => {
    setUid(uid);
    setDataFormOrderItem({
      ...INIT_DATA_ORDER_ITEM,
      ...orderItemList?.find((item: any) => item?.uid == uid),
    });
    setEditOrderItem(true);
  };

  const handleCloseEditForm = () => {
    setEditOrderItem(false);
  };

  const updateOrderItemEachRow = (uid: string) => {
    const newOrderItemList = [...orderItemList];
    if (
      dataFormOrderItem?.tax_rate != null &&
      REGEX_NUMBER.test(dataFormOrderItem?.tax_rate?.toString())
    ) {
      setTaxRateEachRowError(false);
      newOrderItemList.forEach((item: any) => {
        if (Number(item?.uid) === Number(uid)) {
          item["name"] = dataFormOrderItem?.name;
          item["value"] = dataFormOrderItem?.value;
          item["tax_rate"] = Number(dataFormOrderItem?.tax_rate);
          item["total_value"] = getTotalValueInvoiceOrderItem(
            item["value"],
            Number(dataFormOrderItem?.tax_rate)
          );
        }
      });
      setOrderItemList(newOrderItemList);
      setDataFormOrderItem(INIT_DATA_ORDER_ITEM);
      setEditOrderItem(false);
    } else setTaxRateEachRowError(true);
  };

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  useEffect(() => {
    if (
      (invoiceId && applyData) ||
      (invoiceId && applyData && localStorage.getItem("languages"))
    ) {
      getCountries();
      getInvoiceStatusList();
      getDetailInvoice(invoiceId, `limit=6&offset=0`);
    }
  }, [invoiceId, localStorage.getItem("languages")]);

  useEffect(() => {
    if (dataUpdateStatusInvoice)
      setValues(dataUpdateStatusInvoice?.data?.status - 1);
    if (invoiceId) getDetailInvoice(invoiceId, `limit=6&offset=0`);
  }, [dataUpdateStatusInvoice]);

  useEffect(() => {
    setDataForm({
      ...INIT_DATA,
    });
    getCities(dataDetailInvoice?.country?.id);
    setOrderItemList(
      dataDetailInvoice?.invoiceOrderItems?.map((item: any) => {
        return {
          id: Number(item?.id),
          uid: item?.id,
          name: item?.name,
          value: Number(item?.value),
          tax_rate: Number(item?.tax_rate),
          total_value: Number(item?.total_value),
        };
      })
    );
  }, [dataDetailInvoice]);

  useEffect(() => {
    if (router?.query?.tab) {
      if (router?.query?.tab == "lognote") {
        setTabValue(0);
      } else {
        setTabValue(Number(router?.query?.tab));
      }
    }
  }, []);

  useEffect(() => {
    clearData("dataUpdateInvoice");
    if (invoiceId) getDetailInvoice(invoiceId, `limit=6&offset=0`);
  }, [dataUpdateInvoice, dataUpdateInvoiceCode]);

  const handleReissue = () => {
    setOpenReIssueModal(true);
    if (values === 2) {
      setStatusUpdate(values - 1);
    } else {
      setStatusUpdate(values);
    }
  };

  useEffect(() => {
    let newTotalValue = 0;
    let newTotalTaxRate = 0;
    orderItemList?.map((item: any) => {
      newTotalValue += removeCommaCurrencyValue(item["value"].toString());
      newTotalTaxRate += getTaxRate(
        removeCommaCurrencyValue(item["value"].toString()),
        Number(item["tax_rate"])
      );
    });
    setTotalValue(
      Number(
        newTotalValue.toLocaleString("en-US", {
          maximumFractionDigits: 2,
          useGrouping: false,
        })
      )
    );
    setTotalTaxRate(
      Number(
        newTotalTaxRate.toLocaleString("en-US", {
          maximumFractionDigits: 2,
          useGrouping: false,
        })
      )
    );
    setTotal(
      newTotalValue +
        Number(
          newTotalTaxRate.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            useGrouping: false,
          })
        )
    );
    const newOrderItemList = orderItemList?.map(({ uid, ...rest }) => {
      return {
        id: Number(rest?.id),
        name: rest.name,
        value: removeCommaCurrencyValue(rest.value.toString()),
        tax_rate: Number(rest.tax_rate),
        total_value: getTotalValueInvoiceOrderItem(rest.value, rest.tax_rate),
      };
    });
    setDataForm({
      ...dataForm,
      invoice_order_items: newOrderItemList,
    });
  }, [orderItemList, dataFormOrderItem, invoiceId]);

  const redirectToCustomerDetail = function () {
    router.push(`/customer/${dataDetailInvoice?.order?.customer?.id}`);
  };

  useEffect(() => {
    setValues(dataDetailInvoice?.status - 1);
  }, [dataDetailInvoice]);

  useEffect(() => {
    if (
      error?.response?.data != undefined &&
      error?.response?.data.statusCode == statusCode.NOT_FOUND
    )
      router.push("/404");
  }, [error?.response?.data]);

  const handleOpenFormTask = function (action: boolean) {
    setOpenTaskModal(action);
  };

  const handleModalDeleteInvoice = useCallback(() => {
    deleteInvoice(invoiceId);
  }, [deleteInvoice, invoiceId]);

  const handleDeleteInvoice = useCallback(() => {
    if (dataDetailInvoice?.payment.length || dataTaskObject?.items.length) {
      setOpenModalDeleteNotification(true);
    } else {
      setOpenDeleteInvoiceModal(true);
    }
  }, [dataDetailInvoice, dataTaskObject]);

  useEffect(() => {
    if (
      dataDetailInvoice?.status === REQUEST_SENDING ||
      dataDetailInvoice?.status === PAID
    ) {
      setOpenUpdateInvoice(false);
    }
  }, [invoiceId, errors]);

  const handleToOrderDetail = () => {
    const id = dataDetailInvoice?.order.id;
    window.open(`/order/${id}/`, "_blank");
  };

  if (invoiceId) {
    return (
      <div>
        <HeadMeta title="Invoice" param={dataDetailInvoice?.code} />
        <Breadcrumb
          title={dataDetailInvoice?.code}
          icon={<IconFileInvoice className={styles["icons"]} />}
        />
        <Box className={styles["invoice-wrapper"]}>
          <Grid container spacing={1}>
            <Grid item xs={6} md={12}>
              <Paper className={styles["invoice-info"]}>
                <CardContent className={styles["invoice-card"]}>
                  <Grid
                    className={styles["grid-invoice"]}
                    container
                    spacing={1}
                  >
                    <Grid item sm={6}>
                      <Grid container spacing={3}>
                        {(dataDetailInvoice?.status === OVER_ORDER_STATUS ||
                          dataDetailInvoice?.status === REQUEST_SENDING) && (
                          <Grid item className={styles["invoice-right"]}>
                            <Grid textAlign="left" item xs={12}>
                              <Button
                                onClick={() => handleReissue()}
                                className={styles["text-detail-create"]}
                              >
                                {trans.invoice.re_issue}
                              </Button>
                            </Grid>
                          </Grid>
                        )}
                        {(dataDetailInvoice?.status === REQUEST_SENDING ||
                          dataDetailInvoice?.status === PAID ||
                          dataDetailInvoice?.status === OVER_ORDER_STATUS ||
                          dataDetailInvoice?.status ===
                            CREATE_ORDER_STATUS) && (
                          <Grid item className={styles["invoice-right"]}>
                            <Grid textAlign="left" item xs={12}>
                              <Button
                                className={`${styles["text-detail-create"]} btn-create`}
                                onClick={() => handleOpenModal()}
                                style={{marginBottom: "20px"}}
                              >
                                {trans.invoice.add_payment}
                              </Button>
                              <FormCreatePaymentStripe
                                openModal={openModal}
                                setOpenModal={setOpenModal}
                                dataDetailInvoice={dataDetailInvoice}
                                checkOutToken={router.query?.checkout_token}
                              />
                            </Grid>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                    <Grid item sm={6}>
                      <AntTabs
                        TabIndicatorProps={{
                          style: {
                            backgroundColor: "white",
                          },
                        }}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                        value={values}
                        onChange={handleChangeValue}
                        className={styles["box-tab"]}
                      >
                        {[]?.map(
                          (invoice: any, index: number) => {
                            return (
                              <StyledTab
                                key={index}
                                className={
                                  index == 0 || index == 1
                                    ? ""
                                    : styles["tab-panels"]
                                }
                                label={invoice?.[index + 1]}
                                id={index}
                              />
                            );
                          }
                        )}
                      </AntTabs>
                    </Grid>
                  </Grid>

                  <Grid container spacing={1}>
                    <Grid item sm={6}></Grid>
                    <Grid item sm={6} style={{ textAlign: "right" }}>
                      {/* <IconButton size="small" color="error">
                        <Tooltip
                          title="Delete"
                          onClick={handleDeleteInvoice}
                          style={{
                            display: "inline-block",
                            marginRight: "4px",
                          }}
                        >
                          <DeleteOutlineOutlinedIcon />
                        </Tooltip>
                      </IconButton> */}
                    </Grid>
                  </Grid>

                  <Grid className={styles["grid-container"]} container>
                    <Grid className={styles["grid-invoice"]} item sm={6}>
                      <Box className={styles["invoice-right"]}>
                        <Grid textAlign="left" item xs={12}>
                          <Typography className={styles["box-title-invoice"]}>
                            {trans.menu.invoice}
                          </Typography>
                          <Typography className={styles["box-text-invoice"]}>
                            {!changeInvoiceCode ? dataDetailInvoice?.code : ""}
                            {changeInvoiceCode && (
                              <TextField
                                id="standard-basic"
                                className={styles["edit-invoice-textField"]}
                                variant="standard"
                                value={formEditCode?.code}
                                onChange={handleCodeChange}
                              />
                            )}
                            {/* {!changeInvoiceCode &&
                              dataDetailInvoice?.status ==
                                InvoiceStatus.CREATE && (
                                <Button
                                  className={styles["edit-invoice-code"]}
                                  onClick={handleChangeInvoiceCode}
                                >
                                  <EditIcon />
                                </Button>
                              )} */}
                            {changeInvoiceCode &&
                              dataDetailInvoice?.status == 1 && (
                                <Button
                                  className={styles["edit-invoice-code"]}
                                  onClick={handleSaveInvoiceCode}
                                >
                                  <SaveIcon />
                                </Button>
                              )}
                          </Typography>
                        </Grid>
                      </Box>
                      <Box sx={{ paddingBottom: "30px", marginTop: "10px" }}>
                        <span style={{ fontWeight: "bold", color: "#455a64" }}>
                          {trans.order.order_name}
                        </span>

                        <span
                          onClick={handleToOrderDetail}
                          style={{
                            color: "#1976d2",
                            cursor: "pointer",
                            display: "inline-block",
                            marginLeft: "10px",
                          }}
                        >
                          {dataDetailInvoice?.order?.name}
                        </span>
                      </Box>
                    </Grid>
                    <Grid className={styles["grid-invoice"]} item sm={6}>
                      <Box className={styles["invoice-right"]}>
                        <Grid textAlign="right" item xs={12}>
                          <Typography className={styles["box-text-paid"]}>
                            {dataDetailInvoice?.statusName}
                          </Typography>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid className={styles["grid-container"]} container>
                    <Grid item sm={6}>
                      <Box className={styles["invoice-right"]}>
                        <Grid textAlign="left" item xs={12}>
                          <Typography className={styles["box-text-invoice"]}>
                            {trans.invoice.invoice_to}
                          </Typography>
                          <Box className={styles["invoice-group-right"]}>
                            {!openUpdateInvoice ? (
                              <Grid item xs={5}>
                                <Typography
                                  onClick={redirectToCustomerDetail}
                                  className={styles["box-title-name"]}
                                >
                                  {dataDetailInvoice?.customer_name}
                                </Typography>
                              </Grid>
                            ) : (
                              <>
                                <Grid item xs={5}>
                                  <Typography className={styles["box-title"]}>
                                    {trans.customer.name}
                                  </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                  <InputBase
                                    keyword="customer_name"
                                    size="small"
                                    value={dataForm?.customer_name}
                                    handleChange={handleChangeInput}
                                    errorText={getFirstValueInObject(
                                      dataError?.customer_name
                                    )}
                                  />
                                </Grid>
                              </>
                            )}
                          </Box>
                          <Box className={styles["invoice-group-right"]}>
                            {!openUpdateInvoice ? (
                              <Grid item xs={5}>
                                <Typography className={styles["box-title"]}>
                                  {dataDetailInvoice?.country_name}
                                </Typography>
                              </Grid>
                            ) : (
                              <>
                                <Grid item xs={5}>
                                  <Typography className={styles["box-title"]}>
                                    {trans.customer.country_name}
                                  </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                  <SelectDefault
                                    keyword="country_id"
                                    keyMenuItem="id"
                                    keyValue="name"
                                    size="small"
                                    data={dataCountryList}
                                    value={dataForm?.country_id}
                                    handleChange={handleChangeSelect}
                                  />
                                </Grid>
                              </>
                            )}
                          </Box>
                          <Box className={styles["invoice-group-right"]}>
                            {!openUpdateInvoice ? (
                              <Grid item xs={5}>
                                <Typography className={styles["box-title"]}>
                                  {dataDetailInvoice?.province_name}
                                </Typography>
                              </Grid>
                            ) : (
                              <>
                                <Grid item xs={5}>
                                  <Typography className={styles["box-title"]}>
                                    {trans.customer.province_name}
                                  </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                  <SelectDefault
                                    keyword="province_id"
                                    keyMenuItem="id"
                                    keyValue="name"
                                    data={dataCityList}
                                    size="small"
                                    value={dataForm?.province_id}
                                    handleChange={handleChangeSelect}
                                    errorText={getFirstValueInObject(
                                      dataError?.province_id
                                    )}
                                  />
                                </Grid>
                              </>
                            )}
                          </Box>
                          <Box className={styles["invoice-group-right"]}>
                            {!openUpdateInvoice ? (
                              <Grid item xs={5}>
                                <Typography className={styles["box-title"]}>
                                  {dataDetailInvoice?.postal_code}
                                </Typography>
                              </Grid>
                            ) : (
                              <>
                                <Grid item xs={5}>
                                  <Typography className={styles["box-title"]}>
                                    {trans.customer_detail.postal_code}
                                  </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                  <InputBase
                                    keyword="postal_code"
                                    size="small"
                                    value={dataForm?.postal_code}
                                    handleChange={handleChangeInput}
                                  />
                                </Grid>
                              </>
                            )}
                          </Box>
                          <Box className={styles["invoice-group-right"]}>
                            {!openUpdateInvoice ? (
                              <Grid item xs={5}>
                                <Typography className={styles["box-title"]}>
                                  {dataDetailInvoice?.address}
                                </Typography>
                              </Grid>
                            ) : (
                              <>
                                <Grid item xs={5}>
                                  <Typography className={styles["box-title"]}>
                                    {trans.customer_detail.address}
                                  </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                  <InputBase
                                    keyword="address"
                                    size="small"
                                    value={dataForm?.address}
                                    handleChange={handleChangeInput}
                                  />
                                </Grid>
                              </>
                            )}
                          </Box>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid item sm={6}>
                      <Box className={styles["invoice-right"]}>
                        <Grid textAlign="right" item xs={12}>
                          {dataDetailInvoice?.status === 1 && (
                            <Box sx={{ textAlign: "right" }}>
                              {/* <IconButton
                                onClick={() => handleChangeEditInvoice()}
                              >
                                {openUpdateInvoice ? <Close /> : <EditIcon />}
                              </IconButton> */}
                            </Box>
                          )}
                          <Box className={styles["invoice-group-right"]}>
                            <Grid item xs={12}>
                              <Typography className={styles["box-title-hapo"]}>
                                QI CRM team
                              </Typography>
                            </Grid>
                          </Box>
                          <Box className={styles["invoice-group-right"]}>
                            <Grid item xs={12}>
                              <Typography className={styles["box-title"]}>
                                Imperia I1, VinHome smart city
                              </Typography>
                            </Grid>
                          </Box>
                          <Box className={styles["invoice-group-right"]}>
                            <Grid item xs={12}>
                              <Typography className={styles["box-title"]}>
                                0853001127
                              </Typography>
                            </Grid>
                          </Box>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid className={styles["grid-container"]} container>
                    <Grid item sm={6}>
                      <Box className={styles["invoice-group-date"]}>
                        <Grid item xs={2}>
                          <Typography className={styles["box-text-date"]}>
                            {trans.invoice.invoice_date}
                          </Typography>
                        </Grid>
                        {!openUpdateInvoice ? (
                          <Grid item xs={5}>
                            <Typography
                              className={styles["box-text-startdate"]}
                            >
                              {moment(dataDetailInvoice?.start_date).format(
                                FOMAT_DATE
                              )}
                            </Typography>
                          </Grid>
                        ) : (
                          <Grid sx={{ marginLeft: "203px" }} item xs={4.9}>
                            <DatePickerDefault
                              keyword="start_date"
                              size="small"
                              value={dataForm?.start_date}
                              handleChange={handleChangeInput}
                            />
                          </Grid>
                        )}
                      </Box>
                      <Box className={styles["invoice-group-date"]}>
                        <Grid item xs={2}>
                          <Typography className={styles["box-text-date"]}>
                            {trans.order.due_date_}
                          </Typography>
                        </Grid>
                        {!openUpdateInvoice ? (
                          <Grid item xs={7}>
                            <Typography
                              className={styles["box-text-startdate"]}
                            >
                              {moment(dataDetailInvoice?.due_date).format(
                                FOMAT_DATE
                              )}
                            </Typography>
                          </Grid>
                        ) : (
                          <Grid sx={{ marginLeft: "203px" }} item xs={4.9}>
                            <DatePickerDefault
                              keyword="due_date"
                              size="small"
                              value={dataForm?.due_date}
                              handleChange={handleChangeInput}
                              errorText={getFirstValueInObject(
                                dataError?.due_date
                              )}
                            />
                          </Grid>
                        )}
                      </Box>
                    </Grid>
                    <Grid item sm={6}>
                      {dataDetailInvoice?.totalPayment && (
                        <Box className={styles["invoice-group-date-payment"]}>
                          <Typography className={styles["box-text-date"]}>
                            {trans.menu.invoice}:
                          </Typography>
                          <Typography className={styles["box-text-money"]}>
                            {dataDetailInvoice?.totalPayment
                              ? `${formatCurrencyValue(
                                  dataDetailInvoice?.totalPayment
                                )} ${dataDetailInvoice?.currency_sign ?? ""}`
                              : ""}
                          </Typography>
                        </Box>
                      )}
                      <Box className={styles["invoice-group-date-payment"]}>
                        <Typography className={styles["box-text-date"]}>
                          {trans.customer_detail.balance_due}
                        </Typography>
                        <Typography className={styles["box-text-due"]}>
                          {dataDetailInvoice?.balanceDue
                            ? `${formatCurrencyValue(
                                dataDetailInvoice?.balanceDue
                              )} ${dataDetailInvoice?.currency_sign ?? ""}`
                            : ""}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <TableContainer
                    component={Paper}
                    style={{ padding: "24px", marginTop: "40px" }}
                  >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell width="40%">
                            {trans.invoice.order_items}
                          </TableCell>
                          <TableCell width="30%" className="text-align-right">
                            {trans.invoice.value}
                          </TableCell>
                          <TableCell width="20%" className="text-align-center">
                            {trans.invoice.tax_rate}
                          </TableCell>
                          <TableCell sx={{ textAlign: "end" }}>
                            {trans.invoice.total}
                          </TableCell>
                          {openUpdateInvoice ? (
                            <TableCell></TableCell>
                          ) : (
                            <Hidden />
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItemList?.map((item: any, index: any) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell className="list-index">
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              {uid === item?.uid && editOrderItem ? (
                                <InputBase
                                  keyword="name"
                                  placeholder="name"
                                  size="small"
                                  displayErrorText={false}
                                  value={dataFormOrderItem?.name}
                                  handleChange={handleChangeInput}
                                />
                              ) : (
                                item?.name
                              )}
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              className="text-align-right"
                            >
                              {uid == item?.uid && editOrderItem ? (
                                <InputFormatNumber
                                  keyword="value"
                                  size="small"
                                  displayErrorText={false}
                                  value={dataFormOrderItem?.value}
                                  handleChange={handleChangeInput}
                                />
                              ) : (
                                `${formatCurrencyValue(item?.value)} ${
                                  dataDetailInvoice?.currency_sign ?? ""
                                }`
                              )}
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              className="text-align-center"
                            >
                              {uid == item?.uid && editOrderItem ? (
                                <InputBase
                                  keyword="tax_rate"
                                  size="small"
                                  displayErrorText={false}
                                  errorText={taxRateEachRowError}
                                  value={dataFormOrderItem?.tax_rate}
                                  handleChange={handleChangeInput}
                                />
                              ) : (
                                `${item?.tax_rate ? item?.tax_rate : 0} %`
                              )}
                            </TableCell>
                            <TableCell
                              sx={{ textAlign: "end" }}
                              width="15%"
                              component="th"
                              scope="row"
                            >
                              {formatCurrencyValue(
                                getTotalValueInvoiceOrderItem(
                                  item?.value,
                                  item?.tax_rate
                                ).toString()
                              )}
                              {dataDetailInvoice?.currency_sign}
                            </TableCell>
                            {openUpdateInvoice ? (
                              <TableCell>
                                {uid == item?.uid && editOrderItem ? (
                                  <>
                                    <IconButton
                                      onClick={() =>
                                        updateOrderItemEachRow(item?.uid)
                                      }
                                    >
                                      <SaveIcon />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleCloseEditForm()}
                                    >
                                      <ClearIcon />
                                    </IconButton>
                                  </>
                                ) : (
                                  <Stack direction="row">
                                    {/* <IconButton
                                      onClick={() =>
                                        handleDeleteOrderItem(item?.uid)
                                      }
                                    >
                                      <DeleteIcon />
                                    </IconButton> */}
                                    {/* <IconButton
                                      onClick={() =>
                                        handleEditOrderItem(item?.uid)
                                      }
                                    >
                                      <EditIcon />
                                    </IconButton> */}
                                  </Stack>
                                )}
                              </TableCell>
                            ) : (
                              <Hidden />
                            )}
                          </TableRow>
                        ))}
                        {newLineOrderItem}
                        {openUpdateInvoice && (
                          <TableRow>
                            <TableCell
                              style={{ borderBottom: "none" }}
                            ></TableCell>
                            <Button onClick={addNewLine}>
                              {trans.order.add_new_line}
                            </Button>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Grid container spacing={1}>
                    <Grid item sm={4}>
                      <Box className={styles["invoice-group-right"]}>
                        <Grid item xs={5}>
                          {/* <Typography className={styles["box-title-File"]}>
                            File Attachments
                          </Typography> */}
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid item sm={2}>
                      <Box className={styles["invoice-right"]}>
                        <Typography className={styles["box-title-export"]}>
                          {/* Export to pdf */}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item sm={6}>
                      <Box className={styles["invoice-group-right-value"]}>
                        <Grid item xs={6} xl={5}>
                          <Typography className={styles["box-text-value"]}>
                            {trans.invoice.total_values}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} xl={3}>
                          <Typography
                            textAlign="right"
                            className={styles["box-text-value"]}
                          >
                            {Intl.NumberFormat("en-US")
                              .format(totalValue)
                              .toString() + " "}
                            {!!dataDetailInvoice?.currency_sign &&
                              dataDetailInvoice?.currency_sign}
                          </Typography>
                        </Grid>
                      </Box>
                      <Box className={styles["invoice-group-right-value"]}>
                        <Grid item xs={6} xl={5}>
                          <Typography className={styles["box-text-value"]}>
                            {trans.invoice.tax_values}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} xl={3}>
                          <Typography
                            textAlign="right"
                            className={styles["box-text-value"]}
                          >
                            {Intl.NumberFormat("en-US")
                              .format(totalTaxRate)
                              .toString() + " "}
                            {!!dataDetailInvoice?.currency_sign &&
                              dataDetailInvoice?.currency_sign}
                          </Typography>
                        </Grid>
                      </Box>
                      <Box className={styles["invoice-group-right-value"]}>
                        <Grid item xs={6} xl={5}>
                          <Typography className={styles["box-text-total"]}>
                            {trans.invoice.total}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} xl={3}>
                          <Typography
                            textAlign="right"
                            className={styles["box-text-total"]}
                          >
                            {Intl.NumberFormat("en-US")
                              .format(total)
                              .toString()}{" "}
                            {!!dataDetailInvoice?.currency_sign &&
                              dataDetailInvoice?.currency_sign}
                          </Typography>
                        </Grid>
                      </Box>
                      {openUpdateInvoice && (
                        <Box className={styles["invoice-group-right-value"]}>
                          <Button
                            className="btn-save"
                            onClick={() => handleChangeUpdateInvoice()}
                          >
                            {trans.task.save}
                          </Button>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        <ModalUpdateStatusInvoice
          openModal={openDeleteModal}
          setOpenModal={setOpenDeleteModal}
          action={() => updateStatusInvoices(statusUpdate, invoiceId)}
          title={trans.payment.change_to_request_sending}
          content={trans.payment.you_cannot_edit_invoice}
        />

        <ModalReIssue
          openModal={openReIssueModal}
          setOpenModal={setOpenReIssueModal}
          action={() => updateStatusInvoices(statusUpdate, invoiceId)}
          title={trans.payment.you_are_re_isse}
          content={trans.payment.invoice_change_re_issue}
        />

        <ModalUpdateCountry
          openModalUpdateCountry={openModalUpdateCountry}
          setOpenModalUpdateCountry={setOpenModalUpdateCountry}
          title={trans.payment.change_invoice_id}
          content={trans.payment.change_invoice_id_content}
        />

        <ModalDelete
          openModal={openDeleteInvoiceModal}
          setOpenModal={setOpenDeleteInvoiceModal}
          action={handleModalDeleteInvoice}
          title={trans.payment.delete_invoice}
          content={trans.payment.delete_invoice_content}
        />

        <ModalDeleteNotification
          openModalDeleteNotification={openModalDeleteNotification}
          setOpenModalDeleteNotification={setOpenModalDeleteNotification}
          title={trans.payment.delete_invoice}
          content={trans.payment.delete_invoice_content_not}
        />
      </div>
    );
  }

  return <></>;
};

const mapStateToProps = (state: any) => ({
  deal: state?.deal,
  status: state?.status,
  order: state?.order,
  category: state?.category,
  currency: state?.currency,
  tags: state?.tag,
  invoice: state?.invoice,
  country: state?.country,
  city: state?.city,
  errors: state.invoice?.error?.response?.data?.properties,
  task: state?.task,
  profile: state?.profile,
  payment: state?.payment,
});

const mapDispatchToProps = {
  clearData,
  getStatusList,
  updateStatusInvoices,
  getCategoryList,
  getCurrencyList,
  getOrderListByDealId,
  updateDeal,
  getInvoiceStatusList,
  getDetailInvoice,
  getCountries,
  getCities,
  updateInvoice,
  getObjectTask,
  getDetailProfile,
  getPayment,
  updateInvoiceCode,
  deleteInvoice,
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceDetail);
