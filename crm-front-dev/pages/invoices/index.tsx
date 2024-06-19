import {
  Box,
  Button,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcumb";
import InputSearch from "../../components/Input/InputSearch";
import FilterStatusButton from "../../components/Button/FilterStatusButton";
import { getPageFromParams } from "../../helpers";
import { keyPage, rowsPerPage, invoiceStatus } from "../../constants";
import styles from "./styles.module.scss";
import { connect } from "react-redux";
import {
  searchInvoices,
  getInvoiceStatusList,
  refreshInvoiceStatus,
  clearData,
} from "../../redux/actions/invoice";
import PaginationDefault from "../../components/Pagination";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import setParamFilter from "../../utility/querySearch";
import { IconFileInvoice } from "@tabler/icons";
import HeadMeta from "../../components/HeadMeta";
import FormCreateInvoice from "../../components/Invoice/FormCreateInvoice";
import Link from "next/link";
import QueryListBar from "../../components/QueryListBar";
import useTrans from "../../utils/useTran";
import fomatDate from "../../utility/fomatDate";

const Invoices: NextPage = (props: any) => {
  const trans = useTrans();
  const { searchInvoices, getInvoiceStatusList, clearData } = props;
  const {
    dataInvoiceList,
    dataRefreshStatusInvoice,
    dataDeleteInvoice,
    dataDetailInvoice,
  } = props.invoice;
  const [typeList, setTypeList] = useState<boolean>(false);
  const [querySearch, setQuerySearch] = useState<string>("");
  const [statusId, setStatusId] = useState<number | null>(null);
  const [itemIndex, setItemIndex] = useState<number>(1);
  const [page, setPage] = useState<number>(0);
  const [openFormModal, setOpenFormModal] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const page = getPageFromParams(router.query[keyPage]);
    if (page) {
      setTypeList(false);
      setItemIndex(page * rowsPerPage + 1);
    }
    if (!page) {
      setItemIndex(1);
    }
    const querySearch = setParamFilter(rowsPerPage, page, router);
    searchInvoices(querySearch);
    getInvoiceStatusList();
  }, [searchInvoices, router.query, dataRefreshStatusInvoice]);

  useEffect(() => {
    if (querySearch) {
      searchInvoices(querySearch);
    }
  }, [querySearch]);

  useEffect(() => {
    if (dataDeleteInvoice) {
      clearData("dataDeleteInvoice");
    }
  }, [dataDeleteInvoice]);

  useEffect(() => {
    if (dataDetailInvoice) {
      clearData("dataDetailInvoice");
    }
  }, [dataDetailInvoice]);

  const handleOpenForm = (action: boolean) => {
    setOpenFormModal(action);
  };

  const handleToShowInvoice = (id: number) => router.push(`/invoices/${id}`);

  const handleToShowCustomer = (id: any) => () => {
    router.push(`/customer/${id}`);
  };
  return (
    <Box>
      <HeadMeta title={trans.menu.invoice} />
      <Breadcrumb
        title={trans.menu.invoice}
        icon={<IconFileInvoice className={styles["icons"]} />}
      />
      <div className={`${styles["header"]} ${styles["page-title"]}`}>
        <div className={`${styles["search"]} ${styles["search-invoice"]}`}>
          <InputSearch
            notOnlySearch={true}
            dataFilter={invoiceStatus}
            getCategory={false}
            type={"invoice"}
            placeholder={`${trans.invoice.invoiceID}, ${trans.menu.invoice}`}
          />

          <FilterStatusButton
            setTypeList={setTypeList}
            dataStatusList={invoiceStatus}
            setStatusId={setStatusId}
            statusId={statusId}
            setPage={setPage}
            setQuerySearch={setQuerySearch}
          />
        </div>
        <Button className="btn_create" onClick={() => handleOpenForm(true)}>
          {trans.invoice.create_invoice}
        </Button>
      </div>
      <QueryListBar />
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableCell width="5%" className="index-list">
                #
              </TableCell>
              <TableCell width="25%" className="text-align-center">
                {trans.invoice.invoiceID}
              </TableCell>
              <TableCell width="20%">{trans.menu.customer}</TableCell>
              <TableCell width="10%">{trans.invoice.invoice_date}</TableCell>
              <TableCell width="10%">{trans.order.due_date_}</TableCell>
              <TableCell width="10%" sx={{ textAlign: "right" }}>
                {trans.invoice.total_values}{" "}
              </TableCell>
              <TableCell width="10%" className="text-align-center">
                {trans.order.status}{" "}
              </TableCell>
            </TableHead>
            <TableBody>
              {dataInvoiceList?.data?.items?.map(
                (invoice: any, index: number) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell className="index-list">
                      {dataInvoiceList?.data?.items?.length > 0 &&
                        itemIndex + index}
                    </TableCell>
                    <TableCell
                      onClick={() => handleToShowInvoice(invoice?.id)}
                      className="text-align-center text-cursor"
                    >
                      <Link
                        href={
                          window.location.origin + "/invoices/" + invoice?.id
                        }
                        className="text-overflow"
                      >
                        {invoice?.code}
                      </Link>
                    </TableCell>
                    <TableCell
                      className="text-align-left text-cursor"
                      onClick={handleToShowCustomer(
                        invoice?.order?.customer?.id
                      )}
                    >
                      <Link
                        href={
                          window.location.origin +
                          "/customer/" +
                          invoice?.order?.customer?.id
                        }
                        className="text-overflow"
                      >
                        {invoice?.customer_name ?? ""}
                      </Link>
                    </TableCell>
                    <TableCell>{fomatDate(invoice.start_date)}</TableCell>
                    <TableCell>{fomatDate(invoice.due_date)}</TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {invoice?.total_value
                        ? `${formatCurrencyValue(invoice?.total_value)} ${
                            invoice?.currency_sign ?? ""
                          }`
                        : ""}
                    </TableCell>
                    <TableCell
                      className="text-align-center"
                      style={{
                        color: `${invoice?.status?.colorCode}`,
                        fontWeight: 700,
                      }}
                    >
                      {invoice.statusName
                        ? invoice.statusName.toUpperCase()
                        : ""}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {dataInvoiceList?.data?.total > rowsPerPage && (
        <PaginationDefault
          total={dataInvoiceList?.data?.total}
          setQuerySearch={setQuerySearch}
          setCustomPage={setPage}
          customPage={page}
          statusId={statusId}
        />
      )}

      <FormCreateInvoice
        openFormModal={openFormModal}
        setOpenFormModal={setOpenFormModal}
      />
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  invoice: state.invoice,
  status: state.status,
});

const mapDispatchToProps = {
  searchInvoices,
  getInvoiceStatusList,
  refreshInvoiceStatus,
  clearData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Invoices);
