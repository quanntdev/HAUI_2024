import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import ModalDelete from "../Modal/ModalDelete";
import {
  createOrderItem,
  deleteOrderItem,
  getDetailOrderItem,
  updateOrderItem,
  clearData,
} from "../../redux/actions/orderItem";
import {
  getOrderItemListByOrderId,
  getDetailOrder,
} from "../../redux/actions/order";
import { rowsPerPage } from "../../constants";
import PaginationDefault from "../Pagination";
import InputBase from "../Input/InputBase";
import InputFormatNumber from "../Input/InputFormatNumber";
import checkChangeDataBeforeUpdate from "../../utility/checkChangeDataBeforeUpdate";
import FormTableRowCreateOrderItem from "../OrderItem/FormTableRowCreateOrderItem";
import { getFirstValueInObject } from "../../helpers";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import useTrans from "../../utils/useTran";

type DataFormType = {
  title: string;
  estimateHour: string;
  statusId: number | null;
  completedDate: Date | null;
  unitPrice: string;
  value: string;
  orderId: number | null;
  currencyId: number | null;
};

const INIT_DATA = {
  title: "",
  estimateHour: "",
  statusId: null,
  completedDate: null,
  unitPrice: "",
  value: "",
  orderId: null,
  currencyId: null,
};

const INIT_ERROR = {
  title: "",
  unitPrice: "",
  value: "",
};

const TabPanelOrderItemList = (props: any) => {

  const trans = useTrans();
  const {
    dataOrderItemListByOrderId,
    getOrderItemListByOrderId,
    deleteOrderItem,
    getDetailOrderItem,
    clearData,
    createOrderItem,
    updateOrderItem,
    orderItemErrors,
    dataOrderDetail,
    dataOrderStatusList,
    getDetailOrder,
  } = props;
  const {
    dataCreateOrderItem,
    dataDeleteOrderItem,
    dataOrderItemDetail,
    dataUpdateOrderItem,
  } = props.orderItem;
  const [id, setId] = useState<number | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [newLine, setNewLine] = useState<any>(null);
  const [dataForm, setDataForm] = useState<DataFormType>(INIT_DATA);
  const [dataError, setDataError] = useState(INIT_ERROR);
  const [querySearch, setQuerySearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [editOrderItem, setEditOrderItem] = useState<boolean>(false);
  const router = useRouter();
  const q: any = useMemo(() => router.query, [router]);
  const orderId = q?.id || "";
  const [totalEstimateHour, setTotalEstimateHour] = useState<any>();

  const handleEdit = (id: number) => {
    setId(id);
    setEditOrderItem(true);
  };

  const handleCloseEditForm = () => {
    setEditOrderItem(false);
  };

  useEffect(() => {
    if (id) {
      getDetailOrderItem(id);
    }
  }, [id]);

  useEffect(() => {
    if (dataOrderItemDetail)
      setDataForm({
        ...dataForm,
        title: dataOrderItemDetail?.title,
        estimateHour: dataOrderItemDetail?.estimateHour,
        statusId: Number(dataOrderItemDetail?.status?.id),
        value: dataOrderItemDetail?.value,
        unitPrice: dataOrderItemDetail?.unitPrice,
        completedDate: dataOrderItemDetail?.completedDate,
      });
  }, [dataOrderItemDetail, orderId]);

  const addNewLine = () => {
    if (!newLine) {
      addFormNew();
    } else {
      createOrderItem({...dataForm , unitPrice: dataForm.unitPrice.replace(/,/g, '')});
      addFormNew();
      setDataForm(INIT_DATA);
    }
  };

  const addFormNew = () => {
    setNewLine(
      <FormTableRowCreateOrderItem
        setNewLine={setNewLine}
        indexOrderItem={
          (page - 1) * rowsPerPage +
          dataOrderItemListByOrderId?.items?.length +
          1
        }
        dataOrderStatusList={dataOrderStatusList}
        currencyId={dataOrderDetail?.currency?.id}
        orderId={orderId}
        getFormDataFromOrderItem={setDataForm}
        newLine={newLine}
      />
    );
  };

  const handleDelete = (id: number) => {
    setOpenDeleteModal(true);
    setId(id);
  };

  const handleChangeInput = (key: any, value: any) => {
    setDataForm({ ...dataForm, [key]: value });
  };

  const handleSubmitFormByEnter = useCallback(
    (e: { key: string; keyCode: number }) => {
      if (e.key === "Enter" || e.keyCode === 13) {
        if (
          checkChangeDataBeforeUpdate(dataForm, dataOrderItemDetail) ||
          dataForm?.statusId !== dataOrderItemDetail?.status?.id
        ) {
          updateOrderItem(dataForm, id);
        }
      }
    },
    [dataForm, dataOrderItemDetail, updateOrderItem, id]
  );
  

  const handleSubmitEditForm = () => {
    const { currencyId, orderId, ...newData }: any = dataForm;
    setDataError(INIT_ERROR);
    updateOrderItem({...newData, unitPrice: dataForm.unitPrice.replace(/,/g, '')}, id);
  };

  useEffect(() => {
    if (dataCreateOrderItem) {
      clearData("dataCreateOrderItem");
      setPage(1);
      getOrderItemListByOrderId(
        `limit=${rowsPerPage}&offset=${0 * rowsPerPage}`,
        orderId
      );
    }
  }, [dataCreateOrderItem]);

  useEffect(() => {
    if (dataUpdateOrderItem) {
      clearData("dataUpdateOrderItem");
      setEditOrderItem(false);
    }
    if (dataDeleteOrderItem) {
      clearData("dataDeleteOrderItem");
      setNewLine(null);
    }
    if (orderId) {
      getOrderItemListByOrderId(
        `limit=${rowsPerPage}&offset=${(page - 1) * rowsPerPage}`,
        orderId
      );
    }
  }, [dataUpdateOrderItem, dataDeleteOrderItem]);

  useEffect(() => {
    if (querySearch && orderId) getOrderItemListByOrderId(querySearch, orderId);
  }, [querySearch]);

  useEffect(() => {
    setDataError({ ...INIT_ERROR, ...orderItemErrors });
  }, [orderItemErrors]);

  useEffect(() => {
    if (dataCreateOrderItem || dataUpdateOrderItem || dataDeleteOrderItem)
      getDetailOrder(orderId);
  }, [dataCreateOrderItem, dataUpdateOrderItem, dataDeleteOrderItem]);

  useEffect(() => {
    if (dataOrderItemListByOrderId) {
      setTotalEstimateHour(
        dataOrderItemListByOrderId?.items.reduce(function (
          sum: any,
          item: any
        ) {
          return sum + Number(item.estimateHour);
        },
        0)
      );
    }
  }, [dataOrderItemListByOrderId]);
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="list-index">#</TableCell>
              <TableCell>{trans.order.title}</TableCell>
              <TableCell width="15%" className="text-align-right">
                {trans.order.estimate_hours}
              </TableCell>
              <TableCell width="15%" className="text-align-right">
                {trans.order.unit_price}
              </TableCell>
              <TableCell width="15%" className="text-align-right">
                {trans.payment.amount_}
              </TableCell>
              <TableCell width="5%"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataOrderItemListByOrderId?.items.map((item: any, index: any) => (
              <TableRow
                key={item?.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell component="th" scope="row" key={item?.id}>
                  {id == item?.id && editOrderItem ? (
                    <InputBase
                      keyword="title"
                      placeholder={trans.invoice.title}
                      size="small"
                      errorText={getFirstValueInObject(dataError?.title)}
                      displayErrorText={false}
                      value={dataForm?.title}
                      onKeyUp={handleSubmitFormByEnter}
                      handleChange={handleChangeInput}
                    />
                  ) : (
                    item?.title
                  )}
                </TableCell>
                <TableCell className="text-align-right">
                  {id == item?.id && editOrderItem ? (
                    <InputBase
                      keyword="estimateHour"
                      placeholder= {trans.order.estimate_hours}
                      size="small"
                      value={dataForm?.estimateHour}
                      onKeyUp={handleSubmitFormByEnter}
                      handleChange={handleChangeInput}
                    />
                  ) : (
                    item?.estimateHour
                  )}
                </TableCell>
                <TableCell className="text-align-right">
                  {id == item?.id && editOrderItem ? (
                    <InputFormatNumber
                      keyword="unitPrice"
                      size="small"
                      errorText={getFirstValueInObject(dataError?.unitPrice)}
                      displayErrorText={false}
                      value={dataForm?.unitPrice}
                      onKeyUp={handleSubmitFormByEnter}
                      handleChange={handleChangeInput}
                    />
                  ) : (
                    `${formatCurrencyValue(item?.unitPrice)} ${
                      item?.order?.currency?.sign ?? ""
                    }`
                  )}
                </TableCell>
                <TableCell className="text-align-right">
                  {id == item?.id && editOrderItem ? (
                    <InputFormatNumber
                      keyword="value"
                      disabled="true"
                      size="small"
                      errorText={getFirstValueInObject(dataError?.unitPrice)}
                      displayErrorText={false}
                      value={dataForm?.value}
                      onKeyUp={handleSubmitFormByEnter}
                      handleChange={handleChangeInput}
                    />
                  ) : (
                    `${formatCurrencyValue(item?.value)} ${
                      item?.order?.currency?.sign ?? ""
                    }`
                  )}
                </TableCell>
                <TableCell>
                  {id == item?.id && editOrderItem ? (
                    <>
                      <IconButton
                        size="small"
                        onClick={() => handleSubmitEditForm()}
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleCloseEditForm()}
                      >
                        <ClearIcon />
                      </IconButton>
                    </>
                  ) : (
                    <Stack direction="row">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(item?.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        key={item?.id}
                        onClick={() => handleEdit(item?.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Stack>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {newLine}
            {totalEstimateHour ? (
              <>
                <TableRow>
                  <TableCell
                     width="10%"
                    className="text-align-left"
                    sx={{ fontWeight: "700" }}
                  >
                    {trans.order.total_amount}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell width="15%" className="text-align-right">
                    {totalEstimateHour}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-align-right">
                    {formatCurrencyValue(dataOrderDetail?.totalValueOrderItem)} { dataOrderDetail?.currency?.sign ?? ""}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </>
            ) : (
              <></>
            )}
            <TableRow>
              <TableCell></TableCell>
              <Button
                onClick={addNewLine}
                disabled={dataOrderDetail?.customer?.currency !== null ? false : true}
              >
                {trans.order.add_new_line}
              </Button>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {dataOrderItemListByOrderId?.total > rowsPerPage && (
        <PaginationDefault
          total={dataOrderItemListByOrderId?.total}
          setQuerySearch={setQuerySearch}
          paginateByParamUrl={false}
          setCustomPage={setPage}
          customPage={page}
          setNewLine={setNewLine}
        />
      )}
      {!!id && (
        <ModalDelete
          openModal={openDeleteModal}
          setOpenModal={setOpenDeleteModal}
          action={() => deleteOrderItem(id)}
          title={trans.order.about_delete}
          content={trans.order.about_delete_content}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  order: state.order,
  orderItem: state.orderItem,
  orderStatus: state.orderStatus,
  orderItemErrors: state.orderItem?.error?.response?.data?.properties ?? {},
});

const mapDispatchToProps = {
  deleteOrderItem,
  getDetailOrderItem,
  updateOrderItem,
  createOrderItem,
  clearData,
  getOrderItemListByOrderId,
  getDetailOrder,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabPanelOrderItemList);
