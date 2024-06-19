import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import { rowsPerPage } from "../../constants";
import PaginationDefault from "../Pagination";
import FormShowDetailPayment from "../Payment/FormShowDetailPayment";
import { getPayment, clearData } from "../../redux/actions/payment";
import { connect } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./styles.module.scss";
import useTrans from "../../utils/useTran";
import fomatDate from "../../utility/fomatDate";

const TabPanelPaymentList = (props: any) => {
  const trans = useTrans();
  const { dataListPayment, getPayment, clearData, currency, dataInvoice } = props;
  const { dataPayment } = props?.payment;

  const router = useRouter();

  const [openModalDetail, setOpenModalDetail] = useState<boolean>(false);
  const [pagePayment, setPagePayment] = useState<number>(1);
  const [querySearch, setQuerySearch] = useState<string>("");

  const handleDetailpayment = async (id: any) => {
    clearData("dataPayment");
    await getPayment(id, `limit=6&offset=0`);
    setOpenModalDetail(true);
  };

  const handleToShowOrder = (id: number) => id ? router.push(`/order/${id}`) : "";

  const handleToShowInvoice = (id: number) => id ? router.push(`/invoices/${id}`) : "";

  const totalBalandue = (invoiceTotal:any , paymentTotal:any) => {
    const data:number = parseFloat(paymentTotal?.replace(/,/g, '')) - parseFloat(invoiceTotal?.replace(/,/g, ''));
    return data;
  }

  return (
    <>
      <div className={styles["box-header"]}>
        <div className={styles["box-header-item"]}>
          <div className={styles["content"]}>
            <div className={styles["money"]}>
              {dataListPayment?.sumPayment?.totalFormat}{" "}
              {dataListPayment?.sumPayment?.sign}
            </div>
            <div className={styles["name"]}>{trans.customer_detail.total_payment_amount}</div>
          </div>
        </div>
        <div className={styles["box-header-calculate"]}>-</div>
        <div className={styles["box-header-item"]}>
          <div className={styles["content"]}>
            <div className={styles["money"]}>
              {dataInvoice?.sumInvoice?.totalFormat}{" "}
              {currency}
            </div>
            <div className={styles["name"]}>{trans.customer_detail.total_invoice_amount}</div>
          </div>
        </div>
        <div className={styles["box-header-calculate"]}>=</div>
        <div className={styles["box-header-item"]}>
          <div className={styles["content"]}>
            <div className={styles["money-haspay"]}>
              {formatCurrencyValue(
                totalBalandue(
                  dataInvoice?.sumInvoice?.totalFormat,
                  dataListPayment?.sumPayment?.totalFormat
                )
              )}{" "}
              {currency}
            </div>
            <div className={styles["name"]}>{trans.customer_detail.total_balance}</div>
          </div>
        </div>
      </div>
      <TableContainer component={Paper} className="p-24">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID#</TableCell>
              <TableCell width="10%" className="text-align-center">
                {trans.customer_detail.date}
              </TableCell>
              <TableCell className="text-align-center">{trans.customer_detail.invoice_id}</TableCell>
              <TableCell className="text-align-right">{trans.customer_detail.invoice_amount}</TableCell>
              <TableCell className="text-align-right">{trans.customer_detail.payment_amount}</TableCell>
              <TableCell className="text-align-right">{trans.customer_detail.balance}</TableCell>
              <TableCell className="text-align-center">{trans.menu.order}</TableCell>
              <TableCell className="text-align-center">{trans.customer_detail.customer_detail}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {dataListPayment?.data?.items?.map((item: any, index: any) => (
              <TableRow
                key={item?.id}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell
                  className="text-cursor"
                  onClick={() => handleDetailpayment(item?.id)}
                >
                  {`#${item?.id}`}
                </TableCell>
                <TableCell className="text-align-center">
                  {fomatDate(item?.paymentDate)}
                </TableCell>
                <TableCell
                  className="text-cursor text-align-center"
                  component="th"
                  scope="row"
                >
                  <div onClick={() => handleToShowInvoice(item?.invoice?.id)}>{item?.invoice?.code}</div>
                </TableCell>
                <TableCell className="text-align-right">
                  {formatCurrencyValue(item?.invoice?.total_value)}{" "}
                  {item?.invoice?.currency_sign}
                </TableCell>
                <TableCell className="text-align-right">
                  {formatCurrencyValue(item?.amount)} {item?.currency?.sign}
                </TableCell>
                <TableCell className="text-align-right">
                  {formatCurrencyValue(
                     item?.amount - (item?.invoice?.total_value ?? 0)
                  )}{" "}
                  {item?.currency?.sign}
                </TableCell>
                <TableCell
                  className="text-align-center text-cursor "
                >
                  <div onClick={() => handleToShowOrder(item?.order?.id)}>{item?.order?.name}</div>
                </TableCell>
                <TableCell
                  className="text-align-center"
                  style={{ fontWeight: 700 }}
                >
                  {item?.method?.name ? item?.method?.name.toUpperCase() : ""}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {dataListPayment?.data?.items?.total > rowsPerPage && (
        <PaginationDefault
          total={dataListPayment?.data?.items?.total}
          setQuerySearch={setQuerySearch}
          paginateByParamUrl={false}
          setCustomPage={setPagePayment}
          customPage={pagePayment}
        />
      )}
      <FormShowDetailPayment
        openModalDetail={openModalDetail}
        setOpenModalDetail={setOpenModalDetail}
        dataPayment={dataPayment?.data}
        edit={false}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  payment: state?.payment,
});

const mapDispatchToProps = {
  getPayment,
  clearData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabPanelPaymentList);
