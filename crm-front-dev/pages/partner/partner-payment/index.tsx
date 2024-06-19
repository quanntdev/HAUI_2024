import { NextPage } from "next";
import HeadMeta from "../../../components/HeadMeta";
import Breadcrumb from "../../../components/Breadcumb";
import PaidIcon from "@mui/icons-material/Paid";
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import styles from "./styles.module.scss";
import { useCallback, useEffect, useState } from "react";
import useTrans from "../../../utils/useTran";
import { listPartner, deletePartner } from "../../../redux/actions/partner";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import ModalDelete from "../../../components/Modal/ModalDelete";
import InputSearch from "../../../components/Input/InputSearch";
import { searchUser } from "../../../redux/actions/user";
import setParamFilter from "../../../utility/querySearch";
import {
  listPaymentPartner,
  deletePartnerPayment,
} from "../../../redux/actions/partnerPayment";
import moment from "moment";
import { FOMAT_DATE, keyPage, rowsPerPage } from "../../../constants";
import FormCreateOrUpdatePayment from "../../../components/Partner/FormCreateOrUpdatePayment";
import FormDetailPaymentPartner from "../../../components/Partner/FormDetailPaymentPartner";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import formatCurrencyValue from "../../../utility/formatCurrencyValue";
import PaginationDefault from "../../../components/Pagination";
import { getPageFromParams } from "../../../helpers";
import { getPaymentMethods } from "../../../redux/actions/paymentMethod";
import QueryListBar from "../../../components/QueryListBar";

const PartnerPayment: NextPage = (props: any) => {
  //use Hook
  const trans = useTrans();
  const router = useRouter();

  //varriable (if default)

  //props
  const { listPaymentPartner, searchUser, deletePartnerPayment } = props;
  const {
    dataListPartnerPayment,
    dataCreatePaymentPartner,
    dataUpdatePaymentPartner,
    dataDeletePartnerPayment,
    dataManyPartnerInvoice,
  } = props.partnerPayment;
  const { dataUserList } = props.user;
  const { dataPaymentMethods } = props.paymentMethod;

  //useState
  const [openModal, setOpenModal] = useState(false);
  const [openModalDetails, setOpenModalDetails] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [partnerId, setPartnerId] = useState<any>();

  //list handle open/close modal
  const handleOpenModal = useCallback(() => {
    setOpenModal(true);
  }, [setOpenModal]);

  const handleModalDeletePartnerPayment = useCallback(() => {
    deletePartnerPayment(partnerId);
  }, [partnerId]);


  const handleDeletePartnerPayment = useCallback((id: number) => {
    setOpenDeleteModal(true);
    setPartnerId(id);
  }, [setOpenDeleteModal, setPartnerId]);
  
  const handleToShowPartner = (id: any) => () => {  
    router.push(`/partner/partner-list/${id}`);
  };
  
  
  const handleToShowOrder = useCallback((id: number) => {
    router.push(`/order/${id}`);
  }, [router]);

  const handleShowPayment = useCallback((id: number) => {
    router.push({
      pathname: router.pathname,
      query: `paymentId=${id}`
    });
  }, [router]);

  // list handle Change data

  //useEfffect
  useEffect(() => {
    const page = getPageFromParams(router.query[keyPage]);
    const querySearch = setParamFilter(rowsPerPage, page, router);
    listPaymentPartner(querySearch);
    if (!dataUserList) {
      searchUser();
    }
  }, [
    router.query,
    dataCreatePaymentPartner,
    dataUpdatePaymentPartner,
    dataDeletePartnerPayment,
    dataManyPartnerInvoice,
  ]);

  useEffect(() => {
    if (router.query?.paymentId) {
      setOpenModalDetails(true);
    }
  }, [router.query]);

  // other (like const, varriable, ...)
  return (
    <>
      <HeadMeta title={trans.menu.payment_partner} />
      <Breadcrumb title={trans.menu.payment_partner} icon={<PaidIcon />} />
      <div className={styles["header"]}>
        <div>
          <div className={styles["search"]}>
            <InputSearch
              notOnlySearch={true}
              dataFilter={dataPaymentMethods}
              customNameStatus={trans.payment.payment_method_}
              getCategory={false}
              type={"payment"}
              placeholder={`${trans.partner.partner_name}, ${trans.invoice.invoiceID}`}
            />
          </div>
        </div>
        <Button
          variant="contained"
          className="btn_create"
          onClick={handleOpenModal}
          sx={{marginRight: "20px"}}
        >
          {trans.payment.create_payment}
        </Button>
      </div>
      <FormCreateOrUpdatePayment
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
      <div className="mt-3"></div>
      <QueryListBar />
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 2 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width="5%">ID#</TableCell>
                <TableCell width="10%">{trans.payment.date}</TableCell>
                <TableCell width="15%">{trans.invoice.invoiceID}</TableCell>
                <TableCell width="15%">{trans.payment.amount_}</TableCell>
                <TableCell width="20%">{trans.menu.partner}</TableCell>
                <TableCell width="15%">{trans.order.order_name}</TableCell>
                <TableCell width="10%">
                  {trans.customer_detail.method}
                </TableCell>
                <TableCell width="10%">{trans.task.action}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataListPartnerPayment?.items?.map(
                (payment: any, index: number) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={payment?.id}>
                    <TableCell width="5%" className="text-cursor">
                      <div onClick={(e) => handleShowPayment(payment?.id)}>
                        PIP{payment?.id}
                      </div>
                      </TableCell>
                    <TableCell width="10%">
                      {moment(payment?.paymentDate).format(FOMAT_DATE)}
                    </TableCell>
                    <TableCell width="15%">
                      {payment?.invoicePartner?.code}
                    </TableCell>
                    <TableCell width="15%">
                      {formatCurrencyValue(payment?.amount)}{" "}
                      {payment?.amount ? payment?.currency?.sign : ""}
                    </TableCell>
                    <TableCell
                      width="20%"
                      className="text-cursor"
                      onClick={handleToShowPartner(payment?.partner?.id)}
                    >
                      {payment?.partner?.name}
                    </TableCell>
                    <TableCell
                      width="15%"
                      className="text-cursor"
                    >
                      <div onClick={() => handleToShowOrder(payment?.order?.id)}>
                        {payment?.order?.name}
                      </div>
                    </TableCell>
                    <TableCell
                      width="10%"
                      style={{
                        fontWeight: 700,
                      }}
                    >
                      {payment?.method?.name
                        ? payment?.method?.name.toUpperCase()
                        : ""}
                    </TableCell>
                    <TableCell
                      width="10%"
                      style={{
                        fontWeight: 700,
                      }}
                    >
                      <IconButton size="small" color="error">
                        <Tooltip
                          title="Delete"
                          style={{
                            display: "inline-block",
                            marginRight: "4px",
                          }}
                        >
                          <div onClick={() =>
                            handleDeletePartnerPayment(Number(payment?.id))
                          }>
                            <DeleteOutlineOutlinedIcon />
                          </div>
                        </Tooltip>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <ModalDelete
          openModal={openDeleteModal}
          setOpenModal={setOpenDeleteModal}
          action={handleModalDeletePartnerPayment}
          title={trans.payment.you_re_about_to_delete_your_payment}
          content={
            trans.payment
              .this_payment_will_be_permenently_removed_and_you_won_t_be_able_to_see_them_again_
          }
        />
        <FormDetailPaymentPartner
          openModal={openModalDetails}
          setOpenModal={setOpenModalDetails}
        />
      </Paper>
      {dataListPartnerPayment?.total > rowsPerPage && (
        <PaginationDefault total={dataListPartnerPayment?.total} />
      )}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  partner: state.partner,
  user: state?.user,
  partnerPayment: state?.partnerPayment,
  errors: state.deal?.error?.response?.data?.properties ?? {},
  paymentMethod: state.paymentMethod,
});

const mapDispatchToProps = {
  listPartner,
  deletePartner,
  searchUser,
  listPaymentPartner,
  deletePartnerPayment,
  getPaymentMethods,
};

export default connect(mapStateToProps, mapDispatchToProps)(PartnerPayment);
