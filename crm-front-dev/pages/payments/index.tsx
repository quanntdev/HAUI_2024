import {
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  Hidden,
  IconButton,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { NextPage } from "next";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import styles from "./styles.module.scss";
import Breadcrumb from "../../components/Breadcumb";
import InputSearch from "../../components/Input/InputSearch";
import FormCreatePayment from "../../components/Payment/FormCreatePayment";
import FormShowDetailPayment from "../../components/Payment/FormShowDetailPayment";
import PaginationDefault from "../../components/Pagination";
import { searchPayment, getPayment } from "../../redux/actions/payment";
import { getCurrencyList } from "../../redux/actions/currency";
import { keyPage, rowsPerPage } from "../../constants";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import { useRouter } from "next/router";
import { getPageFromParams } from "../../helpers";
import { getPaymentMethods } from "../../redux/actions/paymentMethod";
import { IconReportMoney } from "@tabler/icons";
import HeadMeta from "../../components/HeadMeta";
import { clearData } from "../../redux/actions/auth";
import Link from "next/link";
import QueryListBar from "../../components/QueryListBar";
import useTrans from "../../utils/useTran";
import fomatDate from "../../utility/fomatDate";

const BoxTotalPrice = styled("div")(({ theme }) => ({
  padding: "10px",
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

const Payment: NextPage = (props: any) => {
  const trans = useTrans();
  const { dataDeletePayment } = props.payment;
  const { searchPayment, getCurrencyList, getPayment, clearData } = props;
  const [paymentId, setPaymentId] = useState<any>();
  const hasParam = window.location.href.indexOf("?") !== -1;
  const { dataPaymentList, dataCreatePayment, dataUpdatePayment, dataPayment } =
    props.payment;
  const { dataPaymentMethods } = props.paymentMethod;
  const { dataCurrencyList } = props.currency;
  const [querySearch, setQuerySearch] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalDetail, setOpenModalDetail] = useState<boolean>(false);
  const [showTotalStatistic, setShowTotalStatistic] = useState<boolean>(false);
  const [disableShowHideButton, setDisableShowHideButton] =
    useState<boolean>(true);
  const [currencyId, setCurrencyId] = useState<string>("");
  const [currencySign, setCurrencySign] = useState<string>("");
  const router = useRouter();
  const [pageOrderItem, setPageOrderItem] = useState<number>(1);
  const q: any = useMemo(() => router.query, [router]);

  useEffect(() => {
    const currentPage = getPageFromParams(router.query[keyPage]);
    const querySearch = Object.entries(q)
      .map(
        (item, index) => `${index !== 0 ? "&" : ""}${item[0]}=${item[1] || ""}`
      )
      .join("");
    searchPayment(
      `limit=${rowsPerPage}&offset=${currentPage * rowsPerPage}&${querySearch}`
    );
  }, [router.query]);

  useEffect(() => {
    if (router?.query?.paymentId) {
      clearData("dataPayment");
      if (Number(router?.query?.paymentId) > 0) {
        getPayment(
          Number(router?.query?.paymentId),
          `limit=${rowsPerPage}&offset=0`
        );
      }
      setOpenModalDetail(true);
    }
  }, [router?.query]);

  useEffect(() => {
    setOpenModal(false);
  }, [q]);

  useEffect(() => {
    if (!openModalDetail) {
      clearData("dataPayment");
    }
  }, [openModalDetail]);

  useEffect(() => {
    if (!dataCurrencyList) {
      getCurrencyList();
    }
  }, [dataCurrencyList]);

  useEffect(() => {
    if (!dataPaymentList?.totalData) {
      setDisableShowHideButton(true);
      setShowTotalStatistic(false);
    }
  }, [dataPaymentList]);

  useEffect(() => {
    const qList = router.query;
    if (qList.currencyId) {
      const currencySign = dataCurrencyList?.find(
        (item: any) => item.id == qList.currencyId
      )?.sign;
      if (currencySign) {
        setDisableShowHideButton(false);
        setCurrencySign(currencySign);
      }
    }
  }, [router.query]);

  useEffect(() => {
    if (dataUpdatePayment) {
      const currentPage = getPageFromParams(router.query[keyPage]);
      searchPayment(`limit=${rowsPerPage}&offset=${currentPage * rowsPerPage}`);
    }
    if (dataCreatePayment) router.push("/payments");
  }, [dataUpdatePayment, dataCreatePayment, dataDeletePayment]);

  useEffect(() => {
    if (querySearch) searchPayment(querySearch);
  }, [querySearch, router.query]);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const handleShowTotalStatistic = () => {
    setShowTotalStatistic(!showTotalStatistic);
  };

  useEffect(() => {
    if (!openModalDetail) {
      clearData("dataPayment");
    }
  }, [openModalDetail]);

  const renderAmount = (item: {
    amount: any;
    invoice: { currency_sign: any };
    currency: { sign: any };
  }) => {
    const amount = item?.amount;
    const currencySign =
      item?.invoice?.currency_sign || item?.currency?.sign || "";
    const formattedAmount =
      amount && amount > 0 ? formatCurrencyValue(amount.toString()) : 0;

    const result = amount ? `${formattedAmount} ${currencySign}` : "";

    return result;
  };

  return (
    <>
      <HeadMeta title={trans.menu.payment} />
      <Breadcrumb
        title={trans.menu.payment}
        icon={<IconReportMoney className={styles["icons"]} />}
      />
      <Grid container className={`${styles["header"]} ${styles["page-title"]}`}>
        <Grid container md={7} xl={8}>
          <Grid>
            <InputSearch
              notOnlySearch={true}
              dataFilter={dataPaymentMethods}
              customNameStatus={trans.payment.payment_method_}
              getCategory={false}
              type={"payment"}
              placeholder={`${trans.invoice.invoiceID}, ${trans.menu.customer}`}
            />
          </Grid>
          <Grid>
            {disableShowHideButton ? (
              <IconButton>
                <Tooltip
                  title={trans.payment.select_currency_to_show}
                  style={{
                    display: "inline-block",
                    marginRight: "4px",
                  }}
                >
                  <TrendingUpIcon />
                </Tooltip>
              </IconButton>
            ) : (
              <IconButton onClick={handleShowTotalStatistic}>
                <TrendingUpIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
        <Grid item xs sx={{ marginRight: "20px" }} md="auto" xl="auto">
          <Button
            variant="contained"
            className="btn_create"
            sx={{ whiteSpace: "no-wrap", minWidth: "max-content" }}
            onClick={handleOpenModal}
          >
            {trans.payment.create_payment}
          </Button>
        </Grid>
      </Grid>
      <QueryListBar />
      {showTotalStatistic ? (
        <Card sx={{ textAlign: "right", padding: "10px", marginBottom: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            divider={<Divider orientation="vertical" flexItem />}
            sx={{ justifyContent: "space-evenly", alignItems: "flex-end" }}
          >
            <BoxTotalPrice>
              <Grid container className={styles["grid-price-text"]}>
                <Grid item xs>
                  {`${formatCurrencyValue(
                    dataPaymentList?.totalData?.totalAmount.toString()
                  )} ${currencySign}`}
                </Grid>
                <Grid item xs>
                  <Typography>
                    All ({dataPaymentList?.totalData?.count})
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
                <Grid item xs>
                  {`${formatCurrencyValue(
                    dataPaymentList?.todayData?.totalAmount.toString()
                  )} ${currencySign}`}
                </Grid>
                <Grid item xs>
                  <Typography>
                    Today ({dataPaymentList?.todayData?.count})
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
                <Grid item xs>
                  {`${formatCurrencyValue(
                    dataPaymentList?.thisMonthData?.totalAmount.toString()
                  )} ${currencySign}`}
                </Grid>
                <Grid item xs>
                  <Typography>
                    This Month ({dataPaymentList?.thisMonthData?.count})
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
                <Grid item xs>
                  {`${formatCurrencyValue(
                    dataPaymentList?.thisYearData?.totalAmount.toString()
                  )} ${currencySign}`}
                </Grid>
                <Grid item xs>
                  <Typography>
                    This Year ({dataPaymentList?.thisYearData?.count})
                  </Typography>
                </Grid>
              </Grid>
              <Chip
                size="small"
                sx={{ width: "100%", height: "5px", backgroundColor: "red" }}
              />
            </BoxTotalPrice>
          </Stack>
        </Card>
      ) : (
        <Hidden />
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="5%">ID#</TableCell>
              <TableCell width="10%">{trans.customer_detail.date}</TableCell>
              <TableCell width="20%" className="text-align-center">
                {trans.invoice.invoiceID}
              </TableCell>
              <TableCell width="10%" align="right">
                {trans.payment.amount_}
              </TableCell>
              <TableCell width="20%">{trans.menu.customer}</TableCell>
              <TableCell width="15%">{trans.order.order_name}</TableCell>
              <TableCell width="10%" className="text-align-center">
                {trans.customer_detail.method}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataPaymentList?.items?.map((item: any, index: number) => {
              return (
                <TableRow key={index}>
                  <TableCell className="text-cursor">
                    <Link
                      href={
                        window.location.href +
                        (hasParam ? "&" : "?") +
                        "paymentId=" +
                        item?.id
                      }
                      className="text-cursor"
                    >
                      {`#${item?.id}`}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {item?.paymentDate ? fomatDate(item?.paymentDate) : ""}
                  </TableCell>
                  {item?.invoice?.code ? (
                    <TableCell className="text-align-center text-cursor">
                      <Link
                        href={
                          window.location.origin +
                          "/invoices/" +
                          item?.invoice?.id
                        }
                        className="text-overflow"
                      >
                        {item?.invoice?.code}
                      </Link>
                    </TableCell>
                  ) : (
                    <TableCell></TableCell>
                  )}
                  <TableCell align="right">{renderAmount(item)}</TableCell>
                  {item?.customer?.name ? (
                    <TableCell className="text-cursor">
                      <Link
                        href={
                          window.location.origin +
                          "/customer/" +
                          item?.customer?.id
                        }
                        className="text-overflow"
                      >
                        {item?.customer?.name}
                      </Link>
                    </TableCell>
                  ) : (
                    <TableCell></TableCell>
                  )}
                  {item?.order?.name ? (
                    <TableCell className="text-cursor">
                      <Link
                        href={
                          window.location.origin + "/order/" + item?.order?.id
                        }
                        className="text-overflow"
                      >
                        {item?.order?.name}
                      </Link>
                    </TableCell>
                  ) : (
                    <TableCell></TableCell>
                  )}
                  <TableCell
                    className="text-align-center"
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {item?.method?.name ? item?.method?.name.toUpperCase() : ""}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {dataPaymentList?.total > rowsPerPage && (
        <PaginationDefault
          total={dataPaymentList?.total}
          setQuerySearch={setQuerySearch}
          currencyId={currencyId}
          setCustomPage={setPageOrderItem}
        />
      )}
      <FormShowDetailPayment
        openModalDetail={openModalDetail}
        setPaymentId={setPaymentId}
        paymentId={paymentId}
        setOpenModalDetail={setOpenModalDetail}
        dataPayment={dataPayment?.data}
      />
      <FormCreatePayment openModal={openModal} setOpenModal={setOpenModal} />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  invoice: state.invoice,
  payment: state.payment,
  currency: state.currency,
  paymentMethod: state.paymentMethod,
});

const mapDispatchToProps = {
  searchPayment,
  getCurrencyList,
  getPaymentMethods,
  getPayment,
  clearData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
