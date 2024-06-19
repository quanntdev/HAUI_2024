import { NextPage } from "next";
import HeadMeta from "../../../components/HeadMeta";
import Breadcrumb from "../../../components/Breadcumb";
import HandshakeIcon from "@mui/icons-material/Handshake";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import styles from "./styles.module.scss";
import FormCreatePartner from "../../../components/Partner/FormCreatePartner";
import { useCallback, useEffect, useState } from "react";
import useTrans from "../../../utils/useTran";
import { listPartner, deletePartner } from "../../../redux/actions/partner";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import InputSearch from "../../../components/Input/InputSearch";
import { searchUser } from "../../../redux/actions/user";
import setParamFilter from "../../../utility/querySearch";
import {
  listPartnerInvoice,
  clearData,
} from "../../../redux/actions/partnerInvoice";
import moment from "moment";
import {
  FOMAT_DATE,
  invoiceStatus,
  keyPage,
  rowsPerPage,
} from "../../../constants";
import formatCurrencyValue from "../../../utility/formatCurrencyValue";
import PaginationDefault from "../../../components/Pagination";
import { getPageFromParams } from "../../../helpers";
import QueryListBar from "../../../components/QueryListBar";

const PartnerList: NextPage = (props: any) => {
  //use Hook
  const trans = useTrans();
  const router = useRouter();

  //varriable (if default)

  //props
  const { searchUser, listPartnerInvoice, clearData } = props;
  const { dataListPartnerInvoice } = props.partnerInvoice;
  const { dataUserList } = props.user;

  //useState
  const [openModal, setOpenModal] = useState(false);
  const [itemIndex, setItemIndex] = useState<number>(1);

  //list handle open/close modal

  const handleToShowPartner = (id: any) => () => {
    router.push(`/partner/partner-list/${id}`);
  };
  

  // list handle Change data

  //useEfffect
  useEffect(() => {
    const page = getPageFromParams(router.query[keyPage]);
    if (page) {
      setItemIndex(page * rowsPerPage + 1);
    }
    if (!page) {
      setItemIndex(1);
    }
    const querySearch = setParamFilter(rowsPerPage, page, router);
    listPartnerInvoice(querySearch);
    if (!dataUserList) {
      searchUser();
    }
    clearData("dataDetailPartnerInvoice");
  }, [router.query]);

  const showPatnerInvoice = useCallback(
    (id: number) => {
      router.push(`/partner/partner-invoice/${id}`);
    },
    [router]
  );

  // other (like const, varriable, ...)
  return (
    <>
      <HeadMeta title={trans.partner.partner_invoice} />
      <Breadcrumb
        title={trans.partner.partner_invoice}
        icon={<HandshakeIcon />}
      />
      <div className={styles["header"]}>
        <div>
          <div className={styles["search"]}>
            <InputSearch
              notOnlySearch={true}
              dataFilter={invoiceStatus}
              getCategory={false}
              type={"invoice"}
              placeholder={`${trans.invoice.invoiceID}, ${trans.menu.invoice}`}
            />
          </div>
        </div>
      </div>
      <FormCreatePartner
        openEditModal={openModal}
        setOpenEditModal={setOpenModal}
      />
      <div className="mt-3"></div>
      <QueryListBar />
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 2 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width="5%">#</TableCell>
                <TableCell width="20%">
                  {trans.partner.invoice_partner_id}
                </TableCell>
                <TableCell width="15%">{trans.menu.partner}</TableCell>
                <TableCell width="10%">{trans.invoice.invoice_date}</TableCell>
                <TableCell width="10%">{trans.order.due_date_}</TableCell>
                <TableCell width="10%">{trans.invoice.total_value}</TableCell>
                <TableCell width="10%" className="text-align-center">
                  {trans.deal.status}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataListPartnerInvoice?.data?.items?.map(
                (partner: any, index: number) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={partner?.id}
                  >
                    <TableCell className="list-index">
                      {dataListPartnerInvoice?.data?.items?.length > 0 &&
                        itemIndex + index}
                    </TableCell>
                    <TableCell className="text-cursor">
                      <div onClick={() => showPatnerInvoice(partner?.id)}>
                        {partner?.code}
                      </div>
                    </TableCell>
                    <TableCell
                      className="text-cursor"
                      onClick={handleToShowPartner(partner.customerPartner?.partners?.id )}
                    >
                      {partner?.partnerName}
                    </TableCell>
                    <TableCell>
                      {moment(new Date(partner?.start_date)).format(FOMAT_DATE)}
                    </TableCell>
                    <TableCell>
                      {moment(new Date(partner?.due_date)).format(FOMAT_DATE)}
                    </TableCell>
                    <TableCell>
                      {formatCurrencyValue(partner.total_value)}{" "}
                      {partner.currency_sign}
                    </TableCell>
                    <TableCell
                      className="text-align-center"
                      style={{
                        color: `${partner?.status?.colorCode}`,
                        fontWeight: 700,
                      }}
                    >
                      {partner.statusName
                        ? partner.statusName.toUpperCase()
                        : ""}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {dataListPartnerInvoice?.data?.total > rowsPerPage && (
        <PaginationDefault total={dataListPartnerInvoice?.data?.total} />
      )}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  partner: state.partner,
  user: state?.user,
  partnerInvoice: state?.partnerInvoice,
  errors: state.deal?.error?.response?.data?.properties ?? {},
});

const mapDispatchToProps = {
  listPartner,
  deletePartner,
  searchUser,
  listPartnerInvoice,
  clearData,
};

export default connect(mapStateToProps, mapDispatchToProps)(PartnerList);
