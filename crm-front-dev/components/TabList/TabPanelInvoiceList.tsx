import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { getInvoicesByOrderId } from "../../redux/actions/invoice";
import { rowsPerPage } from "../../constants";
import PaginationDefault from "../../components/Pagination";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import useTrans from "../../utils/useTran";
import fomatDate from "../../utility/fomatDate";

const TabPanelInvoiceList = (props: any) => {
  const trans = useTrans();
  const { dataInvoicesByOrderId, getInvoicesByOrderId } = props;
  const [querySearch, setQuerySearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const router = useRouter();
  const q: any = useMemo(() => router.query, [router]);
  const orderId = q?.id || "";

  const handleRedirectInvoiceDetail = (id: number) =>
    router.push(`/invoices/${id}`);

  useEffect(() => {
    if (querySearch && orderId) getInvoicesByOrderId(querySearch, orderId);
  }, [querySearch]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="list-index">#</TableCell>
              <TableCell className="text-align-center">{trans.invoice.invoiceID}</TableCell>
              <TableCell className="text-align-right">{trans.invoice.total_value}</TableCell>
              <TableCell className="text-align-center">{trans.invoice.invoice_date}</TableCell>
              <TableCell className="text-align-center">{trans.order.due_date_}</TableCell>
              <TableCell className="text-align-center">{trans.order.status}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataInvoicesByOrderId?.data?.items.map((item: any, index: any) => (
              <TableRow
                key={item?.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell className="list-index">
                  {(page - 1) * rowsPerPage + index + 1}
                </TableCell>
                <TableCell
                  onClick={() => handleRedirectInvoiceDetail(item?.id)}
                  className="text-align-center text-cursor"
                >
                  {item?.code}
                </TableCell>
                <TableCell className="text-align-right">
                  {item?.total_value
                    ? `${formatCurrencyValue(item?.total_value)} ${
                        item?.order?.currency?.name !== undefined ? item?.order?.currency?.sign : ''
                      }`
                    : ""}
                </TableCell>
                <TableCell className="text-align-center">
                 {fomatDate(item?.start_date)}
                </TableCell>
                <TableCell className="text-align-center">
                  {fomatDate(item?.due_date)}
                </TableCell>
                <TableCell className="text-align-center list-status ">
                  {item?.statusName.toUpperCase()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {dataInvoicesByOrderId?.data?.total > rowsPerPage && (
        <PaginationDefault
          total={dataInvoicesByOrderId?.data?.total}
          setQuerySearch={setQuerySearch}
          paginateByParamUrl={false}
          setCustomPage={setPage}
          customPage={page}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  invoice: state.invoice,
});

const mapDispatchToProps = {
  getInvoicesByOrderId,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabPanelInvoiceList);
