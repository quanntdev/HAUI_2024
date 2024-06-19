import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DraggableElement from "../../components/DnD/DraggableElement";
import { DragDropContext } from "react-beautiful-dnd";
import { styled as styleMui } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import PaginationDefault from "../../components/Pagination";
import styles from "./styles.module.scss";
import AppsIcon from "@mui/icons-material/Apps";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { keyPage, rowsPerPage } from "../../constants";
import { getPageFromParams } from "../../helpers";
import { connect } from "react-redux";
import Breadcrumb from "../../components/Breadcumb";
import { useRouter } from "next/router";
import { NextPage } from "next";
import InputSearch from "../../components/Input/InputSearch";
import ModalDelete from "../../components/Modal/ModalDelete";
import FormCreateOrUpdateDeal from "../../components/Deal/FormCreateOrUpdateDeal";
import { getStatusList } from "../../redux/actions/status";
import { IconReceipt } from "@tabler/icons";
import HeadMeta from "../../components/HeadMeta";
import setParamFilter from "../../utility/querySearch";
import {
  searchDeal,
  deleteDeal,
  createDeal,
  updateDeal,
  clearData,
} from "../../redux/actions/deal";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import getLinkAvatar from "../../utility/getLinkAvatar";
import MutiSelect from "../../components/Input/MutiSelect";
import Link from "next/link";
import QueryListBar from "../../components/QueryListBar";
import useTrans from "../../utils/useTran";
import fomatDate from "../../utility/fomatDate";

const DragDropContextContainer = styled.div`
  padding: 0px;
  border-radius: 6px;
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 8px;
`;

const StyledInputBase = styleMui(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

// fake data generator
const getItems = (count: any, prefix: any) =>
  Array.from({ length: count }, (v, k) => k).map((k) => {
    const randomId = Math.floor(Math.random() * 1000);
    return {
      id: `item-${randomId}`,
      prefix,
      content: `item ${randomId}`,
    };
  });

const removeFromList = (list: any, index: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(index, 1);
  return [removed, result];
};

const addToList = (list: any, index: any, element: any) => {
  const result = Array.from(list);
  result.splice(index, 0, element);
  return result;
};

const lists = [
  "New",
  "Disqualified",
  "Qualified",
  "Contacted",
  "Proposal Sent",
  "Converted",
];

const generateLists = () =>
  lists.reduce(
    (acc, listKey) => ({ ...acc, [listKey]: getItems(10, listKey) }),
    {}
  );

const Deals: NextPage = (props: any) => {
  const trans = useTrans();
  const {
    searchDeal,
    deleteDeal,
    dataUpdateDeal,
    getStatusList,
  } = props;
  const { dataDealList, dataDeleteDeal } = props.deal;
  const { dataStatusList } = props.status;
  const [dealId, setDealId] = useState<number>();
  const [contactId, setContactId] = useState<number>();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openFormModal, setOpenFormModal] = useState<boolean>(false);
  const [typeList, setTypeList] = useState<boolean>(false);
  const [querySearch, setQuerySearch] = useState<string>("");
  const router = useRouter();
  const [itemIndex, setItemIndex] = useState<number>(1);
  const [elements, setElements] = React.useState<any>(generateLists());
  const [statusId, setStatusId] = useState<number | null>(null);
  const [page, setPage] = useState<number>(0);

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
    searchDeal(querySearch);
    getStatusList();
  }, [searchDeal, router.query, dataDeleteDeal, dataUpdateDeal]);

  useEffect(() => {
    if (querySearch) {
      searchDeal(querySearch);
    }
  }, [querySearch]);

  useEffect(() => {
    setElements(generateLists());
  }, []);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const listCopy: any = { ...elements };

    const sourceList = listCopy[result.source.droppableId];
    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index
    );
    listCopy[result.source.droppableId] = newSourceList;
    const destinationList = listCopy[result.destination.droppableId];
    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      removedElement
    );

    setElements(listCopy);
  };

  const handleOpenForm = (action: boolean, dealId: any, contactId: any) => {
    setOpenFormModal(action);
    setDealId(dealId);
    setContactId(contactId);
  };

  function handleDeleteDeal(dealId: number) {
    setOpenDeleteModal(true);
    setDealId(dealId);
  }

  const handleToShowDeals = (id: number) => router.push(`/deals/${id}`);

  return (
    <>
      <HeadMeta title={trans.menu.deal} />
      <Box>
        <DragDropContextContainer>
          <Breadcrumb
            title={trans.menu.deal}
            icon={<IconReceipt className={styles["icons"]} />}
          />
          <div className={styles["page-title"]}>
            <div className={`${styles["search"]} ${styles["search-deal"]}`}>
              <InputSearch
                notOnlySearch={true}
                dataFilter={dataStatusList}
                type="deal"
                placeholder={`${trans.deal.deal_name}, ${trans.menu.customer}`}
              />
            </div>
            <div>
              <MutiSelect
                object="listStatus"
                selectOption={dataStatusList}
                placeholder={trans.deal.all_status}
              />
            </div>
            <div className={styles["create-deal"]}>
              <Button
                className={styles["btn-app-icon"]}
                onClick={() => setTypeList(false)}
              >
                <FormatListBulletedIcon />
              </Button>
              <Button
                className={styles["btn-app-icon"]}
              >
                <div  onClick={() => setTypeList(true)}>
                 <AppsIcon />
                </div>
              </Button>
              <Button
                className="btn_create"
                onClick={() => handleOpenForm(true, null, null)}
              >
                {trans.deal.create_deal}
              </Button>
            </div>
          </div>
          <QueryListBar />
          {!typeList ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width="5%">#</TableCell>
                      <TableCell
                        width="20%"
                        className={`${styles["deal-name"]}`}
                      >
                        {trans.deal.deal_name}
                      </TableCell>
                      <TableCell width="10%" className="text-align-center">
                        {trans.deal.category}
                      </TableCell>
                      <TableCell
                        width="15%"
                        className={`${styles["customer"]}`}
                      >
                        {trans.menu.customer}
                      </TableCell>
                      <TableCell width="10%" className="text-align-center">
                        {trans.customer.assigned}
                      </TableCell>
                      <TableCell width="15%" className="text-align-center">
                        {trans.deal.forecast_close_date}
                      </TableCell>
                      <TableCell width="10%" className="text-align-right">
                        {trans.deal.deal_value}
                      </TableCell>
                      {/* <TableCell width="10%" className="text-align-center">
                        Probability Of Winning
                      </TableCell> */}
                      <TableCell width="10%" className="text-align-center">
                        {trans.deal.status}
                      </TableCell>
                      {/* <TableCell width="10%" className="text-align-center">
                        Action
                      </TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataDealList?.items?.map((deal: any, index: number) => (
                      <TableRow hover key={index}>
                        <TableCell className="list-index">
                          {dataDealList?.items?.length > 0 && itemIndex + index}
                        </TableCell>
                        <TableCell
                          onClick={() => handleToShowDeals(deal?.id)}
                          className="text-cursor"
                        >
                          <Link
                            href={window.location.origin + "/deals/" + deal?.id}
                            className="text-overflow"
                          >
                            {deal?.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-align-center">
                          {deal?.category?.name}
                        </TableCell>
                        <TableCell
                          className="text-cursor"
                        >
                          <Link
                            href={
                              window.location.origin +
                              "/customer/" +
                              deal?.customer?.id
                            }
                            className="text-overflow"
                          >
                            {deal?.customer?.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-align-center">
                          {deal?.userAssign?.profile && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Avatar
                                src={
                                  deal?.userAssign?.profile?.profileImg
                                    ? getLinkAvatar(
                                        deal?.userAssign?.profile?.profileImg
                                      )
                                    : ""
                                }
                                alt="Picture of the author"
                                sx={{ width: 24, height: 24 }}
                              />
                              <div style={{ marginLeft: "5px" }}>
                                {`${deal?.userAssign?.profile?.first_name} ${deal?.userAssign?.profile?.last_name}`}
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-align-center">
                          {fomatDate(deal?.forecastCloseDate)}
                        </TableCell>
                        <TableCell className="text-overflow text-align-right">
                          {deal?.price
                            ? `${formatCurrencyValue(deal?.price)} ${
                                deal?.currency?.sign ? deal?.currency?.sign : ""
                              }`
                            : ""}
                        </TableCell>
                        {/* <TableCell className="text-align-center">
                          {deal?.probabilityWinning
                            ? `${deal?.probabilityWinning} %`
                            : ""}
                        </TableCell> */}
                        <TableCell
                          className={`text-align-center ${styles["deal-status"]}`}
                          sx={{ color: `${deal?.status?.colorCode}` }}
                        >
                          {deal?.status?.name ? deal?.status?.name : ""}
                        </TableCell>
                        {/* <TableCell className="text-align-center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteDeal(deal?.id)}
                          >
                            <Tooltip
                              title="Delete"
                              style={{
                                display: "inline-block",
                                marginRight: "4px",
                              }}
                            >
                              <DeleteOutlineOutlinedIcon />
                            </Tooltip>
                          </IconButton>
                          <IconButton
                            size="small"
                            color="default"
                            onClick={(event) => {
                              event.stopPropagation();
                              return handleOpenForm(
                                true,
                                deal?.id,
                                deal?.customer?.id
                              );
                            }}
                          >
                            <Tooltip
                              title="Edit"
                              style={{
                                display: "inline-block",
                                marginRight: "4px",
                              }}
                            >
                              <EditIcon />
                            </Tooltip>
                          </IconButton>
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {dataDealList?.total > rowsPerPage && (
                <PaginationDefault
                  total={dataDealList?.total}
                  setQuerySearch={setQuerySearch}
                  setCustomPage={setPage}
                  customPage={page}
                  statusId={statusId}
                />
              )}
              {!!dealId && (
                <ModalDelete
                  openModal={openDeleteModal}
                  setOpenModal={setOpenDeleteModal}
                  action={() => deleteDeal(dealId)}
                  title="You're about to delete this deal!"
                  content="This deal will be permenently removed and you won&lsquo;t be
                  alble to see them again!"
                />
              )}
            </>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <ListGrid>
                {lists.map((listKey: any, index: number) => (
                  <DraggableElement
                    elements={elements[listKey]}
                    key={listKey}
                    prefix={listKey}
                    indexKey={index}
                  />
                ))}
              </ListGrid>
            </DragDropContext>
          )}
        </DragDropContextContainer>
        <FormCreateOrUpdateDeal
          openEditModal={openFormModal}
          setOpenEditModal={setOpenFormModal}
          id={dealId}
          contactId={contactId}
        />
      </Box>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  deal: state.deal,
  status: state.status,
});

const mapDispatchToProps = {
  searchDeal,
  deleteDeal,
  createDeal,
  updateDeal,
  clearData,
  getStatusList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Deals);
