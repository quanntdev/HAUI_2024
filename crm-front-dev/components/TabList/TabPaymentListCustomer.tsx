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

const TabPanelPaymentListCustomer = (props: any) => {
  const { dataListPayment, getPayment, clearData, currency, dataInvoice } =
    props;
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

  const handleToShowInvoice = (id: number) => () => {
    if (id) {
      router.push(`/invoices/${id}`);
    }
  };

  const totalBalandue = (invoiceTotal: any, paymentTotal: any) => {
    const data: number =
      parseFloat(paymentTotal?.replace(/,/g, "")) -
      parseFloat(invoiceTotal?.replace(/,/g, ""));
    return data;
  };

  const mergedArr = dataInvoice?.data?.items?.concat(
    dataListPayment?.data?.items
  );

  mergedArr?.sort((a: any, b: any) => {
    const dueDateA: any = a.due_date
      ? new Date(a.due_date)
      : new Date(a.paymentDate);
    const dueDateB: any = b.due_date
      ? new Date(b.due_date)
      : new Date(b.paymentDate);
    return dueDateB - dueDateA;
  });

  const trans = useTrans();

  return (
    <>
      <div className={styles["box-header"]}>
        <div className={styles["box-header-item"]}>
          <div className={styles["content"]}>
            <div className={styles["money"]}>
              {dataListPayment?.sumPayment?.totalFormat}
            </div>
            <div className={styles["name"]}>
              {trans.customer_detail.total_payment_amount} ({" "}
              {dataListPayment?.sumPayment?.sign} ){" "}
            </div>
          </div>
        </div>
        <div className={styles["box-header-calculate"]}>-</div>
        <div className={styles["box-header-item"]}>
          <div className={styles["content"]}>
            <div className={styles["money"]}>
              {dataInvoice?.sumInvoice?.totalFormat}
            </div>
            <div className={styles["name"]}>
              {trans.customer_detail.total_invoice_amount} ( {currency} )
            </div>
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
              )}
            </div>
            <div className={styles["name"]}>
              {trans.customer_detail.total_balance} ( {currency} )
            </div>
          </div>
        </div>
      </div>
      <TableContainer component={Paper} className="p-24">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell width="10%" className="text-align-center">
                Date
              </TableCell>
              <TableCell className="text-align-center">
                {trans.customer_detail.invoice_id}
              </TableCell>
              <TableCell className="text-align-right">
                {trans.customer_detail.invoice_amount} ({currency})
              </TableCell>
              <TableCell className="text-align-right">
                {trans.customer_detail.payment_amount} ({currency})
              </TableCell>
              <TableCell className="text-align-right">
                {trans.customer_detail.balance} ({currency})
              </TableCell>
              <TableCell className="text-align-center">
                {trans.customer_detail.payment_id}
              </TableCell>
              <TableCell className="text-align-center">
                {trans.customer_detail.method}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {mergedArr?.map((item: any, index: any) => (
              <TableRow
                key={item?.id}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell className="text-cursor">
                  <span style={{ color: "black" }}> {`${index + 1}`}</span>
                </TableCell>
                <TableCell className="text-align-center">
                  {item?.start_date ?? item?.invoice?.start_date}
                </TableCell>
                <TableCell
                  className="text-cursor text-align-center"
                  onClick={handleToShowInvoice(
                    item?.invoice?.id ?? (item?.code ? item?.id : "")
                  )}
                  component="th"
                  scope="row"
                >
                  {item?.invoice?.code ?? item?.code}
                </TableCell>
                <TableCell className="text-align-right">
                  {formatCurrencyValue(
                    item?.invoice?.total_value ?? item?.total_value
                  )}
                </TableCell>
                <TableCell className="text-align-right">
                  {formatCurrencyValue(item?.amount)}
                </TableCell>
                <TableCell className="text-align-right">
                  {formatCurrencyValue(
                    (item?.amount ?? 0) -
                      (item?.invoice?.total_value
                        ? item?.invoice?.total_value ?? 0
                        : item?.total_value ?? 0)
                  )}{" "}
                </TableCell>
                {!item?.code ? (
                  <TableCell className="text-align-center text-cursor ">
                    <div onClick={() => handleDetailpayment(item?.id)}>
                      {" "}
                      #{item?.id}
                    </div>
                  </TableCell>
                ) : (
                  <TableCell className="text-align-center text-cursor"></TableCell>
                )}
                <TableCell
                  className="text-align-center"
                  style={{ fontWeight: 700 }}
                >
                  {item?.method?.name
                    ? item?.method?.name.toUpperCase()
                    : `Invoice #${item?.id}`}
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
)(TabPanelPaymentListCustomer);
