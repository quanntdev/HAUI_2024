import { NextPage } from "next";
import HeadMeta from "../../../components/HeadMeta";
import Breadcrumb from "../../../components/Breadcumb";
import HandshakeIcon from "@mui/icons-material/Handshake";
import {
  Button,
  Chip,
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
import FormCreatePartner from "../../../components/Partner/FormCreatePartner";
import { useCallback, useEffect, useState } from "react";
import useTrans from "../../../utils/useTran";
import { listPartner, deletePartner } from "../../../redux/actions/partner";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { CUSTOMER_PRIORITY_LIST } from "../../../constants/customer";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModalDelete from "../../../components/Modal/ModalDelete";
import InputSearch from "../../../components/Input/InputSearch";
import { searchUser } from "../../../redux/actions/user";
import setParamFilter from "../../../utility/querySearch";
import MutiSelect from "../../../components/Input/MutiSelect";
import FilterUserAssignedButton from "../../../components/Button/FilterUserAssignedButton";
import PaginationDefault from "../../../components/Pagination";
import { keyPage, rowsPerPage } from "../../../constants";
import { getPageFromParams } from "../../../helpers";

const PartnerList: NextPage = (props: any) => {
  //use Hook
  const trans = useTrans();
  const router = useRouter();

  //varriable (if default)

  //props
  const { listPartner, deletePartner, searchUser } = props;

  const { dataListPartner, dataDeletePartner, dataCreatePartner } =
    props.partner;
  const { dataUserList } = props.user;

  //useState
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [partnerId, setPartnerId] = useState<any>();
  const [userAssignedId, setUserAssignedId] = useState<number | null>(null);
  const [itemIndex, setItemIndex] = useState<number>(1);

  //list handle open/close modal
  const handleOpenModal = useCallback(() => {
    setOpenModal(true);
  }, []);

  const handleToShowPartner = (id: any) => () => {
    router.push(`/partner/partner-list/${id}`);
  };

const handleMoDalDeletePartner = useCallback(() => {
  deletePartner(partnerId);
}, [deletePartner, partnerId]);

  // list handle Change data
  const handleDeletePartner = useCallback((id: number) => {
    setOpenDeleteModal(true);
    setPartnerId(id);
  }, [setOpenDeleteModal, setPartnerId]);


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
    listPartner(querySearch);
    if (!dataUserList) {
      searchUser();
    }
  }, [router.query, dataDeletePartner, dataCreatePartner]);
  // other (like const, varriable, ...)
  return (
    <>
      <HeadMeta title={trans.menu.partner} />
      <Breadcrumb title={trans.menu.partner} icon={<HandshakeIcon />} />
      <div className={styles["header"]}>
        <div>
          <div className={styles["search"]}>
            <InputSearch
              dataUserList={dataUserList}
              placeholder={trans.partner.partner_name}
              notOnlySearch={true}
              type="partner"
            />
          </div>
        </div>
        <Button
          variant="contained"
          className="btn_create"
          onClick={handleOpenModal}
          sx={{marginRight: "20px"}}
        >
          {trans.partner.create_sale_partner}
        </Button>
      </div>
      <FormCreatePartner
        openEditModal={openModal}
        setOpenEditModal={setOpenModal}
      />
      <div className={styles["page-filter"]}>
        <MutiSelect
          selectOption={CUSTOMER_PRIORITY_LIST}
          object="listPriority"
          placeholder={trans.customer.all_priority}
        />

        <FilterUserAssignedButton
          dataUserList={dataUserList}
          setUserAssignedId={setUserAssignedId}
          userAssignedId={userAssignedId}
          labelKey={"userAssignLabel"}
        />
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 2 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width="5%">#</TableCell>
                <TableCell width="25%">{trans.customer.name}</TableCell>
                <TableCell width="15%">{trans.customer.priority}</TableCell>
                <TableCell width="20%">{trans.customer.assigned}</TableCell>
                <TableCell width="20%">{trans.customer_detail.email}</TableCell>
                <TableCell width="10%">{trans.task.action}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataListPartner?.data?.items?.map(
                (partner: any, index: number) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={partner?.id}>
                    <TableCell className="list-index">
                      {dataListPartner?.data?.items?.length > 0 && itemIndex + index}
                      </TableCell>
                    <TableCell
                      className="text-cursor"
                      onClick={handleToShowPartner(partner?.id)}
                    >
                      <Link
                        href={
                          window.location.origin +
                          "/partner/partner-list/" +
                          partner.id
                        }
                        className="text-overflow"
                      >
                        {partner?.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {partner?.priority && (
                        <Chip
                          label={
                            partner?.priority
                              ? CUSTOMER_PRIORITY_LIST[
                                  Number(partner?.priority) - 1
                                ]?.label
                              : ""
                          }
                          style={{
                            background: partner?.priority
                              ? CUSTOMER_PRIORITY_LIST[
                                  Number(partner?.priority) - 1
                                ]?.backgroundcolor
                              : "",
                            color: partner?.priority
                              ? CUSTOMER_PRIORITY_LIST[
                                  Number(partner?.priority) - 1
                                ]?.color
                              : "",
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        {partner?.userAssign?.profile?.first_name
                          ? partner?.userAssign?.profile?.first_name +
                            partner?.userAssign?.profile?.last_name
                          : ""}
                      </div>
                    </TableCell>
                    <TableCell>{partner?.email}</TableCell>
                    <TableCell>
                      <IconButton size="small" color="error">
                        <Tooltip
                          title="Delete"
                          style={{
                            display: "inline-block",
                            marginRight: "4px",
                          }}
                        >
                          <div onClick={() =>
                            handleDeletePartner(Number(partner?.id))
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
          // action={() => deletePartner(partnerId)}
          action={handleMoDalDeletePartner}
          title={trans.partner.about_delete_partner}
          content={trans.partner.delete_partner_content}
        />
      </Paper>
      {dataListPartner?.data?.total > rowsPerPage && (
        <PaginationDefault total={dataListPartner?.data?.total} />
      )}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  partner: state.partner,
  user: state?.user,
  errors: state.deal?.error?.response?.data?.properties ?? {},
});

const mapDispatchToProps = {
  listPartner,
  deletePartner,
  searchUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(PartnerList);
