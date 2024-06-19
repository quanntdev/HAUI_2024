import {
  Box,
  Grid,
  CardContent,
  Typography,
  Paper,
  IconButton,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import type { NextPage } from "next";
import styles from "./styles.module.scss";
import { statusCode } from "../../../constants";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import SelectDefault from "../../../components/Input/SelectDefault";
import HeadMeta from "../../../components/HeadMeta";

import Breadcrumb from "../../../components/Breadcumb";
import InputBase from "../../../components/Input/InputBase";
import InputTiny from "../../../components/Input/InputTiny";
import ModalDeleteNotification from "../../../components/Modal/ModalDeleteNotification";
import useTrans from "../../../utils/useTran";
import HandshakeIcon from "@mui/icons-material/Handshake";
import {
  getDetailPartner,
  clearData,
  updatePartner,
  getPartnerContract,
} from "../../../redux/actions/partner";
import { getFirstValueInObject } from "../../../helpers";
import { CUSTOMER_PRIORITY_LIST } from "../../../constants/customer";
import Link from "next/link";
import { getDetailProfile } from "../../../redux/actions/profile";
import { searchUser } from "../../../redux/actions/user";
import moment from "moment";

const INIT_DATA = {
  email: null,
  name: "",
  phone: null,
  fax: "",
  website: null,
  address: "",
  description: "",
  assignedId: null,
  priorityId: null,
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

interface InitData {
  email: string | null;
  name: string;
  phone: string | null;
  fax: string;
  website: string | null;
  address: string;
  description: string;
  assignedId: number | null;
  priorityId: number | null;
}

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

const CustomerDetail: NextPage = (props: any) => {
  //use Hook
  const router = useRouter();
  const q: any = useMemo(() => router.query, [router]);
  const tabRef = useRef<HTMLDivElement>(null);
  const trans = useTrans();

  //varriable (if default)
  const id = q?.id ?? "";

  //props
  const {
    clearData,
    errors,
    getDetailPartner,
    getDetailProfile,
    searchUser,
    updatePartner,
    getPartnerContract,
  } = props;
  const { dataDetailPartner, error, dataUpdatePartner, dataPartnerContract } =
    props.partner;
  const { dataDetailProfile } = props?.profile;
  const { dataUserList } = props.user;

  //useState
  const [initForm, setInitForm] = useState<InitData>(INIT_DATA);
  const [errorForm, setErrorForm] = useState(INIT_ERROR);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [isLoggedInUserId, setIsLoggedInUserId] = useState<any>();
  const [openModalDeleteNotification, setOpenModalDeleteNotification] =
    useState<boolean>(false);
  const [editDescriptionButton, setEditDescriptionButton] =
    useState<boolean>(false);

  //list handle open/close modal
  const handleEditDescription = useCallback(() => {
    setEditDescriptionButton(
      (prevEditDescriptionButton) => !prevEditDescriptionButton
    );
    if (
      editDescriptionButton &&
      initForm?.description !== dataDetailPartner?.description
    ) {
      updatePartner(initForm, id);
    }
  }, [editDescriptionButton, initForm, dataDetailPartner, id, updatePartner]);

  const handleShowPayment = (id: number) =>
    router.push(`/partner/partner-payment?paymentId=${id}`);

  const handleEditCustomer = useCallback(() => {
    clearData("error");
    setErrorForm(INIT_ERROR);
    if (!openEditModal) {
      return setOpenEditModal(true);
    }

    if (
      openEditModal &&
      (initForm.name !== dataDetailPartner?.name ||
        initForm?.address !== dataDetailPartner?.address ||
        initForm?.email !== dataDetailPartner?.email ||
        initForm?.phone !== dataDetailPartner?.phone ||
        initForm?.fax !== dataDetailPartner?.fax ||
        initForm?.website !== dataDetailPartner?.website ||
        initForm?.assignedId !== Number(dataDetailPartner?.userAssign?.id) ||
        initForm?.priorityId !==
          (dataDetailPartner?.priority
            ? Number(dataDetailPartner?.priority)
            : dataDetailPartner?.priority))
    ) {
      updatePartner(initForm, id);
    } else {
      setOpenEditModal(false);
    }
  }, [
    openEditModal,
    initForm,
    dataDetailPartner,
    id,
    clearData,
    setErrorForm,
    setOpenEditModal,
    updatePartner,
  ]);

  // list handle Change data
  const handleChangeInput = useCallback((key: any, value: any) => {
    setInitForm((prevInitForm) => {
      return { ...prevInitForm, [key]: value ?? "" };
    });
  }, []);

  const handleChangeSelect = useCallback((key: any, value: any) => {
    setInitForm((prevInitForm) => {
      return { ...prevInitForm, [key]: Number(value) };
    });
  }, []);

  //useEfffect

  useEffect(() => {
    if (errors != undefined && errors.statusCode == statusCode.NOT_FOUND)
      router.push("/404");
  }, [errors]);

  useEffect(() => {
    if (error?.response?.data?.statusCode === 500) {
      router.push("/404");
      clearData("error");
    }
  }, [error]);

  useEffect(() => {
    if (id) {
      getDetailPartner(id);
      getPartnerContract(id);
    }
  }, [id, dataUpdatePartner]);

  useEffect(() => {
    if (dataDetailPartner) {
      setInitForm({
        ...INIT_DATA,
        email: dataDetailPartner?.email,
        name: dataDetailPartner?.name,
        phone: dataDetailPartner?.phone,
        fax: dataDetailPartner?.fax,
        website: dataDetailPartner?.website,
        address: dataDetailPartner?.address,
        description: dataDetailPartner?.description,
        priorityId: dataDetailPartner?.priority
          ? Number(dataDetailPartner?.priority)
          : null,
        assignedId: dataDetailPartner?.userAssign
          ? Number(dataDetailPartner?.userAssign?.id)
          : null,
      });
    }
  }, [dataDetailPartner]);

  useEffect(() => {
    if (!dataDetailProfile) {
      getDetailProfile();
    } else {
      setIsLoggedInUserId(dataDetailProfile?.id);
    }
  }, [dataDetailProfile]);

  useEffect(() => {
    if (openEditModal) {
      dataUserList ?? searchUser();
    }
  }, [openEditModal]);

  useEffect(() => {
    if (error?.message) {
      setErrorForm({
        ...errorForm,
        ...error?.response?.data?.properties,
        ["message"]: error?.message,
      });
      setOpenEditModal(true);
    } else {
      clearData("error");
      setErrorForm(INIT_ERROR);
    }
    if (dataUpdatePartner) {
      clearData("dataUpdatePartner");
      setOpenEditModal(false);
    }
  }, [error, dataUpdatePartner]);

  useEffect(() => {
    if (dataDetailPartner) {
      setOpenEditModal(false);
    }

    if (error) {
      setOpenEditModal(true);
    }
  }, [dataUpdatePartner, error]);

  // other (like const, varriable, ...)
  const optionUser = dataUserList?.items?.map(
    (key: { id: any; profile: any }) => ({
      id: key?.id,
      name: key?.profile?.first_name + key?.profile?.last_name,
      value: key?.id,
    })
  );

  const hanleToCustomer = (id: number) => router.push(`/customer/${id}`);

  const hanleToOrder = (id: number) => router.push(`/order/${id}`);

  return (
    <div>
      <HeadMeta title={trans.menu.partner} param={dataDetailPartner?.name} />
      <Breadcrumb
        title={dataDetailPartner?.name}
        prevPage={trans.menu.partner}
        icon={<HandshakeIcon className={styles["icons"]} />}
      />
      <Box className={styles["contact-wrapper"]}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12}>
            <Paper>
              <Box className={styles["contact-item-description"]} ref={tabRef}>
                <Box className={styles.boxGuide}>
                  <div className={styles["delete-btn"]}></div>
                  <Box className={styles.boxTabPanel}>
                    <TabPanel>
                      <Grid container>
                        <Grid item xs={12} sm={12}>
                          <Paper elevation={0}>
                            <Box className={styles["contact-box"]}>
                              <Grid item xs>
                                <Paper>
                                  <CardContent
                                    className={styles["contact-card"]}
                                  >
                                    <Grid container spacing={1}>
                                      <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        className={
                                          styles["contact-content-info"]
                                        }
                                      >
                                        <Box>
                                          <IconButton
                                            aria-label="edit"
                                            className="float-right"
                                            onClick={handleEditCustomer}
                                          >
                                            {!openEditModal ? (
                                              <EditIcon
                                                className={
                                                  styles["contact-icon-info"]
                                                }
                                              />
                                            ) : (
                                              <SaveIcon
                                                className={
                                                  styles["edit-icon-info"]
                                                }
                                              />
                                            )}
                                          </IconButton>
                                        </Box>
                                        <Box
                                          className={styles["contact-content"]}
                                        >
                                          <Box
                                            className={styles["contact-flex"]}
                                          >
                                            <Grid
                                              container
                                              className={
                                                styles["contact-detail-row"]
                                              }
                                            >
                                              <Box
                                                className={styles["box-title"]}
                                                sx={{
                                                  width: `98% !important`,
                                                }}
                                              >
                                                <Typography>
                                                  {trans.partner.partner_detail}
                                                  <IconButton
                                                    aria-label="edit"
                                                    onClick={handleEditCustomer}
                                                    sx={{
                                                      padding: 0,
                                                      marginLeft: "20px",
                                                    }}
                                                  >
                                                    {!openEditModal ? (
                                                      <EditIcon
                                                        className={
                                                          styles[
                                                            "contact-icon-address"
                                                          ]
                                                        }
                                                      />
                                                    ) : (
                                                      <SaveIcon
                                                        className={
                                                          styles[
                                                            "edit-icon-address"
                                                          ]
                                                        }
                                                      />
                                                    )}
                                                  </IconButton>
                                                </Typography>
                                              </Box>
                                            </Grid>
                                            <Grid
                                              container
                                              className={
                                                styles["contact-detail-row"]
                                              }
                                            >
                                              <Grid
                                                item
                                                md={4}
                                                xs
                                                className={
                                                  styles["contact-detail-title"]
                                                }
                                              >
                                                {trans.partner.partner_name}
                                              </Grid>
                                              {openEditModal ? (
                                                <Grid item xs={6}>
                                                  <InputBase
                                                    keyword="name"
                                                    size="small"
                                                    value={initForm?.name}
                                                    handleChange={
                                                      handleChangeInput
                                                    }
                                                    errorText={getFirstValueInObject(
                                                      errorForm?.name
                                                    )}
                                                  />
                                                </Grid>
                                              ) : (
                                                <Grid item xs>
                                                  {dataDetailPartner?.name}
                                                </Grid>
                                              )}
                                            </Grid>

                                            <Grid
                                              container
                                              className={
                                                styles["contact-detail-row"]
                                              }
                                            >
                                              <Grid
                                                item
                                                md={4}
                                                xs
                                                className={
                                                  styles["contact-detail-title"]
                                                }
                                              >
                                                {trans.customer_detail.assigned}
                                              </Grid>
                                              {openEditModal ? (
                                                <Grid item xs={6}>
                                                  <SelectDefault
                                                    keyword="assignedId"
                                                    keyMenuItem="id"
                                                    keyValue="name"
                                                    data={optionUser}
                                                    value={initForm?.assignedId}
                                                    handleChange={
                                                      handleChangeSelect
                                                    }
                                                    size="small"
                                                  />
                                                </Grid>
                                              ) : (
                                                <Grid item xs>
                                                  {dataDetailPartner?.userAssign
                                                    ? dataDetailPartner
                                                        ?.userAssign?.profile
                                                        ?.first_name +
                                                      dataDetailPartner
                                                        ?.userAssign?.profile
                                                        ?.last_name
                                                    : " "}
                                                </Grid>
                                              )}
                                            </Grid>

                                            <Grid
                                              container
                                              className={
                                                styles["contact-detail-row"]
                                              }
                                            >
                                              <Grid
                                                item
                                                md={4}
                                                xs
                                                className={
                                                  styles["contact-detail-title"]
                                                }
                                              >
                                                {trans.customer_detail.priority}
                                              </Grid>
                                              {openEditModal ? (
                                                <Grid item xs={6}>
                                                  <SelectDefault
                                                    keyword="priorityId"
                                                    keyMenuItem="id"
                                                    keyValue="name"
                                                    data={
                                                      CUSTOMER_PRIORITY_LIST
                                                    }
                                                    value={initForm?.priorityId}
                                                    handleChange={
                                                      handleChangeSelect
                                                    }
                                                    size="small"
                                                  />
                                                </Grid>
                                              ) : (
                                                <Grid item xs>
                                                  <Chip
                                                    label={
                                                      initForm?.priorityId
                                                        ? CUSTOMER_PRIORITY_LIST[
                                                            initForm?.priorityId -
                                                              1
                                                          ]?.label
                                                        : ""
                                                    }
                                                    style={{
                                                      background:
                                                        initForm?.priorityId
                                                          ? CUSTOMER_PRIORITY_LIST[
                                                              initForm?.priorityId -
                                                                1
                                                            ]?.backgroundcolor
                                                          : "",
                                                      color:
                                                        initForm?.priorityId
                                                          ? CUSTOMER_PRIORITY_LIST[
                                                              initForm?.priorityId -
                                                                1
                                                            ]?.color
                                                          : "",
                                                    }}
                                                  />
                                                </Grid>
                                              )}
                                            </Grid>
                                          </Box>
                                        </Box>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        className={styles["line-dash"]}
                                      >
                                        <Box
                                          className={`${styles["contact-content"]}`}
                                        >
                                          <Box
                                            className={styles["contact-flex"]}
                                            sx={{ marginLeft: "23px" }}
                                          >
                                            <Grid
                                              container
                                              className={
                                                styles["contact-detail-row"]
                                              }
                                            >
                                              <Grid
                                                container
                                                className={
                                                  styles["contact-detail-row"]
                                                }
                                              >
                                                <Box
                                                  className={
                                                    styles["box-title-right"]
                                                  }
                                                >
                                                  <Typography>
                                                    {
                                                      trans.customer_detail
                                                        .address_infomation
                                                    }
                                                    <IconButton
                                                      aria-label="edit"
                                                      onClick={
                                                        handleEditCustomer
                                                      }
                                                      sx={{
                                                        padding: 0,
                                                        marginLeft: "20px",
                                                      }}
                                                    >
                                                      {!openEditModal ? (
                                                        <EditIcon
                                                          className={
                                                            styles[
                                                              "contact-icon-address"
                                                            ]
                                                          }
                                                        />
                                                      ) : (
                                                        <SaveIcon
                                                          className={
                                                            styles[
                                                              "edit-icon-address"
                                                            ]
                                                          }
                                                        />
                                                      )}
                                                    </IconButton>
                                                  </Typography>
                                                </Box>
                                              </Grid>
                                            </Grid>

                                            <Grid
                                              container
                                              className={
                                                styles["contact-detail-row"]
                                              }
                                            >
                                              <Grid
                                                item
                                                md={4}
                                                xs
                                                className={
                                                  styles["contact-detail-title"]
                                                }
                                              >
                                                {trans.customer_detail.address}
                                              </Grid>
                                              {openEditModal ? (
                                                <Grid item xs={6}>
                                                  <InputBase
                                                    keyword="address"
                                                    size="small"
                                                    dataDetailPartner
                                                    value={initForm?.address}
                                                    handleChange={
                                                      handleChangeInput
                                                    }
                                                  />
                                                </Grid>
                                              ) : (
                                                <Grid item xs>
                                                  {dataDetailPartner?.address}
                                                </Grid>
                                              )}
                                            </Grid>

                                            <Grid
                                              container
                                              className={
                                                styles["contact-detail-row"]
                                              }
                                            >
                                              <Grid
                                                item
                                                md={4}
                                                xs
                                                className={
                                                  styles["contact-detail-title"]
                                                }
                                              >
                                                {trans.customer_detail.email}
                                              </Grid>
                                              {openEditModal ? (
                                                <Grid item xs={6}>
                                                  <InputBase
                                                    keyword="email"
                                                    size="small"
                                                    value={initForm?.email}
                                                    handleChange={
                                                      handleChangeInput
                                                    }
                                                    errorText={getFirstValueInObject(
                                                      errorForm?.email
                                                    )}
                                                  />
                                                </Grid>
                                              ) : (
                                                <Grid item xs>
                                                  {dataDetailPartner?.email}
                                                </Grid>
                                              )}
                                            </Grid>

                                            <Grid
                                              container
                                              className={
                                                styles["contact-detail-row"]
                                              }
                                            >
                                              <Grid
                                                item
                                                md={4}
                                                xs
                                                className={
                                                  styles["contact-detail-title"]
                                                }
                                              >
                                                {trans.customer_detail.website}
                                              </Grid>
                                              {openEditModal ? (
                                                <Grid item xs={6}>
                                                  <InputBase
                                                    keyword="website"
                                                    size="small"
                                                    value={initForm?.website}
                                                    handleChange={
                                                      handleChangeInput
                                                    }
                                                    errorText={getFirstValueInObject(
                                                      errorForm?.website
                                                    )}
                                                  />
                                                </Grid>
                                              ) : (
                                                <Grid item xs>
                                                  {dataDetailPartner?.website && (
                                                    <Link
                                                      href={
                                                        dataDetailPartner?.website
                                                      }
                                                    >
                                                      <a
                                                        className="text-cursor"
                                                        target="_blank"
                                                      >
                                                        {
                                                          dataDetailPartner?.website
                                                        }
                                                      </a>
                                                    </Link>
                                                  )}
                                                </Grid>
                                              )}
                                            </Grid>
                                            <Grid
                                              container
                                              className={
                                                styles["contact-detail-row"]
                                              }
                                            >
                                              <Grid
                                                item
                                                md={4}
                                                xs
                                                className={
                                                  styles["contact-detail-title"]
                                                }
                                              >
                                                {trans.customer_detail.phone}
                                              </Grid>
                                              {openEditModal ? (
                                                <Grid item xs={6}>
                                                  <InputBase
                                                    keyword="phone"
                                                    size="small"
                                                    value={initForm?.phone}
                                                    handleChange={
                                                      handleChangeInput
                                                    }
                                                    errorText={getFirstValueInObject(
                                                      errorForm?.phone
                                                    )}
                                                  />
                                                </Grid>
                                              ) : (
                                                <Grid item xs>
                                                  {dataDetailPartner?.phone}
                                                </Grid>
                                              )}
                                            </Grid>
                                          </Box>
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </CardContent>
                                </Paper>
                              </Grid>
                            </Box>
                          </Paper>
                        </Grid>
                        <Box sx={{ width: "100%" }}>
                          <div className={styles["box-header"]}>
                            <div className={styles["box-header-item"]}>
                              <div className={styles["content"]}>
                                <div className={styles["money"]}>
                                  {dataPartnerContract?.totalPaymentAndInvoice?.invoiceTotal.toFixed(
                                    2
                                  )}
                                </div>
                                <div className={styles["name"]}>
                                  {trans.customer_detail.total_invoice_amount} (
                                  {dataPartnerContract?.baseCurreny?.sign})
                                </div>
                              </div>
                            </div>
                            <div className={styles["box-header-calculate"]}>
                              -
                            </div>
                            <div className={styles["box-header-item"]}>
                              <div className={styles["content"]}>
                                <div className={styles["money"]}>
                                  {dataPartnerContract?.totalPaymentAndInvoice?.paymentPartnerTotal.toFixed(
                                    2
                                  )}{" "}
                                </div>
                                <div className={styles["name"]}>
                                  {trans.customer_detail.total_payment_amount} (
                                  {dataPartnerContract?.baseCurreny?.sign})
                                </div>
                              </div>
                            </div>
                            <div className={styles["box-header-calculate"]}>
                              =
                            </div>
                            <div className={styles["box-header-item"]}>
                              <div className={styles["content"]}>
                                <div className={styles["money-haspay"]}>
                                  {dataPartnerContract?.sumBalance?.toFixed(2)}
                                </div>
                                <div className={styles["name"]}>
                                  {trans.customer_detail.total_balance} (
                                  {dataPartnerContract?.baseCurreny?.sign})
                                </div>
                              </div>
                            </div>
                          </div>
                        </Box>
                        {dataDetailPartner?.partnersCustomer?.length > 0 && (
                          <CardContent className={styles["contact-card"]}>
                            <Grid item xs={12} sm={12}>
                              <Box className={styles["box-head"]}>
                                <Typography className={styles["box-title"]}>
                                  {trans.partner.contract_information}
                                </Typography>
                              </Box>
                              <Box className={styles["box-content"]}>
                                <Table stickyHeader>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell width="15%">
                                        {trans.customer.customer_name}
                                      </TableCell>
                                      <TableCell width="10%">
                                        {trans.order.order_name}
                                      </TableCell>
                                      <TableCell width="15%">
                                        {trans.partner.partner_payment_option}
                                      </TableCell>
                                      <TableCell width="20%">
                                        {trans.invoice.invoiceID}
                                      </TableCell>
                                      <TableCell width="10%">
                                        {trans.partner.sale}
                                      </TableCell>
                                      <TableCell width="15%">
                                        {
                                          trans.customer_detail
                                            .total_payment_amount
                                        }
                                      </TableCell>
                                      <TableCell width="15%">
                                        {trans.partner.payment_tern}
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {dataDetailPartner?.partnersCustomer?.map(
                                      (item: any, index: any) => (
                                        <>
                                          <TableRow
                                            key={item?.id}
                                            sx={{
                                              "&:last-child td, &:last-child th":
                                                {
                                                  border: 0,
                                                },
                                            }}
                                          >
                                            <TableCell className="text-cursor">
                                              <div
                                                onClick={() =>
                                                  hanleToCustomer(
                                                    item?.partnerCustomer?.id
                                                  )
                                                }
                                              >
                                                {item?.partnerCustomer?.name}
                                              </div>
                                            </TableCell>
                                            <TableCell className="text-cursor">
                                              <div
                                                onClick={() =>
                                                  hanleToOrder(
                                                    item?.partnerOrder?.id
                                                  )
                                                }
                                              >
                                                {item?.partnerOrder?.name}
                                              </div>
                                            </TableCell>
                                            <TableCell>
                                              {item?.saleType == 1
                                                ? trans.partner
                                                    ?.TOTAL_PAYMENT_REVENUE
                                                : trans.partner
                                                    ?.TOTAL_PAYMENT_BY_PERIOD}
                                            </TableCell>
                                            <TableCell>
                                              {item?.partnersInvoice?.map(
                                                (invoice: any, index: any) => (
                                                  <Box
                                                    key={invoice?.id}
                                                    sx={{ marginTop: "5px" }}
                                                  >
                                                    {invoice?.code}
                                                  </Box>
                                                )
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              {item?.salePercent}
                                            </TableCell>
                                            <TableCell>
                                              {item?.partnerOrder?.paymentPartner?.map(
                                                (payment: any, index: any) => (
                                                  <div
                                                    key={payment?.id}
                                                    className="text-cursor mt-8"
                                                    onClick={() =>
                                                      handleShowPayment(
                                                        payment?.id
                                                      )
                                                    }
                                                  >
                                                    #PIP{payment?.id}
                                                  </div>
                                                )
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              {item?.startDate
                                                ? moment(
                                                    item?.startDate
                                                  ).format("YYYY-MM-DD")
                                                : ""}{" "}
                                              {item?.startDate ? "-" : ""}{" "}
                                              {item?.endDate
                                                ? moment(item?.endDate).format(
                                                    "YYYY-MM-DD"
                                                  )
                                                : ""}
                                            </TableCell>
                                          </TableRow>
                                        </>
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Grid>
                          </CardContent>
                        )}
                        <Grid item xs={12} sm={12}>
                          <Paper elevation={0}>
                            <Box className={styles["contact-box"]}>
                              <Grid item xs>
                                <Paper>
                                  <CardContent
                                    className={styles["contact-card"]}
                                  >
                                    <Grid item xs={12} sm={12}>
                                      <Box className={styles["box-head"]}>
                                        <Typography
                                          className={styles["box-title"]}
                                        >
                                          {
                                            trans.customer_detail
                                              .description_information
                                          }
                                          <IconButton
                                            aria-label="edit"
                                            onClick={handleEditDescription}
                                            sx={{
                                              marginLeft: "20px",
                                              padding: 0,
                                            }}
                                          >
                                            {!editDescriptionButton ? (
                                              <EditIcon
                                                className={styles["edit-icon"]}
                                              />
                                            ) : (
                                              <SaveIcon
                                                className={styles["edit-icon"]}
                                              />
                                            )}
                                          </IconButton>
                                        </Typography>
                                      </Box>
                                      <Box className={styles["box-content"]}>
                                        {!editDescriptionButton ? (
                                          <Typography>
                                            <span
                                              className="description-img"
                                              dangerouslySetInnerHTML={{
                                                __html: initForm.description,
                                              }}
                                            />
                                          </Typography>
                                        ) : (
                                          <InputTiny
                                            handleChange={handleChangeInput}
                                            keyword="description"
                                            value={initForm?.description}
                                            object={dataDetailPartner}
                                            // objectName={"customers"}
                                            isLoggedInUserId={isLoggedInUserId}
                                            onEdit={false}
                                          />
                                        )}
                                      </Box>
                                    </Grid>
                                  </CardContent>
                                </Paper>
                              </Grid>
                            </Box>
                          </Paper>
                        </Grid>
                      </Grid>
                    </TabPanel>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <ModalDeleteNotification
        openModalDeleteNotification={openModalDeleteNotification}
        setOpenModalDeleteNotification={setOpenModalDeleteNotification}
        title={trans.customer_detail.you_re_about_to_delete_your_customer}
        content={trans.customer_detail.cannot_delete_customer}
      />
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  errors: state.customer?.error?.response?.data,
  partner: state.partner,
  profile: state?.profile,
  user: state.user,
});

const mapDispatchToProps = {
  clearData,
  getDetailPartner,
  getDetailProfile,
  searchUser,
  updatePartner,
  getPartnerContract,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetail);
