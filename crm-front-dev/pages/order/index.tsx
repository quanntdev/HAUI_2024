import styles from "./styles.module.scss";
import Breadcrumb from "../../components/Breadcumb";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PaginationDefault from "../../components/Pagination";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { searchOrder, deleteOrder, clearData } from "../../redux/actions/order";
import { NextPage } from "next";
import { FOMAT_DATE, keyPage, rowsPerPage } from "../../constants";
import InputSearch from "../../components/Input/InputSearch";
import ModalDelete from "../../components/Modal/ModalDelete";
import { useRouter } from "next/router";
import { getPageFromParams } from "../../helpers";
import { getOrderStatusList } from "../../redux/actions/orderStatus";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import setParamFilter from "../../utility/querySearch";
import FormCreateOrder from "../../components/Order/FormCreateOrder";
import { IconPackage } from "@tabler/icons";
import HeadMeta from "../../components/HeadMeta";
import Link from "next/link";
import QueryListBar from "../../components/QueryListBar";
import useTrans from "../../utils/useTran";
import moment from "moment";

const Order: NextPage = (props: any) => {
  let orderId: any;
  const trans = useTrans();
  const { searchOrder, getOrderStatusList, deleteOrder, clearData } = props;
  const { dataOrderList, dataUpdateOrder, dataDeleteOrder, dataOrderDetail } =
    props.order;
  const { dataOrderStatusList } = props.orderStatus;
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [itemIndex, setItemIndex] = useState<number>(1);
  const [querySearch, setQuerySearch] = useState<string>("");
  const [statusId, setStatusId] = useState<number | null>(null);
  const [page, setPage] = useState<number>(0);
  const [filterData, setFilterData] = useState<any>();
  useEffect(() => {
    const page = getPageFromParams(router.query[keyPage]);
    setItemIndex(page * rowsPerPage + 1);
    if (!page) {
      setItemIndex(1);
    }

    const querySearch = setParamFilter(rowsPerPage, page, router);
    searchOrder(querySearch);
    getOrderStatusList();
  }, [searchOrder, router.query, dataUpdateOrder, dataDeleteOrder]);

  useEffect(() => {
    if (querySearch) {
      searchOrder(querySearch);
    }
  }, [querySearch]);

  useEffect(() => {
    if (dataDeleteOrder) clearData("dataDeleteOrder");
  }, [dataDeleteOrder]);

  useEffect(() => {
    if (dataOrderDetail) clearData("dataOrderDetail");
  }, [dataOrderDetail]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleToShowCustomer = (id: number) => router.push(`/customer/${id}`);

  const redirectToOrderDetail = (id: number) => router.push(`/order/${id}`);

  const filterColorRatePoint = (point: any) => {
    let colorRatePoint;
    let color;
    if (point > 0 && point <= 2) {
      colorRatePoint = "#ff3933";
      color = "white";
    }
    if (point >= 3 && point <= 4) {
      colorRatePoint = "#ffaf2b";
    }
    if (point >= 5 && point <= 6) {
      colorRatePoint = "#ffe934";
    }
    if (point >= 7 && point <= 8) {
      colorRatePoint = "#71be26";
    }
    if (point >= 9 && point <= 10) {
      colorRatePoint = "#00b02a";
      color = "white";
    }

    const spanStyle = {
      borderRadius: "50px",
      backgroundColor: colorRatePoint,
      padding: "5px 25px",
      display: "inline-block",
      color: color,
    };

    return <span style={spanStyle}>{point}</span>;
  };
  // Filter RatePoint

  const [valueFilterPoint, setValueFilterPoint] = React.useState("");

  const handleChangeFilterRatePoint = useCallback((event: any) => {
    setValueFilterPoint(event.target.value);
  }, []);

  useEffect(() => {
    const queryString = `&ratePoint=${valueFilterPoint}`;
    searchOrder(queryString);
  }, [valueFilterPoint]);

  return (
    <>
      <HeadMeta title={trans.menu.order} />
      <Breadcrumb
        title={trans.menu.order}
        icon={<IconPackage className={styles["icons"]} />}
      />
      <div className={styles["user_list"]}>
        <div className={`${styles["header"]} ${styles["page-title"]}`}>
          <div className={styles["search-section"]}>
            <InputSearch
              setFilterData={setFilterData}
              notOnlySearch={true}
              dataFilter={dataOrderStatusList}
              type={"order"}
              placeholder={`${trans.menu.customer}, ${trans.order.order_name}`}
            />
          </div>
          <div>
            <FormControl sx={{ width: 200, backgroundColor: "white" }}>
              <InputLabel id="demo-simple-select-label">
                Filter Rate Point
              </InputLabel>
              <Select
                sx={{ height: "55px" }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Filter Rate Point"
                value={valueFilterPoint}
                onChange={handleChangeFilterRatePoint}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={1}> 1-6 {trans.order.point}</MenuItem>
                <MenuItem value={2}> 7-8 {trans.order.point}</MenuItem>
                <MenuItem value={3}> 9-10 {trans.order.point}</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div>
            <Button
              variant="contained"
              className="btn_create"
              onClick={handleOpenModal}
            >
              {trans.order.create_order}
            </Button>
          </div>
        </div>
        <QueryListBar />
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="4%">#</TableCell>
                  <TableCell width="15%" className={`${styles["order-name"]}`}>
                    {trans.order.order_name}
                  </TableCell>
                  <TableCell width="10%" className="text-align-center">
                    {trans.order.billing_type}
                  </TableCell>
                  <TableCell width="10%" className="text-align-center">
                    {trans.deal.category}
                  </TableCell>
                  <TableCell width="15%" className={`${styles["customer"]}`}>
                    {trans.menu.customer}
                  </TableCell>
                  <TableCell width="15%">{trans.order.manager}</TableCell>
                  <TableCell width="10%">{trans.order.start_date}</TableCell>
                  <TableCell width="10%">{trans.order.due_date_}</TableCell>
                  <TableCell width="10%" className="text-align-right">
                    {trans.deal.value}
                  </TableCell>
                  <TableCell width="10%" className="text-align-center">
                    {trans.deal.status}
                  </TableCell>
                  <TableCell width="10%" className="text-align-center">
                    {trans.order.rate_point}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataOrderList?.data?.items?.map(
                  (order: any, index: number) => (
                    <TableRow key={index} className={styles["table-row"]}>
                      <TableCell className="list-index">
                        {dataOrderList?.data?.items.length > 0 &&
                          itemIndex + index}
                      </TableCell>
                      <TableCell
                        className="text-cursor"
                        onClick={() => redirectToOrderDetail(order?.id)}
                      >
                        <Link
                          href={window.location.origin + "/order/" + order?.id}
                          className="text-overflow"
                        >
                          {order?.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-align-center">
                        {order?.billingType?.name}
                      </TableCell>
                      <TableCell className="text-align-center">
                        {order?.category?.name}
                      </TableCell>
                      <TableCell
                        onClick={() =>
                          handleToShowCustomer(order?.customer?.id)
                        }
                        className="text-cursor"
                      >
                        <Link
                          href={
                            window.location.origin +
                            "/customer/" +
                            order?.customer?.id
                          }
                          className="text-overflow"
                        >
                          {order?.customer?.name}
                        </Link>
                      </TableCell>
                      <TableCell>{order?.orderManager}</TableCell>
                      <TableCell>
                        {moment(order?.startDate).format(FOMAT_DATE)}
                      </TableCell>
                      <TableCell>
                        {moment(order?.dueDate).format(FOMAT_DATE)}
                      </TableCell>
                      <TableCell className="text-overflow text-align-right">
                        {order?.orderValue && order?.currency?.sign
                          ? `${formatCurrencyValue(order?.orderValue)} ${
                              order?.currency?.sign ? order?.currency?.sign : ""
                            }`
                          : ""}
                      </TableCell>
                      <TableCell
                        className={`${styles["order-status"]} text-align-center`}
                        sx={{ color: `${order?.status?.colorCode}` }}
                      >
                        {order?.status?.name}
                      </TableCell>
                      <TableCell
                        className={`${styles["order-status"]} text-align-center`}
                      >
                        {filterColorRatePoint(order?.ratePoint)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        {dataOrderList?.data?.total > rowsPerPage && (
          <PaginationDefault
            total={dataOrderList?.data?.total}
            setQuerySearch={setQuerySearch}
            setCustomPage={setPage}
            customPage={page}
            statusId={statusId}
          />
        )}
        {!!orderId && (
          <ModalDelete
            openModal={openDeleteModal}
            action={() => deleteOrder(orderId)}
            setOpenModal={setOpenDeleteModal}
            title={trans.order.about_to_delete_your_delete}
            content={trans.order.delete_order_content}
          />
        )}
        <FormCreateOrder
          openEditModal={openModal}
          setOpenEditModal={setOpenModal}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  deal: state.deal,
  order: state.order,
  orderStatus: state.orderStatus,
});

const mapDispatchToProps = {
  searchOrder,
  deleteOrder,
  getOrderStatusList,
  clearData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);
