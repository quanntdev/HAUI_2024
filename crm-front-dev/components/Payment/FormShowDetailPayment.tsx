import { Close } from "@mui/icons-material";
import {
  Box,
  Grid,
  Button,
  Dialog,
  Divider,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Card,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { connect } from "react-redux";
import {
  getDetailInvoice,
  getInvoiceByCode,
  searchInvoices,
} from "../../redux/actions/invoice";
import {
  updatePayment,
  clearData,
  getPayment,
  deletePayment,
} from "../../redux/actions/payment";
import { getPaymentMethods } from "../../redux/actions/paymentMethod";
import EditIcon from "@mui/icons-material/Edit";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import { useRouter } from "next/router";
import TabCreateOrUpdatePayment from "./TabCreateOrUpdatePayment";
import removeCommaCurrencyValue from "../../utility/removeCommaCurrencyValue";
import LogNote from "../LogNote";
import { getDetailProfile } from "../../redux/actions/profile";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { getCurrencyList } from "../../redux/actions/currency";
import {
  searchCustomer,
  getListOrderHasInvoiceByCustomerId,
  getDetailCustomer,
} from "../../redux/actions/customer";
import {
  getCanPaidInvoicesListByOrderId,
  getDetailOrder,
  searchOrder,
} from "../../redux/actions/order";
import Link from "next/link";
import ModalDelete from "../Modal/ModalDelete";
import useTrans from "../../utils/useTran";
import fomatDate from "../../utility/fomatDate";

const FORM_DATA_UPDATE_PAYMENT = {
  notes: "",
  amount: "",
  orderId: "",
  methodId: "",
  customerId: "",
  paymentDate: "",
  transactionId: "",
  attachment: "",
  invoiceId: "",
  currencyId: "",
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function setTabId(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
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

const FormShowDetailPayment = (props: any) => {
  const trans = useTrans();
  const {
    clearData,
    dataPayment,
    updatePayment,
    openModalDetail,
    getInvoiceByCode,
    getPaymentMethods,
    setOpenModalDetail,
    getDetailProfile,
    getPayment,
    getCurrencyList,
    searchCustomer,
    searchOrder,
    searchInvoices,
    edit = true,
    getCanPaidInvoicesListByOrderId,
    getDetailOrder,
    getDetailInvoice,
    getDetailCustomer,
    getListOrderHasInvoiceByCustomerId,
    deletePayment,
  } = props;
  const { dataUpdatePayment, dataDeletePayment } = props.payment;
  const { dataInvoiceByCode, dataInvoiceList, dataDetailInvoice } =
    props.invoice;
  const { dataPaymentMethods } = props.paymentMethod;
  const { dataDetailProfile } = props?.profile;
  const { dataCurrencyList } = props.currency;
  const { dataCanPaidInvoiceList, dataOrderList, dataOrderDetail } =
    props.order;
  const { dataCustomerList, dataListOrderHasInvoice, dataDetailCustomer } =
    props.customer;
  const [queryCode, setQueryCode] = useState<string>("");
  const [editPayment, setEditPayment] = useState<boolean>(false);
  const [changeCustomer, setChangeCustomer] = useState<boolean>(false);
  const [changeOrder, setrChangeOrder] = useState<boolean>(false);
  const [curency, setCurrency] = useState<any>("");
  const [balanceDue, setBalanceDue] = useState<any>("");
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [formDataUpdatePayment, setFormDataUpdatePayment] = useState<any>(
    FORM_DATA_UPDATE_PAYMENT
  );
  const [tab, setTab] = useState<any>(0);
  const [isLoggedInUserId, setIsLoggedInUserId] = useState<any>();
  const [infoImage, setInfoImage] = useState<any>({
    name: "",
    url: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (dataPayment?.invoice?.code) {
      setQueryCode(dataPayment?.invoice?.code);
    }
    getPaymentMethods();
  }, [dataPayment?.invoice?.code]);

  useEffect(() => {
    if (!dataDetailProfile) {
      getDetailProfile();
    } else {
      setIsLoggedInUserId(dataDetailProfile?.id);
    }
  }, [dataDetailProfile]);

  useEffect(() => {
    if (dataPayment?.id) {
      getPayment(dataPayment?.id, `limit=6&offset=0`);
    }
  }, [dataUpdatePayment]);

  useEffect(() => {
    if (editPayment) {
      searchCustomer();

      searchOrder(
        `customerId=${
          dataPayment?.customer?.id ? Number(dataPayment?.customer?.id) : ""
        }`
      );
      setFormDataUpdatePayment({
        ...formDataUpdatePayment,
        amount: dataPayment?.amount,
        transactionId: dataPayment?.transactionId,
        methodId: Number(dataPayment?.method?.id ?? ""),
        notes: dataPayment?.notes,
        paymentDate: dataPayment?.paymentDate,
        attachment: dataPayment?.attachment,
        customerId: Number(dataPayment?.customer?.id ?? ""),
        orderId: Number(dataPayment?.order?.id ?? ""),
        invoiceId: Number(dataPayment?.invoice?.id ?? ""),
        currencyId: Number(
          dataPayment?.currency?.id ?? dataPayment?.customer?.currency?.id ?? ""
        ),
      });
      setBalanceDue(
        dataPayment?.invoice?.balanceDue ? dataPayment?.invoice?.balanceDue : ""
      );
      setCurrency(dataPayment?.customer?.currency?.sign);
      searchInvoices(`customerId=${Number(dataPayment?.customer?.id)}`);
    }

    if (!editPayment) {
      removeQueryParam(["paymentId"]);
    }
  }, [editPayment]);

  const handleCloseModal = useCallback(() => {
    removeQueryParam(["paymentId"]);
    setFormDataUpdatePayment(FORM_DATA_UPDATE_PAYMENT);
    setEditPayment(false);
    setOpenModalDetail((prevOpenModalDetail: any) => !prevOpenModalDetail);
    setInfoImage({
      name: "",
      url: "",
    });
    clearData("dataListOrderHasInvoice");
    clearData("dataOrderList");
    clearData("dataCanPaidInvoiceList");
    setrChangeOrder(false);
    setChangeCustomer(false);
    setBalanceDue("");
    setCurrency("");
  }, [setOpenModalDetail]);

  useEffect(() => {
    if (dataUpdatePayment) removeQueryParam(["paymentId"]);
  }, [dataUpdatePayment]);

  const handleChangeInput = (key: any, value: any) => {
    key !== "amount"
      ? setFormDataUpdatePayment({
          ...formDataUpdatePayment,
          [key]: value ?? "",
        })
      : setFormDataUpdatePayment({
          ...formDataUpdatePayment,
          [key]: Number(removeCommaCurrencyValue(value)) ?? "",
        });
  };

  const handleChangeSelect = useCallback(
    (key: any, value: any) => {
      if (
        key === "customerId" &&
        Number(formDataUpdatePayment?.customerId) !== Number(value)
      ) {
        getListOrderHasInvoiceByCustomerId(value);
        searchInvoices(`customerId=${value}`);
        setChangeCustomer(true);
        getCurrencyList();
        getDetailCustomer(Number(value));
      }
      if (
        key === "orderId" &&
        Number(formDataUpdatePayment?.orderId) !== Number(value)
      ) {
        getCanPaidInvoicesListByOrderId(value);
        setrChangeOrder(true);
        getDetailOrder(value);
      }
      if (key === "invoiceId") {
        getDetailInvoice(value);
      }
      setFormDataUpdatePayment({
        ...formDataUpdatePayment,
        [key]: Number(value) ?? "",
      });
    },
    [
      formDataUpdatePayment,
      getListOrderHasInvoiceByCustomerId,
      searchInvoices,
      setChangeCustomer,
      getCurrencyList,
      getDetailCustomer,
      getCanPaidInvoicesListByOrderId,
      setrChangeOrder,
      getDetailOrder,
      getDetailInvoice,
      setFormDataUpdatePayment,
    ]
  );

  useEffect(() => {
    if (changeOrder && dataOrderDetail) {
      setFormDataUpdatePayment({
        ...formDataUpdatePayment,
        customerId: Number(dataOrderDetail?.customer?.id),
        invoiceId: "",
        currencyId: dataOrderDetail?.customer?.currency?.id
          ? Number(dataOrderDetail?.customer?.currency?.id)
          : "",
      });
      setBalanceDue("");

      setCurrency(dataOrderDetail?.customer?.currency?.sign);
    }
  }, [changeOrder, dataOrderDetail]);

  useEffect(() => {
    if (changeCustomer) {
      setFormDataUpdatePayment({
        ...formDataUpdatePayment,
        orderId: "",
        invoiceId: "",
      });

      setBalanceDue("");
      setCurrency("");
    }

    if (dataDetailCustomer) {
      setFormDataUpdatePayment({
        ...formDataUpdatePayment,
        currencyId: dataDetailCustomer?.currency?.id
          ? Number(dataDetailCustomer?.currency?.id)
          : "",
      });
    }

    if (dataDetailCustomer) setCurrency(dataDetailCustomer?.currency?.sign);
  }, [changeCustomer, dataDetailCustomer]);

  useEffect(() => {
    if (dataDetailInvoice) {
      setFormDataUpdatePayment({
        ...formDataUpdatePayment,
        customerId: Number(dataDetailInvoice?.order?.customer?.id),
        orderId: dataDetailInvoice?.order?.id
          ? Number(dataDetailInvoice?.order?.id)
          : "",
        currencyId: Number(dataDetailInvoice?.order?.customer?.currency?.id),
      });

      setBalanceDue(dataDetailInvoice?.balanceDue);
      setCurrency(dataDetailInvoice?.currency_sign);
    }
  }, [dataDetailInvoice]);

  const handleChangeTab = useCallback(
    (event: any, newValue: any) => {
      setTab(newValue);
    },
    [setTab]
  );

  const handleUpdatePayment = useCallback(() => {
    const { ...dataUpdate } = formDataUpdatePayment;
    const formData = new FormData();
    Object.keys(dataUpdate).forEach((key) => {
      formData.append(key, dataUpdate[key]);
    });
    updatePayment(dataPayment?.id, formData);
    clearData("dataUpdatePayment");
    setFormDataUpdatePayment({ ...FORM_DATA_UPDATE_PAYMENT });
    setEditPayment(false);
    setOpenModalDetail(false);
  }, [
    dataPayment,
    formDataUpdatePayment,
    updatePayment,
    clearData,
    setFormDataUpdatePayment,
    setEditPayment,
    setOpenModalDetail,
  ]);

  const handleEditPayment = () => {
    setEditPayment(true);
  };

  const handleChangeImage = (e: any) => {
    setFormDataUpdatePayment({
      ...formDataUpdatePayment,
      attachment: e.target.files[0],
    });
    const creatUrlObject = URL.createObjectURL(e.target.files[0]);
    setInfoImage({
      name: e.target.files[0].name,
      url: creatUrlObject,
    });
  };

  useEffect(() => {
    if (!openModalDetail) {
      clearData("dataPayment");
    }
  }, [openModalDetail]);

  const removeQueryParam = (paramList: any) => {
    const pathname = router.pathname;
    const query: any = router.query;
    const params = new URLSearchParams(query);
    paramList.forEach((param: any) => {
      params.delete(param);
    });
    router.replace({ pathname, query: params.toString() }, undefined, {
      shallow: true,
    });
  };

  const handleModalDeletePayment = useCallback(() => {
    deletePayment(dataPayment?.id);
  }, [deletePayment, dataPayment]);

  const handleDeletePayment = useCallback(() => {
    setOpenDeleteModal(true);
  }, [setOpenDeleteModal]);

  useEffect(() => {
    if (dataDeletePayment) {
      handleCloseModal();
    }
  }, [dataDeletePayment]);

  useEffect(() => {
    if (!dataPayment) {
      setOpenModalDetail(false);
    }
  }, [dataPayment]);

  useEffect(() => {
    if (
      Number(dataPayment?.customer?.id) !== formDataUpdatePayment?.customerId
    ) {
      setFormDataUpdatePayment({
        ...formDataUpdatePayment,
        orderId: "",
        invoiceId: "",
      });
    }
  }, [formDataUpdatePayment?.customerId]);

  return (
    <Dialog
      open={openModalDetail}
      onClose={handleCloseModal}
      scroll="body"
      fullWidth
      maxWidth={editPayment ? "sm" : "lg"}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      {dataPayment && (
        <>
          <DialogTitle
            className={styles["dialog-title"]}
            id="scroll-dialog-title"
          >
            <Typography variant="h6">
              {trans.payment.payment_details}
            </Typography>
            <Button onClick={handleCloseModal}>
              <Close />
            </Button>
          </DialogTitle>
          <Divider />
          <DialogContent className="">
            {editPayment ? (
              <TabCreateOrUpdatePayment
                tab="0"
                formDataPayment={formDataUpdatePayment}
                setQueryCode={setQueryCode}
                queryCode={queryCode}
                getInvoiceByCode={getInvoiceByCode}
                orderName={
                  dataInvoiceByCode?.data?.order?.name ??
                  dataPayment?.order?.name
                }
                customerId={
                  dataPayment?.customer?.id
                    ? Number(dataPayment?.customer.id)
                    : ""
                }
                balanceDue={balanceDue}
                curency={curency}
                handleChangeInput={handleChangeInput}
                handleChangeSelect={handleChangeSelect}
                dataPaymentMethods={dataPaymentMethods}
                handleChangeImage={handleChangeImage}
                infoImage={infoImage}
                dataCurrencyList={dataCurrencyList}
                dataCustomerList={dataCustomerList}
                dataListOrderHasInvoice={
                  dataListOrderHasInvoice ?? dataOrderList?.data
                }
                dataCanPaidInvoiceList={
                  dataCanPaidInvoiceList ?? dataInvoiceList?.data
                }
                updated={true}
                dataPayment={dataPayment}
                isLoggedInUserId={isLoggedInUserId}
              />
            ) : (
              <>
                <Box className={styles["box-detail"]}>
                  <Box className={styles["form-box"]}>
                    <Grid container>
                      <Grid className={styles["form-title"]} item xs={4}>
                        <Typography className={styles["form-typography"]}>
                          {trans.customer_detail.payment_id}
                        </Typography>
                      </Grid>
                      <Grid
                        className={`${styles["form-title-text"]} ${styles["flex-payment"]}`}
                        item
                        xs={8}
                      >
                        <Typography
                          className={`${styles["box-text-total"]} ml-8`}
                        >
                          #{dataPayment?.id}
                        </Typography>
                        {edit && (
                          <span
                            className="text-cursor mr-8"
                            onClick={handleEditPayment}
                          >
                            <EditIcon />
                          </span>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                  <Box className={styles["form-box"]}>
                    <Grid container>
                      <Grid className={styles["form-title"]} item xs={4}>
                        <Typography className={styles["form-typography"]}>
                          {trans.customer_detail.invoice_id}
                        </Typography>
                      </Grid>
                      <Grid className={styles["form-title-text"]} item xs={8}>
                        <Typography
                          className={`${styles["box-text-total-push"]} ml-8 text-cursor`}
                        >
                          {dataPayment?.invoice?.code ? (
                            <Link
                              href={
                                window.location.origin +
                                "/invoices/" +
                                dataPayment?.invoice?.id
                              }
                              className="text-overflow"
                            >
                              {dataPayment?.invoice?.code}
                            </Link>
                          ) : (
                            ""
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box className={styles["form-box"]}>
                    <Grid container>
                      <Grid className={styles["form-title"]} item xs={4}>
                        <Typography className={styles["form-typography"]}>
                          {trans.payment.amount_}
                        </Typography>
                      </Grid>
                      <Grid className={styles["form-title-text"]} item xs={8}>
                        <Typography
                          className={`${styles["box-text-total"]} ml-8`}
                        >
                          {formatCurrencyValue(dataPayment?.amount) ?? ""}{" "}
                          {dataPayment?.invoice?.currency_sign
                            ? dataPayment?.invoice?.currency_sign
                            : dataPayment?.currency?.sign ?? ""}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box className={styles["form-box"]}>
                    <Grid container>
                      <Grid className={styles["form-title"]} item xs={4}>
                        <Typography className={styles["form-typography"]}>
                          {trans.menu.customer}
                        </Typography>
                      </Grid>
                      <Grid className={styles["form-title-text"]} item xs={8}>
                        <Typography
                          className={`${styles["box-text-total-push"]} ml-8 text-cursor`}
                        >
                          {dataPayment?.customer?.name ||
                          dataPayment?.invoice?.order?.customer?.name ? (
                            <Link
                              href={
                                window.location.origin +
                                "/customer/" +
                                dataPayment?.customer?.id
                              }
                              className="text-overflow"
                            >
                              {dataPayment?.customer?.name ||
                                dataPayment?.invoice?.order?.customer?.name}
                            </Link>
                          ) : (
                            ""
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box className={styles["form-box"]}>
                    <Grid container>
                      <Grid className={styles["form-title"]} item xs={4}>
                        <Typography className={styles["form-typography"]}>
                          {trans.menu.order}
                        </Typography>
                      </Grid>
                      <Grid className={styles["form-title-text"]} item xs={8}>
                        <Typography
                          className={`${styles["box-text-total-push"]} ml-8 text-cursor`}
                        >
                          {dataPayment?.order?.name ||
                          dataPayment?.invoice?.order?.name ? (
                            <Link
                              href={
                                window.location.origin +
                                "/order/" +
                                dataPayment?.order?.id
                              }
                              className="text-overflow"
                            >
                              {dataPayment?.order?.name ||
                                dataPayment?.invoice?.order?.name}
                            </Link>
                          ) : (
                            ""
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box className={styles["form-box"]}>
                    <Grid container>
                      <Grid className={styles["form-title"]} item xs={4}>
                        <Typography className={styles["form-typography"]}>
                          {trans.payment.transaction_id}
                        </Typography>
                      </Grid>
                      <Grid className={styles["form-title-text"]} item xs={8}>
                        <Typography
                          className={`${styles["box-text-total"]} ml-8`}
                        >
                          {dataPayment?.transactionId}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box className={styles["form-box"]}>
                    <Grid container>
                      <Grid className={styles["form-title"]} item xs={4}>
                        <Typography className={styles["form-typography"]}>
                          {trans.customer_detail.date}
                        </Typography>
                      </Grid>
                      <Grid className={styles["form-title-text"]} item xs={8}>
                        <Typography
                          className={`${styles["box-text-total"]} ml-8`}
                        >
                          {fomatDate(dataPayment?.paymentDate)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box className={styles["form-box"]}>
                    <Grid container>
                      <Grid className={styles["form-title"]} item xs={4}>
                        <Typography className={styles["form-typography"]}>
                          {trans.payment.payment_method_}
                        </Typography>
                      </Grid>
                      <Grid className={styles["form-title-text"]} item xs={8}>
                        <Typography
                          className={`${styles["box-text-total"]} ml-8`}
                        >
                          {dataPayment?.method?.name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box className={styles["form-box"]}>
                    <Grid container>
                      <Grid className={styles["form-title"]} item xs={4}>
                        <Typography className={styles["form-typography"]}>
                          {trans.payment.notes}
                        </Typography>
                      </Grid>
                      <Grid className={styles["form-title-text"]} item xs={8}>
                        <Typography
                          className={`${styles["box-text-total"]} ml-8`}
                        >
                          <span
                            className="description-img"
                            dangerouslySetInnerHTML={{
                              __html: dataPayment?.notes,
                            }}
                          />
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      color="error"
                      style={{
                        marginLeft: "96%",
                      }}
                    >
                      <Tooltip
                        title="Delete"
                        onClick={handleDeletePayment}
                        style={{
                          display: "inline-block",
                          marginRight: "4px",
                        }}
                      >
                        <DeleteOutlineOutlinedIcon />
                      </Tooltip>
                    </IconButton>
                  </Box>
                </Box>
                <Card className="mt-8">
                  <Box>
                    <Tabs
                      value={tab}
                      aria-label="basic tabs example"
                      TabIndicatorProps={{
                        style: { display: "none" },
                      }}
                      onChange={handleChangeTab}
                    >
                      <Tab
                        className={styles["label-log"]}
                        label={trans.menu.lognote}
                        id="simple-tab-0"
                      />
                    </Tabs>
                  </Box>
                  <TabPanel value={tab} index={0}>
                    <Box style={{ padding: 16 }}>
                      <LogNote
                        isLoggedInUserId={isLoggedInUserId}
                        title={trans.home.activity}
                        object={dataPayment}
                        logNotes={dataPayment?.logNotes}
                        objectName="payments"
                        getObject={getPayment}
                      />
                    </Box>
                  </TabPanel>
                </Card>
              </>
            )}
          </DialogContent>
          {editPayment && (
            <DialogActions className={styles["dialog-actions"]}>
              <Button className="btn-save" onClick={handleUpdatePayment}>
                {trans.task.save}
              </Button>
              <Button onClick={handleCloseModal} className="btn-cancel">
                {trans.task.cancle}
              </Button>
            </DialogActions>
          )}
          <ModalDelete
            openModal={openDeleteModal}
            setOpenModal={setOpenDeleteModal}
            action={handleModalDeletePayment}
            title={trans.payment.you_re_about_to_delete_your_payment}
            content={
              trans.payment
                .this_payment_will_be_permenently_removed_and_you_won_t_be_able_to_see_them_again_
            }
          />
        </>
      )}
    </Dialog>
  );
};

const mapStateToProps = (state: any) => ({
  invoice: state.invoice,
  paymentMethod: state.paymentMethod,
  profile: state?.profile,
  payment: state?.payment,
  currency: state.currency,
  customer: state.customer,
  order: state.order,
});

const mapDispatchToProps = {
  clearData,
  updatePayment,
  getInvoiceByCode,
  getPaymentMethods,
  getDetailProfile,
  getPayment,
  getCurrencyList,
  searchCustomer,
  searchOrder,
  searchInvoices,
  getCanPaidInvoicesListByOrderId,
  getDetailOrder,
  getDetailInvoice,
  getDetailCustomer,
  getListOrderHasInvoiceByCustomerId,
  deletePayment,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormShowDetailPayment);
