import {
  Box,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tabs,
  Tab,
  Avatar,
  TableContainer,
  TextField,
  Button,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import type { NextPage } from "next";
import styles from "./styles.module.scss";
import { statusCode } from "../../../constants";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import HeadMeta from "../../../components/HeadMeta";
import Breadcrumb from "../../../components/Breadcumb";
import ModalDeleteNotification from "../../../components/Modal/ModalDeleteNotification";
import useTrans from "../../../utils/useTran";
import HandshakeIcon from "@mui/icons-material/Handshake";
import {
  getDetailPartner,
  clearData,
  updatePartner,
} from "../../../redux/actions/partner";
import { getDetailProfile } from "../../../redux/actions/profile";
import { searchUser } from "../../../redux/actions/user";
import styled from "styled-components";
import { getInvoiceStatusList } from "../../../redux/actions/invoice";
import {
  getDetailPartnerInvoice,
  updateInvoicePartnerCode,
  updateInvoicePartner,
} from "../../../redux/actions/partnerInvoice";
import LogoCraw from "../../../assets/images/logoCraw.png";
import LogNote from "../../../components/LogNote";
import DatePickerDefault from "../../../components/Input/DatePickerDefault";
import InputFormatNumber from "../../../components/Input/InputFormatNumber";
import FormCreatePaymentFormPartnerInvoice from "../../../components/Partner/FormCreatePaymentFormPartnerInvoice";

export const INIT_DATA = {
  startDate: "",
  dueDate: "",
  VAT: 0,
};

const PartnerInvoiceDetails: NextPage = (props: any) => {
  //use Hook
  const router = useRouter();
  const q: any = useMemo(() => router.query, [router]);
  const trans = useTrans();

  //varriable (if default)
  const id = q?.id || "";

  //props
  const {
    clearData,
    errors,
    getDetailPartnerInvoice,
    getDetailProfile,
    updateInvoicePartnerCode,
    updateInvoicePartner,
  } = props;
  const {
    dataDetailPartnerInvoice,
    dataUpdateInvoicePartnerCode,
    error,
    dataUpdateInvoicePartner,
  } = props?.partnerInvoice;
  const { dataDetailProfile } = props?.profile;
  //useState
  const [openModalDeleteNotification, setOpenModalDeleteNotification] =
    useState<boolean>(false);
  const [isLoggedInUserId, setIsLoggedInUserId] = useState<any>();
  const [values, setValues] = useState<any>(0);
  const [openEditName, setOpenEditName] = useState<boolean>(false);
  const [formEditCode, setFormEditCode] = useState<any>({
    code: "",
  });
  const [formUpdateInvoice, setFormUpdateInvoice] = useState<any>(INIT_DATA);
  const [openEditInvoice, setOpenEditInvocie] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { dataCreatePaymentPartner } = props.partnerPayment;

  //list handle open/close modal

  const showOrder = useCallback(
    (id: number) => {
      router.push(`/order/${id}`);
    },
    [router]
  );

  const showInvoice = useCallback(
    (id: number) => {
      router.push(`/invoices/${id}`);
    },
    [router]
  );

  const editName = () => {
    setOpenEditName(true);
  };

  const handleChangeCode = (value: any) => {
    setFormEditCode({ ...formEditCode, code: value ?? "" });
  };
  
  
const handleCodeChange = useCallback((e:any) => {
  handleChangeCode(e.target.value);
  }, [handleChangeCode]);


  const editInvoice = () => {
    setOpenEditInvocie(true);
  };

  const handleOpenCreatePayment = useCallback(() => {
    setOpenModal(true);
  }, []);

  const saveInvoice = () => {
    if (
      formUpdateInvoice?.dueDate !== dataDetailPartnerInvoice?.data?.due_date ||
      formUpdateInvoice?.startDate !==
        dataDetailPartnerInvoice?.data?.start_date ||
      formUpdateInvoice?.VAT !== dataDetailPartnerInvoice?.data?.VAT
    )
      updateInvoicePartner(formUpdateInvoice, id);
    setOpenEditInvocie(false);
  };

  const saveName = () => {
    if (formEditCode?.code != "") {
      if (formEditCode?.code !== dataDetailPartnerInvoice?.data?.code) {
        updateInvoicePartnerCode(
          formEditCode,
          Number(dataDetailPartnerInvoice?.data?.id)
        );
      }
      setOpenEditName(false);
    }
  };

  // list handle Change data
  const handleChangeInput = useCallback((key: any, value: any) => {
    setFormUpdateInvoice((prevFormUpdateInvoice: any) => {
      return { ...prevFormUpdateInvoice, [key]: value ?? "" };
    });
  }, []);

  //useEfffect
  useEffect(() => {
    if (errors != undefined && errors.statusCode == statusCode.NOT_FOUND)
      router.push("/404");
  }, [errors]);

  useEffect(() => {
    if (!dataDetailProfile) {
      getDetailProfile();
    } else {
      setIsLoggedInUserId(dataDetailProfile?.id);
    }
  }, [dataDetailProfile]);

  useEffect(() => {
    if (error?.response?.data?.statusCode === 500) {
      router.push("/404");
      clearData("error");
    }
  }, [error]);

  useEffect(() => {
    getDetailPartnerInvoice(id);
  }, [
    router.query,
    id,
    dataUpdateInvoicePartnerCode,
    dataUpdateInvoicePartner,
    dataCreatePaymentPartner,
  ]);

  useEffect(() => {
    setOpenModal(false);
  }, [dataCreatePaymentPartner]);

  useEffect(() => {
    if (dataDetailPartnerInvoice) {
      setFormUpdateInvoice({
        ...formUpdateInvoice,
        startDate: dataDetailPartnerInvoice?.data?.start_date,
        dueDate: dataDetailPartnerInvoice?.data?.due_date,
        VAT: Number(dataDetailPartnerInvoice?.data?.VAT),
      });
    }
  }, [dataDetailPartnerInvoice]);

  useEffect(() => {
    if (formUpdateInvoice?.startDate > formUpdateInvoice.dueDate) {
      setFormUpdateInvoice({
        ...formUpdateInvoice,
        dueDate: moment(formUpdateInvoice?.startDate)
          .add(1, "d")
          .format("YYYY-MM-DD"),
      });
    }
  }, [formUpdateInvoice]);

  useEffect(() => {
    if (openEditName) {
      setFormEditCode({
        code: dataDetailPartnerInvoice?.data?.code,
      });
    }
  }, [openEditName]);

  useEffect(() => {
    setValues(dataDetailPartnerInvoice?.data?.status - 1);
  }, [dataDetailPartnerInvoice]);
  // other (like const, varriable, ...)

  const AntTabs = styled(Tabs)({});
  const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      "&.Mui-selected": {
        clipPath: "polygon(8% 50%, 0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
        backgroundColor: "rgb(216, 247, 213)",
      },
    })
  );

  const invoicePartnerStatus = [
    { 1: "Created" },
    { 2: "" },
    { 3: "Over Due" },
    { 4: "" },
    { 5: "Complete" },
  ];

  return (
    <div>
      <HeadMeta
        title={trans.menu.invoice}
        param={dataDetailPartnerInvoice?.data?.code}
      />
      <Breadcrumb
        title={dataDetailPartnerInvoice?.data?.code}
        prevPage={trans.partner.partner_invoice}
        icon={<HandshakeIcon className={styles["icons"]} />}
      />
      <Box className={styles["contact-wrapper"]}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12}>
            <Paper>
              <Box
                sx={{
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <Grid
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ marginLeft: "10px" }}>
                    {dataDetailPartnerInvoice?.data?.status == 1 || dataDetailPartnerInvoice?.data?.status == 3 && (
                      <>
                        <Button
                          className={`${styles["text-detail-create"]} btn-create`}
                          onClick={handleOpenCreatePayment}
                        >
                          {trans.invoice.add_payment}
                        </Button>
                        <FormCreatePaymentFormPartnerInvoice
                          openModal={openModal}
                          setOpenModal={setOpenModal}
                          dataDetailInvoice={dataDetailPartnerInvoice?.data}
                        />
                      </>
                    )}
                  </Box>
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
                    className={styles["box-tab"]}
                  >
                    {invoicePartnerStatus?.map(
                      (invoice: any, index: number) => {
                        return (
                          <StyledTab
                            key={invoice.id}
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
                  <Box>
                    {dataDetailPartnerInvoice?.data?.status == 1 && (
                      <Box sx={{ paddingRight: "30px", cursor: "pointer" }}>
                        {!openEditInvoice ? (
                          <span onClick={editInvoice}>
                            <EditIcon />
                          </span>
                        ) : (
                          <span onClick={saveInvoice}>
                            <SaveIcon />
                          </span>
                        )}
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px 50px",
                }}
              >
                <Box>
                  {!openEditName ? (
                    <>
                      No:
                      <span className={styles["invoice-name"]}>
                        {dataDetailPartnerInvoice?.data?.code}
                      </span>
                    </>
                  ) : (
                    <TextField
                      id="standard-basic"
                      className={styles["edit-invoice-textField"]}
                      variant="standard"
                      value={formEditCode?.code}
                      sx={{ minWidth: "250px" }}
                      onChange={handleCodeChange}
                    />
                  )}
                  {dataDetailPartnerInvoice?.data?.status == 1 && (
                    <>
                      {!openEditName ? (
                        <span onClick={editName}>
                          <EditIcon
                            sx={{ marginLeft: "20px", cursor: "pointer" }}
                          />
                        </span>
                      ) : (
                        <span onClick={saveName}>
                          <SaveIcon
                            sx={{ marginLeft: "20px", cursor: "pointer" }}
                          />
                        </span>
                      )}
                    </>
                  )}
                </Box>
                <Box>
                  <Box
                    sx={{
                      float: "right",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {trans.invoice.invoice_date} :
                    {!openEditInvoice ? (
                      <Box sx={{ marginLeft: "10px" }}>
                        {dataDetailPartnerInvoice?.data?.start_date}
                      </Box>
                    ) : (
                      <Box sx={{ marginLeft: "10px" }}>
                        <DatePickerDefault
                          keyword="startDate"
                          size="small"
                          value={formUpdateInvoice?.startDate}
                          handleChange={handleChangeInput}
                        />
                      </Box>
                    )}
                  </Box>
                  <div className="clear"></div>
                  <Box
                    sx={{
                      float: "right",
                      display: "flex",
                      alignItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    {trans.order.due_date_} :
                    {!openEditInvoice ? (
                      <Box sx={{ marginLeft: "10px" }}>
                        {dataDetailPartnerInvoice?.data?.due_date}
                      </Box>
                    ) : (
                      <Box sx={{ marginLeft: "10px" }}>
                        <DatePickerDefault
                          keyword="dueDate"
                          size="small"
                          value={formUpdateInvoice?.dueDate}
                          handleChange={handleChangeInput}
                          minDate={formUpdateInvoice?.startDate}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "20px",
                }}
              >
                <Box sx={{ width: "50%" }}>
                  <Box className={styles["dev"]}>
                    <Box
                      className={styles["content"]}
                      sx={{ marginLeft: "10%" }}
                    >
                      <Avatar
                        alt="User"
                        sx={{
                          width: 50,
                          height: 50,
                          marginTop: "10px",
                          marginLeft: "10px",
                          background: "white",
                        }}
                      />
                      <div className={styles["company-name"]}>
                        {dataDetailPartnerInvoice?.data?.partnerName}
                      </div>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      marginTop: "30px",
                    }}
                  >
                    <Box
                      sx={{
                        fontWeight: "400",
                        color: "#667085",
                        marginLeft: "30px",
                      }}
                    >
                      {
                        dataDetailPartnerInvoice?.data?.customerPartner
                          ?.partners?.address
                      }
                    </Box>
                    <div className="clear"></div>
                    <Box
                      sx={{
                        fontSize: "17px",
                        fontWeight: "400",
                        color: "#667085",
                        marginTop: "15px",
                        marginLeft: "30px",
                      }}
                    >
                      {
                        dataDetailPartnerInvoice?.data?.customerPartner
                          ?.partners?.phone
                      }
                    </Box>
                    <div className="clear"></div>
                    <Box
                      sx={{
                        fontSize: "17px",
                        fontWeight: "400",
                        color: "#667085",
                        marginTop: "15px",
                        marginLeft: "30px",
                      }}
                    >
                      {
                        dataDetailPartnerInvoice?.data?.customerPartner
                          ?.partners?.email
                      }
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ width: "50%" }}>
                  <Box className={styles["dev2"]}>
                    <Box
                      className={styles["content"]}
                      sx={{ marginLeft: "30%" }}
                    >
                      <Avatar
                        src={LogoCraw.src}
                        alt="HapoSoft VN"
                        sx={{
                          width: 50,
                          height: 50,
                          marginTop: "10px",
                          marginLeft: "10px",
                          background: "white",
                        }}
                      />
                      <div className={styles["company-name"]}>HAPOSOFT VN</div>
                    </Box>
                  </Box>
                  <Box sx={{ marginLeft: "30px", marginTop: "30px" }}>
                    <Box
                      sx={{
                        fontSize: "17px",
                        fontWeight: "400",
                        color: "#667085",
                        float: "right",
                        marginRight: "100px",
                        marginTop: "30px",
                      }}
                    >
                      7F MITEC Tower, Dương Đình Nghệ, Yên Hoà, Cầu Giấy, Hà Nội
                      100000
                    </Box>
                    <div className="clear"></div>
                    <Box
                      sx={{
                        fontSize: "17px",
                        fontWeight: "400",
                        color: "#667085",
                        float: "right",
                        marginRight: "100px",
                        marginTop: "30px",
                      }}
                    >
                      0856 459 898
                    </Box>
                  </Box>
                </Box>
              </Box>
              <TableContainer
                component={Paper}
                style={{ padding: "24px", marginTop: "40px" }}
              >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell width="20%">
                        {trans.order.order_name}
                      </TableCell>
                      <TableCell width="20%">
                        {trans.partner.invoice_customer_id}
                      </TableCell>
                      <TableCell width="10%" className="text-align-center">
                        {trans.partner.Invoice_customer_amount}
                      </TableCell>
                      <TableCell width="10%" className="text-align-center">
                        {trans.partner.sale}
                      </TableCell>
                      <TableCell width="10%" className="text-align-center">
                        {trans.deal.value}
                      </TableCell>
                      <TableCell width="10%" className="text-align-center">
                        {trans.partner.VAT}
                      </TableCell>
                      <TableCell width="20%" className="text-align-center">
                        {trans.partner.total_amount_commission}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableCell className="text-cursor">
                      <div
                        onClick={() =>
                          showOrder(dataDetailPartnerInvoice?.data?.order?.id)
                        }
                      >
                        {dataDetailPartnerInvoice?.data?.order?.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-cursor" width="20%">
                      <div
                        onClick={() =>
                          showInvoice(
                            dataDetailPartnerInvoice?.data?.invoice?.id
                          )
                        }
                      >
                        {dataDetailPartnerInvoice?.data?.invoice?.code}
                      </div>
                    </TableCell>
                    <TableCell className="text-align-center" width="10%">
                      {dataDetailPartnerInvoice?.data?.invoice?.total_value}{" "}
                      {dataDetailPartnerInvoice?.data?.invoice?.currency_sign}{" "}
                    </TableCell>
                    <TableCell className="text-align-center" width="10%">
                      {dataDetailPartnerInvoice?.data?.salePercent} %
                    </TableCell>
                    <TableCell
                      sx={{ color: "#24d2b5" }}
                      className="text-align-center"
                      width="10%"
                    >
                      {dataDetailPartnerInvoice?.data?.total_value}{" "}
                      {dataDetailPartnerInvoice?.data?.currency_sign}
                    </TableCell>
                    <TableCell className="text-align-center" width="10%">
                      {!openEditInvoice ? (
                        <>{dataDetailPartnerInvoice?.data?.VAT}%</>
                      ) : (
                        <>
                          <InputFormatNumber
                            keyword="VAT"
                            size="small"
                            displayErrorText={false}
                            value={formUpdateInvoice?.VAT}
                            handleChange={handleChangeInput}
                          />
                        </>
                      )}
                    </TableCell>
                    <TableCell
                      sx={{ color: "red" }}
                      className="text-align-center"
                      width="10%"
                    >
                      {dataDetailPartnerInvoice?.data?.commisson_amount}{" "}
                      {dataDetailPartnerInvoice?.data?.currency_sign}
                    </TableCell>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Paper>
        <Box style={{ padding: 16 }}>
          <LogNote
            isLoggedInUserId={isLoggedInUserId}
            title={trans.home.activity}
            object={dataDetailPartnerInvoice?.data}
            logNotes={dataDetailPartnerInvoice?.logNote}
            objectName="invoice_partner"
            getObject={getDetailPartnerInvoice}
          />
        </Box>
      </Paper>
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
  invoice: state?.invoice,
  partnerInvoice: state?.partnerInvoice,
  partnerPayment: state?.partnerPayment,
});

const mapDispatchToProps = {
  clearData,
  getDetailPartner,
  getDetailProfile,
  searchUser,
  updatePartner,
  getInvoiceStatusList,
  getDetailPartnerInvoice,
  updateInvoicePartnerCode,
  updateInvoicePartner,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PartnerInvoiceDetails);
