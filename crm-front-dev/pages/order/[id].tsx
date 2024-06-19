import {
  Box,
  Grid,
  Typography,
  Card,
  Divider,
  Stack,
  Button,
  Chip,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
  Paper,
  CardContent,
} from "@mui/material";
import { NextPage } from "next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Breadcrumb from "../../components/Breadcumb";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { getOrderStatusList } from "../../redux/actions/orderStatus";
import {
  createOrderItem,
  deleteOrderItem,
  getDetailOrderItem,
  updateOrderItem,
} from "../../redux/actions/orderItem";
import { getCategoryList } from "../../redux/actions/category";
import { getListBilling } from "../../redux/actions/billing";
import { getContactListByCustomerId } from "../../redux/actions/contact";
import { searchUser } from "../../redux/actions/user";
import { getCurrencyList } from "../../redux/actions/currency";
import {
  getDetailOrder,
  getOrderItemListByOrderId,
  updateOrderStatus,
  updateOrder,
  clearData,
  deleteOrder,
} from "../../redux/actions/order";
import { getDetailProfile } from "../../redux/actions/profile";
import { getInvoicesByOrderId } from "../../redux/actions/invoice";
import { rowsPerPage, statusCode } from "../../constants";
import BoxOrderInformation from "../../components/BoxOrderInformation";
import BoxCustomerInformation from "../../components/BoxCustomerInformation";
import BoxCustomerReview from "../../components/BoxCustomerReview";
import styles from "./styles.module.scss";
import { styled } from "@mui/material/styles";
import { getInvoiceCategoryList } from "../../redux/actions/invoiceCategory";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import TabPanelOrderItemList from "../../components/TabList/TabPanelOrderItemList";
import TabPanelInvoiceList from "../../components/TabList/TabPanelInvoiceList";
import TabPanelPaymentList from "../../components/TabList/TabPanelPaymentList";
import {
  TAB_INVOICE_INDEX,
  TAB_LOG_NOTE_INDEX,
  TAB_LOG_ORDER_DETAIL,
  TAB_ORDER_ITEM_INDEX,
  TAB_PAYMENT_INDEX,
  TAB_TASK_INDEX,
} from "../../constants/orderDetail";
import FormCreateInvoiceFromOrderDetail from "../../components/Invoice/FormCreateInvoiceFromOrderDetail";
import { getPaymentsByOrderId } from "../../redux/actions/payment";
import FormCreateTask from "../../components/Task/FormCreateTask";
import { getObjectTask } from "../../redux/actions/task";
import TabPanelTaskList from "../../components/TabList/TabPanelTaskList";
import { IconPackage } from "@tabler/icons";
import HeadMeta from "../../components/HeadMeta";
import LogNote from "../../components/LogNote";
import removeQueryParam from "../../utility/removeQueryParam";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModalDelete from "../../components/Modal/ModalDelete";
import ModalDeleteNotification from "../../components/Modal/ModalDeleteNotification";
import useTrans from "../../utils/useTran";
import checkChangeDataBeforeUpdate from "../../utility/checkChangeDataBeforeUpdate";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import InputTiny from "../../components/Input/InputTiny";

type DataFormOrderType = {
  name: string;
  categoryId: number | null;
  billingTypeId: number | null;
  currencyId: number | null;
  orderValue: string;
  startDate: Date | null;
  dueDate: Date | null;
  deleveryDate: Date | null;
  contactId: number | null;
  userAssignId: number | null;
  ratePoint: number | null;
  review: string;
  description: string;
  orderManager: string;
  partnerSalePercent: number | null;
};

const INIT_DATA_ORDER = {
  name: "",
  categoryId: null,
  billingTypeId: null,
  currencyId: null,
  orderValue: "",
  startDate: null,
  dueDate: null,
  deleveryDate: null,
  contactId: null,
  userAssignId: null,
  ratePoint: null,
  review: "",
  description: "",
  orderManager: "",
  partnerSalePercent: null,
};

const INIT_ERROR = {
  name: "",
  categoryId: null,
  billingTypeId: null,
  currencyId: null,
  orderValue: "",
  startDate: null,
  dueDate: null,
  deleveryDate: null,
  contactId: null,
  userAssignId: null,
  ratePoint: null,
  review: "",
  description: "",
  orderManager: "",
  partnerSalePercent: "",
};

const BoxTotalPrice = styled("div")(({ theme }) => ({
  padding: "0 8px",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
  [theme.breakpoints.up("md")]: {
    width: "25%",
  },
  [theme.breakpoints.up("lg")]: {
    width: "25%",
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function setTabId(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const OrderDetail: NextPage = (props: any) => {
  const trans = useTrans();
  const {
    getDetailOrder,
    getOrderStatusList,
    getCategoryList,
    getListBilling,
    getCurrencyList,
    getContactListByCustomerId,
    getInvoicesByOrderId,
    getPaymentsByOrderId,
    getInvoiceCategoryList,
    searchUser,
    clearData,
    errors,
    getObjectTask,
    getDetailProfile,
    deleteOrder,
    updateOrder
  } = props;
  const {
    dataOrderDetail,
    dataUpdateOrder,
    dataOrderItemListByOrderId,
    dataUpdateOrderStatus,
    dataDeleteOrder,
  } = props.order;
  const { dataOrderStatusList } = props.orderStatus;
  const { dataCategoryList } = props.category;
  const { dataBillingList } = props.billing;
  const { dataInvoiceCategoryList } = props.invoiceCategory;
  const { dataContactListByCustomerId } = props.contact;
  const { dataCurrencyList } = props.currency;
  const { dataInvoicesByOrderId, dataCreateInvoice } = props.invoice;
  const { dataPaymentByOrderId } = props.payment;
  const { dataUserList } = props.user;
  const { dataTaskObject, dataCreateTask } = props.task;
  const { dataDetailProfile } = props?.profile;

  const [tabValue, setTabValue] = useState(0);
  const [dataFormOrder, setDataFormOrder] =
    useState<DataFormOrderType>(INIT_DATA_ORDER);
  const tabRef = useRef<HTMLDivElement>(null);
  const [pageOrderItem, setPageOrderItem] = useState<number>(1);
  const [pageInvoice, setPageInvoice] = useState<number>(1);
  const [pagePayment, setPagePayment] = useState<number>(1);
  const [openFormModal, setOpenFormModal] = useState<boolean>(false);
  const router = useRouter();
  const q: any = useMemo(() => router.query, [router]);
  const orderId = q?.id || "";
  const [openTaskFormModal, setOpenTaskModal] = useState<boolean>(false);
  const [isLoggedInUserId, setIsLoggedInUserId] = useState<any>();
  const [applyData, setApplyData] = useState<boolean>(true);
  const [querySearch, setQuerySearch] = useState<string>(
    `limit=${rowsPerPage}&offset=${(pageOrderItem - 1) * rowsPerPage}`
  );
  const [dataError, setDataError] = useState(INIT_ERROR);
  const [openModalDeleteNotification, setOpenModalDeleteNotification] =
    useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [editDescriptionButton, setEditDescriptionButton] =
    useState<boolean>(false);

  useEffect(() => {
    if (
      (orderId && applyData) ||
      (orderId && applyData && localStorage.getItem("languages"))
    ) {
      getDetailOrder(orderId, querySearch);
    }
  }, [orderId, localStorage.getItem("languages"), dataCreateTask]);

  useEffect(() => {
    setDataError({ ...INIT_ERROR, ...errors });
  }, [errors]);

  useEffect(() => {
    if (router?.query?.tab) {
      if (router?.query?.tab == "lognote") {
        setTabValue(TAB_LOG_NOTE_INDEX);
      } else {
        setTabValue(Number(router?.query?.tab));
      }
    }
  }, [router?.query]);

  useEffect(() => {
    if (
      dataUpdateOrder ||
      dataUpdateOrderStatus ||
      (tabValue && tabValue !== TAB_LOG_NOTE_INDEX)
    ) {
      if (router?.query?.view) {
        removeQueryParam(router, ["view"]);
      }
    }
  }, [dataUpdateOrder, dataUpdateOrderStatus, tabValue]);

  useEffect(() => {
    if (!dataDetailProfile) {
      getDetailProfile();
    } else {
      setIsLoggedInUserId(dataDetailProfile?.id);
    }
  }, [dataDetailProfile]);

  useEffect(() => {
    if (router.query?.taskId) {
      setTabValue(4);
    }
  }, [router.query]);

  useEffect(() => {
    if (orderId) {
      switch (tabValue) {
        case TAB_TASK_INDEX: {
          getObjectTask(
            `limit=${rowsPerPage}&offset=${
              (pageOrderItem - 1) * rowsPerPage
            }&orderId=${orderId}`
          );
          break;
        }
        default: {
          break;
        }
      }
    }
  }, [tabValue, orderId]);

  const handleDeleteOrder = useCallback(() => {
    if (
      dataOrderDetail?.items?.length ||
      dataTaskObject?.items?.length ||
      dataOrderDetail?.invoices.length
    ) {
      setOpenModalDeleteNotification(true);
    } else {
      setOpenDeleteModal(true);
    }
  }, [dataOrderDetail, dataTaskObject]);

  useEffect(() => {
    if (dataCreateTask) {
      getObjectTask(
        `limit=${rowsPerPage}&offset=${
          (pageOrderItem - 1) * rowsPerPage
        }&orderId=${orderId}`
      );
    }
  }, [dataCreateTask]);

  useEffect(() => {
    if (dataOrderDetail) {
      getInvoiceCategoryList();
      getCategoryList();
      getListBilling();
      getCurrencyList();
      searchUser();
      getOrderStatusList();
      getInvoicesByOrderId(
        `limit=${rowsPerPage}&offset=${(pageInvoice - 1) * rowsPerPage}`,
        orderId
      );
      getPaymentsByOrderId(
        `limit=${rowsPerPage}&offset=${(pagePayment - 1) * rowsPerPage}`,
        orderId
      );
      if (dataOrderDetail?.customer?.id)
        getContactListByCustomerId(dataOrderDetail?.customer?.id);
      setDataFormOrder({
        ...INIT_DATA_ORDER,
        name: dataOrderDetail?.name,
        orderValue: dataOrderDetail?.orderValue,
        startDate: dataOrderDetail?.startDate,
        dueDate: dataOrderDetail?.dueDate,
        deleveryDate: dataOrderDetail?.deleveryDate,
        description: dataOrderDetail?.description,
        review: dataOrderDetail?.review,
        ratePoint: Number(dataOrderDetail?.ratePoint),
        categoryId: Number(dataOrderDetail?.category?.id),
        billingTypeId: Number(dataOrderDetail?.billingType?.id),
        contactId: Number(dataOrderDetail?.contact?.id),
        userAssignId: Number(dataOrderDetail?.userAssign?.id),
        currencyId: Number(dataOrderDetail?.customer?.currency?.id),
        orderManager: dataOrderDetail?.orderManager,
        partnerSalePercent: dataOrderDetail?.partners[0]?.salePercent ? Number(dataOrderDetail?.partners[0]?.salePercent) : null
      });
    }
  }, [dataOrderDetail, errors]);

  useEffect(() => {
    if (orderId && dataCreateInvoice) {
      getInvoicesByOrderId(
        `limit=${rowsPerPage}&offset=${(pageInvoice - 1) * rowsPerPage}`,
        orderId
      );
    }
  }, [dataCreateInvoice]);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    removeQueryParam(router, ["view", "tab"]);
    setApplyData(false);
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        tab: newValue,
      },
    });
  };

  const scrollToTabSection = () => {
    tabRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScrollAndOpenTabList = (tabValue: number) => {
    setTabValue(tabValue);
    scrollToTabSection();
  };

  useEffect(() => {
    if (dataUpdateOrder) {
      clearData("dataUpdateOrder");
      getDetailOrder(orderId);
    }
  }, [dataUpdateOrder, dataUpdateOrderStatus]);

  const handleOpenForm = () => {
    setOpenFormModal(true);
  };

  useEffect(() => {
    if (errors != undefined && errors?.statusCode === statusCode.NOT_FOUND)
      router.push("/404");
  }, [errors]);

  const handleOpenFormTask = (action: boolean) => {
    setOpenTaskModal(action);
  };

  useEffect(() => {
    if (dataDeleteOrder && !openDeleteModal) {
      router.push(`/order`);
    }
  }, [dataDeleteOrder, openDeleteModal]);

  const handleChangeEditDescriptionButton = useCallback(() => {
    setEditDescriptionButton((prevEditDescriptionButton) => !prevEditDescriptionButton);
    if (
      editDescriptionButton &&
      checkChangeDataBeforeUpdate(dataFormOrder, dataOrderDetail)
    ) {
      updateOrder(dataFormOrder, orderId);
    }
  }, [dataFormOrder, dataOrderDetail, editDescriptionButton, orderId]);
  
  const handleChangeInput = useCallback(function (key: any, value: any) {
    setDataFormOrder((prevDataFormOrder) => {
      return { ...prevDataFormOrder, [key]: value ?? "" };
    });
  }, []);

  const handleModalDeleteOrder = useCallback(() => {
    deleteOrder(orderId);
  }, [deleteOrder, orderId]);

  return (
    <div>
      <HeadMeta title={trans.menu.order} param={dataOrderDetail?.name} />
      <Breadcrumb
        title={dataOrderDetail?.name}
        icon={<IconPackage className={styles["icons"]} />}
      />
      <Card sx={{ textAlign: "right" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          divider={<Divider orientation="vertical" flexItem />}
          sx={{ justifyContent: "space-evenly", alignItems: "flex-end" }}
        >
          <BoxTotalPrice>
            <Grid container className={styles["grid-price-text"]}>
              <Grid item xs className="font-14">
                {`${formatCurrencyValue(
                  dataOrderDetail?.totalValueOrderItem
                )} ${dataOrderDetail?.currency?.sign ?? ""}`}
              </Grid>
              <Grid item xs>
                <Typography className="font-14">
                  {trans.order.total_order_items} (
                  {dataOrderDetail?.totalOrderItems}){" "}
                  <span
                    className="text-cursor"
                    onClick={() =>
                      handleScrollAndOpenTabList(TAB_ORDER_ITEM_INDEX)
                    }
                  >
                    {trans.order.view_detail}
                  </span>
                </Typography>
              </Grid>
            </Grid>
            <Chip
              size="small"
              sx={{ width: "100%", height: "5px", backgroundColor: "orange" }}
            />
          </BoxTotalPrice>
          <BoxTotalPrice>
            <Grid container className={styles["grid-price-text"]}>
              <Grid item xs className="font-14">
                {`${formatCurrencyValue(dataOrderDetail?.totalValueInvoice)} ${
                  dataOrderDetail?.currency?.sign ?? ""
                }`}
              </Grid>
              <Grid item xs>
                <Typography className="font-14">
                  {trans.menu.invoice} ({dataOrderDetail?.totalInvoice}){" "}
                  <span
                    className="text-cursor"
                    onClick={() =>
                      handleScrollAndOpenTabList(TAB_INVOICE_INDEX)
                    }
                  >
                    {trans.order.view_detail}
                  </span>
                </Typography>
              </Grid>
            </Grid>
            <Chip
              size="small"
              sx={{ width: "100%", height: "5px", backgroundColor: "blue" }}
            />
          </BoxTotalPrice>
          <BoxTotalPrice>
            <Grid container className={styles["grid-price-text"]}>
              <Grid item xs className="font-14">
                {`${formatCurrencyValue(dataOrderDetail?.totalValuePayment)} ${
                  dataOrderDetail?.currency?.sign ?? ""
                }`}
              </Grid>
              <Grid item xs>
                <Typography className="font-14">
                  {trans.menu.payment} ({dataOrderDetail?.totalPayment}){" "}
                  <span
                    className="text-cursor"
                    onClick={() =>
                      handleScrollAndOpenTabList(TAB_PAYMENT_INDEX)
                    }
                  >
                    {trans.order.view_detail}
                  </span>
                </Typography>
              </Grid>
            </Grid>
            <Chip
              size="small"
              sx={{ width: "100%", height: "5px", backgroundColor: "green" }}
            />
          </BoxTotalPrice>
          <BoxTotalPrice>
            <Grid container className={styles["grid-price-text"]}>
              <Grid item xs className="font-14">
                {`${formatCurrencyValue(
                  dataOrderDetail?.totalValueInvoiceOverDue
                )} ${dataOrderDetail?.currency?.sign ?? ""}`}
              </Grid>
              <Grid item xs>
                <Typography className="font-14">
                  {trans.order.overdue} ({dataOrderDetail?.totalInVoiceOverDue})
                </Typography>
              </Grid>
            </Grid>
            <Chip
              size="small"
              sx={{ width: "100%", height: "5px", backgroundColor: "red" }}
            />
          </BoxTotalPrice>
        </Stack>
        <Button
          className={
            dataOrderDetail?.customer?.currency !== null &&
            dataOrderDetail?.customer?.cidCode !== null
              ? "btn_create"
              : styles["btn_create_disable"]
          }
          onClick={() => handleOpenForm()}
          disabled={
            dataOrderDetail?.customer?.currency !== null &&
            dataOrderDetail?.customer?.cidCode !== null
              ? false
              : true
          }
          sx={{
            marginRight: "20px"
          }}
        >
          {trans.invoice.create_invoice}
        </Button>
        <Grid textAlign="end" mt={1} item xs={12}>
          <span className="text-fail-validate align-center">
            {dataOrderDetail?.customer?.currency === null ||
            dataOrderDetail?.customer?.cidCode === null
              ? `* ${trans.invoice.available_only}`
              : ""}
          </span>
        </Grid>
        <FormCreateInvoiceFromOrderDetail
          openFormModal={openFormModal}
          setOpenFormModal={setOpenFormModal}
          dataOrderItem={dataOrderDetail?.items}
          customerName={dataOrderDetail?.customer?.name}
          dataInvoiceCategoryList={dataInvoiceCategoryList}
          orderId={orderId}
          dataOrderDetail={dataOrderDetail}
        />
      </Card>

      <Card ref={tabRef}>
        <Box>
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            onClick={scrollToTabSection}
            aria-label="basic tabs example"
            TabIndicatorProps={{
              style: { display: "none" },
            }}
          >
            <Tab
              label={trans.order.order_detail}
              {...setTabId(TAB_LOG_ORDER_DETAIL)}
            />
            <Tab
              label={trans.invoice.order_items}
              {...setTabId(TAB_ORDER_ITEM_INDEX)}
            />
            <Tab label={trans.menu.invoice} {...setTabId(TAB_INVOICE_INDEX)} />
            <Tab label={trans.menu.payment} {...setTabId(TAB_PAYMENT_INDEX)} />
            <Tab label={trans.menu.task} {...setTabId(TAB_TASK_INDEX)} />
            <Tab label={trans.menu.lognote} {...setTabId(TAB_LOG_NOTE_INDEX)} />
          </Tabs>
          {tabValue == 0 && (
            <div className={styles["delete-btn"]}>
              <Grid container className={styles["contact-detail-row"]}>
                <Grid
                  item
                  md={12}
                  xs
                  className={styles["contact-detail-title-delete"]}
                >
                  <IconButton size="small" color="error">
                    <Tooltip
                      title={trans.task.delete}
                      style={{
                        display: "inline-block",
                        marginRight: "4px",
                      }}
                    >
                      <div onClick={handleDeleteOrder}>
                        <DeleteOutlineOutlinedIcon />
                      </div>
                    </Tooltip>
                  </IconButton>
                </Grid>
              </Grid>
            </div>
          )}
        </Box>

        <TabPanel value={tabValue} index={TAB_LOG_ORDER_DETAIL}>
          <BoxOrderInformation
            dataForm={dataFormOrder}
            setDataForm={setDataFormOrder}
            dataOrderDetail={dataOrderDetail}
            dataOrderStatusList={dataOrderStatusList}
            dataCategoryList={dataCategoryList}
            dataBillingList={dataBillingList}
            dataOrderItemListByOrderId={dataOrderItemListByOrderId}
            dataContactListByCustomerId={dataContactListByCustomerId}
            dataCurrencyList={dataCurrencyList}
            dataUserList={dataUserList}
            dataError={dataError}
            customer={dataOrderDetail?.customer}
            isLoggedInUserId={isLoggedInUserId}
          />
          <Grid
            container
            spacing={2}
            sx={{
              marginBottom: "20px",
              boxShadow: "0px 0px 5px lightgray",
              borderRadius: "10px",
            }}
          >
            <Grid item md={6}>
              <BoxCustomerInformation
                country={dataOrderDetail?.customer?.country?.sign}
                customer={dataOrderDetail?.customer}
              />
            </Grid>
            <Grid item md={6}>
              <BoxCustomerReview
                dataForm={dataFormOrder}
                setDataForm={setDataFormOrder}
                dataOrderDetail={dataOrderDetail}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Paper elevation={0}>
              <Box className={styles["contact-box"]}>
                <Grid item xs>
                  <Paper>
                    <CardContent className={styles["contact-card"]}>
                      <Grid item xs={12} sm={12} sx={{minHeight: "300px"}}>
                        <Box className={styles["box-head"]}>
                          <Typography className={styles["box-title"]}>
                            {trans.customer_detail.description_information}
                            <IconButton
                              sx={{ marginLeft: "20px", padding: 0 }}
                            >
                              <div  onClick={handleChangeEditDescriptionButton}>
                              {editDescriptionButton ? (
                                <SaveIcon />
                              ) : (
                                <EditIcon />
                              )}
                              </div>
                            </IconButton>
                          </Typography>
                        </Box>
                        <Box className={styles["box-content"]}>
                          {editDescriptionButton ? (
                            <InputTiny
                              handleChange={handleChangeInput}
                              keyword="description"
                              value={dataFormOrder?.description}
                              object={dataOrderDetail}
                              objectName={"deals"}
                              isLoggedInUserId={isLoggedInUserId}
                              onEdit={true}
                              heightScreen={450}
                            />
                          ) : (
                            <Typography>
                              <span
                                className="description-img"
                                dangerouslySetInnerHTML={{
                                  __html: dataOrderDetail?.description,
                                }}
                              />
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </CardContent>
                  </Paper>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={TAB_ORDER_ITEM_INDEX}>
          <TabPanelOrderItemList
            dataOrderItemListByOrderId={dataOrderItemListByOrderId}
            dataOrderDetail={dataOrderDetail}
            dataOrderStatusList={dataOrderStatusList}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={TAB_INVOICE_INDEX}>
          <TabPanelInvoiceList dataInvoicesByOrderId={dataInvoicesByOrderId} />
        </TabPanel>

        <TabPanel value={tabValue} index={TAB_PAYMENT_INDEX}>
          <TabPanelPaymentList
            dataListPayment={dataPaymentByOrderId?.data?.items}
          />
        </TabPanel>

        <Box className={styles.boxTabPanel}>
          <TabPanel value={tabValue} index={TAB_TASK_INDEX}>
            <TabPanelTaskList
              paramObject="orderId"
              idObject={orderId}
              dataTaskObject={dataTaskObject}
              setPageOrderItem={setPageOrderItem}
              pageOrderItem={pageOrderItem}
              handleOpenFormTask={handleOpenFormTask}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={TAB_LOG_NOTE_INDEX}>
            <LogNote
              isLoggedInUserId={isLoggedInUserId}
              title={trans.home.activity}
              object={dataOrderDetail}
              logNotes={dataOrderDetail?.logNotes}
              objectName="orders"
              getObject={getDetailOrder}
            />
          </TabPanel>
        </Box>

        <FormCreateTask
          openFormModal={openTaskFormModal}
          setOpenFormModal={setOpenTaskModal}
          dataOrder={dataOrderDetail}
          onScreen={true}
        />
        <ModalDelete
          openModal={openDeleteModal}
          setOpenModal={setOpenDeleteModal}
          action={handleModalDeleteOrder}
          title={trans.order.about_to_delete_your_delete}
          content={trans.order.delete_order_content}
        />
        <ModalDeleteNotification
          openModalDeleteNotification={openModalDeleteNotification}
          setOpenModalDeleteNotification={setOpenModalDeleteNotification}
          title={trans.order.about_delete}
          content={trans.order.about_delete_content}
        />
      </Card>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  order: state.order,
  orderItem: state.orderItem,
  orderStatus: state.orderStatus,
  category: state.category,
  billing: state.billing,
  contact: state.contact,
  currency: state.currency,
  user: state.user,
  invoiceCategory: state.invoiceCategory,
  orderItemErrors: state.orderItem?.error?.response?.data?.properties ?? {},
  invoice: state.invoice,
  payment: state.payment,
  errors: state.order?.error?.response?.data,
  task: state?.task,
  profile: state?.profile,
});

const mapDispatchToProps = {
  getDetailOrder,
  updateOrderStatus,
  updateOrder,
  getOrderItemListByOrderId,
  deleteOrderItem,
  getOrderStatusList,
  getCategoryList,
  getListBilling,
  getCurrencyList,
  getInvoiceCategoryList,
  getContactListByCustomerId,
  searchUser,
  getDetailOrderItem,
  updateOrderItem,
  getInvoicesByOrderId,
  getPaymentsByOrderId,
  createOrderItem,
  clearData,
  getObjectTask,
  getDetailProfile,
  deleteOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
