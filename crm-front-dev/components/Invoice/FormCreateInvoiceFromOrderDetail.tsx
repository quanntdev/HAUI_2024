import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Divider,
  Grid,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Box,
  Card,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { Close } from "@mui/icons-material";
import styles from "./styles.module.scss";
import InputBase from "../Input/InputBase";
import { useCallback, useEffect, useState } from "react";
import InputFormatNumber from "../Input/InputFormatNumber";
import DatePickerDefault from "../Input/DatePickerDefault";
import SelectDefault from "../Input/SelectDefault";
import { createInvoice, clearData } from "../../redux/actions/invoice";
import { connect } from "react-redux";
import { getFirstValueInObject } from "../../helpers";
import removeCommaCurrencyValue from "../../utility/removeCommaCurrencyValue";
import FormTableRowCreateOrderItem from "./FormTableRowCreateOrderItem";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import getTotalValueInvoiceOrderItem from "../../utility/getTotalValueInvoiceOrderItem";
import { getDetailOrder } from "../../redux/actions/order";
import { todayMoment, tomorrowMoment, REGEX_NUMBER } from "../../constants";
import useTrans from "../../utils/useTran";

type DataFormOrderItemType = {
  uid: number | null;
  order_item_id: number | null;
  name: string;
  value: number | null;
  tax_rate: number | null;
  total_value: number | null;
};

const INIT_DATA_ORDER_ITEM = {
  uid: null,
  order_item_id: null,
  name: "",
  value: null,
  tax_rate: null,
  total_value: null,
};

type DataFormType = {
  order_id: number | null;
  invoice_category_id: number | null;
  start_date: string | null;
  due_date: string | null;
  order_items: readonly any[];
  VAT: number | null;
};

const INIT_DATA = {
  order_id: null,
  invoice_category_id: null,
  start_date: todayMoment.format("YYYY-MM-DD"),
  due_date: tomorrowMoment.format("YYYY-MM-DD"),
  order_items: [],
  VAT: 0,
};

const INIT_ERROR = {
  invoice_category_id: null,
  start_date: "",
  due_date: "",
};

const FormCreateInvoiceFromOrderDetail = (props: any) => {
  const trans = useTrans();
  const {
    openFormModal,
    setOpenFormModal,
    customerName,
    dataInvoiceCategoryList,
    createInvoice,
    errors,
    clearData,
    orderId,
    dataOrderDetail,
    dataOrderItem,
    getDetailOrder,
  } = props;
  const { dataCreateInvoice } = props.invoice;
  const { dataUpdateOrderItem } = props.orderItem;
  const [uid, setUid] = useState<number | null>(null);
  const [newLine, setNewLine] = useState<any>(null);
  const [editOrderItem, setEditOrderItem] = useState<boolean>(false);
  const [dataForm, setDataForm] = useState<DataFormType>(INIT_DATA);
  const [dataError, setDataError] = useState(INIT_ERROR);
  const [dataFormOrderItem, setDataFormOrderItem] =
    useState<DataFormOrderItemType>(INIT_DATA_ORDER_ITEM);
  const [taxRateCommon, setTaxRateCommon] = useState<number>(0);
  const [taxRateCommonSubmit, setTaxRateCommonSubmit] = useState<number>(0);
  const [taxRateCommonError, setTaxRateCommonError] = useState<boolean>(false);
  const [taxRateEachRowError, setTaxRateEachRowError] =
    useState<boolean>(false);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalTaxRate, setTotalTaxRate] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [orderItemSelected, setOrderItemSelected] = useState<
    readonly DataFormOrderItemType[]
  >([]);
  const [orderItemList, setOrderItemList] = useState<any>([]);
  const isSelected = (id: string) => selected?.indexOf(id) !== -1;
  const currency = dataOrderDetail?.currency?.sign;
  const [isCreate, setIsCreate] = useState<boolean>(false);

  const getTaxRate = (value: number, taxRate: number) => {
    if (taxRate != 0) return value * (taxRate / 100);
    return 0;
  };

  useEffect(() => {
    setOrderItemList(
      dataOrderItem?.map((item: any) => {
        return {
          uid: item?.id,
          order_item_id: item?.id,
          name: item?.title,
          value: item?.value,
          tax_rate: 0,
          total_value: item?.value,
        };
      })
    );
  }, [dataOrderItem]);

  useEffect(() => {
    const newOrderItemSelected = orderItemSelected.map(
      ({ uid, ...rest }) => rest
    );
    setDataForm({
      ...dataForm,
      order_id: Number(orderId),
      order_items: newOrderItemSelected,
    });
  }, [orderId, orderItemSelected]);

  useEffect(() => {
    const newOrderItemSelected = [...orderItemSelected];
    if (taxRateCommonSubmit != 0) {
      newOrderItemSelected.forEach((item: any) => {
        item["tax_rate"] = Number(taxRateCommonSubmit);
        item["total_value"] = getTotalValueInvoiceOrderItem(
          item["value"],
          taxRateCommonSubmit
        );
      });
      setTaxRateCommonSubmit(0);
    }
    if (!!dataFormOrderItem?.tax_rate) {
      newOrderItemSelected.forEach((item: any) => {
        if (
          Number(item?.order_item_id) ===
          Number(dataFormOrderItem?.order_item_id)
        ) {
          item["tax_rate"] = Number(dataFormOrderItem?.tax_rate);
          item["total_value"] = getTotalValueInvoiceOrderItem(
            item["value"],
            dataFormOrderItem?.tax_rate
          );
        }
      });
    }
    setOrderItemSelected(newOrderItemSelected);
  }, [taxRateCommonSubmit, dataFormOrderItem]);

  useEffect(() => {
    let newTotalValue = 0;
    let newTotalTaxRate = 0;
    orderItemSelected?.map((item: any) => {
      newTotalValue += item["value"];
      newTotalTaxRate += getTaxRate(item["value"], item["tax_rate"]);
    });
    setTotalValue(newTotalValue);
    setTotalTaxRate(
      Number(
        newTotalTaxRate.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })
      )
    );
    setTotal(newTotalValue + newTotalTaxRate);
  }, [orderItemSelected, taxRateCommonSubmit, dataFormOrderItem]);

  useEffect(() => {
    setDataError({ ...INIT_ERROR, ...errors });
  }, [errors]);

  useEffect(() => {
    if(taxRateCommon) {
      setDataForm({
        ...dataForm,
        VAT : taxRateCommon
      })
    }
  }, [taxRateCommon])

  useEffect(() => {
    if (dataCreateInvoice) clearData("dataCreateInvoice");
    if (dataUpdateOrderItem) clearData("dataUpdateOrderItem");
    handleCloseModal();
  }, [dataCreateInvoice, dataUpdateOrderItem]);

  useEffect(() => {
    if (dataCreateInvoice) {
      getDetailOrder(orderId);
    }
  }, [dataCreateInvoice]);

  const handleSubmitAllTaxRate = function () {
    if (REGEX_NUMBER.test(taxRateCommon.toString())) {
      setTaxRateCommonError(false);
      setTaxRateCommonSubmit(taxRateCommon);
      setOrderItemList(
        orderItemList?.map((item: any) => {
          return {
            uid: item?.uid,
            order_item_id: Number(item?.order_item_id),
            name: item?.name,
            value: item?.value,
            tax_rate: taxRateCommon,
            total_value: getTotalValueInvoiceOrderItem(
              item?.value,
              taxRateCommon
            ),
          };
        })
      );
    } else setTaxRateCommonError(true);
  };

  const handleSelectAllRow = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && orderItemList.length > 0) {
      const newOrderItemSelected = orderItemList?.map((item: any) => {
        const formatItemValue = removeCommaCurrencyValue(item?.value);
        return {
          uid: item?.uid,
          order_item_id: Number(item?.order_item_id),
          name: item?.name,
          value: formatItemValue,
          tax_rate: Number(item?.tax_rate),
          total_value: getTotalValueInvoiceOrderItem(
            item?.value,
            item?.tax_rate
          ),
        };
      });
      const newSelected = newOrderItemSelected;
      setSelected(newSelected?.map((item: any) => item?.uid));
      setOrderItemSelected(newOrderItemSelected);
      setIsCreate(false);
      return;
    }
    setSelected([]);
    setOrderItemSelected([]);
  };

  const handleSelectOneRow = (
    event: React.MouseEvent<unknown>,
    orderItem: any
  ) => {
    const selectedIndex = selected?.indexOf(orderItem?.uid);
    let newSelected: readonly string[] = [];
    let newOrderItemSelected: readonly any[] = [];
    const formatOrderItemValue = removeCommaCurrencyValue(orderItem?.value);

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, orderItem?.uid);
      newOrderItemSelected = newOrderItemSelected.concat(orderItemSelected, {
        order_item_id: orderItem?.order_item_id
          ? Number(orderItem?.order_item_id)
          : null,
        name: orderItem?.name,
        value: formatOrderItemValue,
        tax_rate: Number(orderItem?.tax_rate),
        total_value: getTotalValueInvoiceOrderItem(
          orderItem?.value,
          orderItem?.tax_rate
        ),
      });
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newOrderItemSelected = newOrderItemSelected.concat(
        orderItemSelected.slice(1)
      );
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newOrderItemSelected = newOrderItemSelected.concat(
        orderItemSelected.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
      newOrderItemSelected = newOrderItemSelected.concat(
        orderItemSelected.slice(0, selectedIndex),
        orderItemSelected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    setOrderItemSelected(newOrderItemSelected);

    if (isSelected(orderItem?.uid)) {
      setTotalValue(totalValue - formatOrderItemValue);
    } else {
      setTotalValue(totalValue + formatOrderItemValue);
    }
  };

  const handleDeleteOrderItem = (uid: number) => {
    const newOrderItemList = [...orderItemList];
    const index = newOrderItemList.findIndex((item: any) => item.uid == uid);
    if (index > -1) newOrderItemList.splice(index, 1);
    setOrderItemList(newOrderItemList);
  };

  const handleEditOrderItem = (uid: number) => {
    setUid(uid);
    setDataFormOrderItem({
      ...INIT_DATA_ORDER_ITEM,
      ...orderItemList?.find((item: any) => item?.uid == uid),
    });
    setEditOrderItem(true);
  };

  const updateOrderItemEachRow = (uid: string) => {
    const newOrderItemList = [...orderItemList];
    if (
      dataFormOrderItem?.tax_rate != null &&
      REGEX_NUMBER.test(dataFormOrderItem?.tax_rate?.toString())
    ) {
      setTaxRateEachRowError(false);
      newOrderItemList.forEach((item: any) => {
        if (Number(item?.uid) === Number(uid)) {
          item["value"] = dataFormOrderItem?.value;
          item["tax_rate"] = dataFormOrderItem?.tax_rate;
          item["total_value"] = getTotalValueInvoiceOrderItem(
            item["value"],
            dataFormOrderItem?.tax_rate
          );
        }
      });
      setOrderItemList(newOrderItemList);
      setDataFormOrderItem(INIT_DATA_ORDER_ITEM);
      setEditOrderItem(false);
    } else setTaxRateEachRowError(true);
  };

  const handleCreateInvoice = async (e: { preventDefault: () => void }) => {
    if (isCreate) {
      return;
    }
    setIsCreate(true);
    e.preventDefault();
    if (orderItemSelected?.length > 0) {
      createInvoice(dataForm).then(() => {
        setIsCreate(false);
      });
    }
  };

  useEffect(() => {
    if(dataCreateInvoice){
      handleCloseModal();
    }
  }, [dataCreateInvoice])

  const handleCloseModal = () => {
    setDataForm(INIT_DATA);
    setDataError(INIT_ERROR);
    setTaxRateCommonSubmit(0);
    setTaxRateCommon(0);
    setOrderItemSelected([]);
    setSelected([]);
    setOpenFormModal(false);
  };

  const handleChangeInput = useCallback((key: any, value: any) => {
    if (key === "tax_rate" || key === "name" || key === "value") {
      setDataFormOrderItem((prevDataFormOrderItem) => ({
        ...prevDataFormOrderItem,
        [key]: value ?? ""
      }));
    } else {
      setDataForm((prevDataForm) => ({
        ...prevDataForm,
        [key]: value ?? ""
      }));
    }
  }, []);

  const handleChangeSelect = (key: any, value: any) => {
    setDataForm({ ...dataForm, [key]: Number(value) ?? "" });
  };

  const handleChangeTaxRate = (key: any, value: any) => {
    setTaxRateCommon(value);
  };

  
  const addNewLine = useCallback(() => {
    const newLineComponent = (
      <FormTableRowCreateOrderItem
        dataFormOrderItem={dataFormOrderItem}
        handleChangeInput={handleChangeInput}
        orderItemList={orderItemList}
        setOrderItemList={setOrderItemList}
        setNewLine={setNewLine}
        newLineId={orderItemList?.length}
      />
    );
    setNewLine(newLineComponent);
  }, [dataFormOrderItem, handleChangeInput, orderItemList, setNewLine]);

  return (
    <>
      <Dialog
        open={openFormModal}
        onClose={handleCloseModal}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        className="dialog-form"
        classes={{
          paper: styles["form-invoice-paper"],
        }}
      >
        <DialogTitle
          className="dialog-title"
          id="scroll-dialog-title"
          sx={{ fontWeight: "bold", fontSize: "20px" }}
        >
          {trans.invoice.new_invoice}
          <Button onClick={handleCloseModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ backgroundColor: "#EBF2F5", padding: 1 }}>
            <Card sx={{ padding: 1, display: "inline-block" }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", whiteSpace: "normal" }}
              >
                {customerName}
              </Typography>
            </Card>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md mt={2}>
              <DatePickerDefault
                require={true}
                labelText={trans.invoice.invoice_date}
                keyword="start_date"
                size="small"
                value={dataForm?.start_date}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.start_date)}
              />
            </Grid>
            <Grid item xs={12} md mt={2}>
              <DatePickerDefault
                require={true}
                labelText={trans.order.due_date_}
                keyword="due_date"
                size="small"
                value={dataForm?.due_date}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.due_date)}
                minDate={dataForm?.start_date}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md mt={2}>
              <SelectDefault
                require={true}
                labelText={trans.deal.category}
                keyword="invoice_category_id"
                keyMenuItem="id"
                keyValue="name"
                size="small"
                value={dataForm?.invoice_category_id}
                handleChange={handleChangeSelect}
                data={dataInvoiceCategoryList}
                errorText={getFirstValueInObject(
                  dataError?.invoice_category_id
                )}
              />
            </Grid>
            <Grid item xs>
              <Grid container spacing={1}>
                <Grid item xs={12} md mt={2}>
                  <InputBase
                    labelText={trans.invoice.tax_rate}
                    keyword="tax_rate"
                    size="small"
                    errorText={taxRateCommonError}
                    displayErrorText={false}
                    value={taxRateCommon}
                    handleChange={handleChangeTaxRate}
                  />
                </Grid>
                <Grid
                  item
                  xs
                  md={2}
                  sx={{ textAlign: "right", alignSelf: "flex-end" }}
                >
                  <Button
                    variant="outlined"
                    sx={{ height: "40px" }}
                    onClick={handleSubmitAllTaxRate}
                  >
                    {trans.task.add}
                  </Button>
                </Grid>
              </Grid>
              {dataOrderDetail?.partners?.length > 0 && (
                <Grid container spacing={1}>
                <Grid item xs={10} mt={2}>
                  <InputBase
                    labelText={trans.partner.vat_for_partner}
                    keyword="VAT"
                    size="small"
                    errorText={taxRateCommonError}
                    displayErrorText={false}
                    value={dataForm?.VAT}
                    handleChange={handleChangeInput}
                  />
                </Grid>
              </Grid>
              )}
            </Grid>
          </Grid>
          <TableContainer component={Paper} sx={{ margin: "20px 0" }}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selected?.length > 0 &&
                        selected?.length < orderItemList?.length
                      }
                      checked={
                        orderItemList?.length > 0 &&
                        selected?.length === orderItemList?.length
                      }
                      onChange={handleSelectAllRow}
                      inputProps={{
                        "aria-label": "select all rows",
                      }}
                    />
                  </TableCell>
                  <TableCell className="list-index">#</TableCell>
                  <TableCell width="30%">{trans.order.title}</TableCell>
                  <TableCell width="15%" className="text-align-right">
                    {trans.deal.value}
                  </TableCell>
                  <TableCell width="15%" className="text-align-center">
                    {trans.invoice.tax_rate}
                  </TableCell>
                  <TableCell width="15%" className="text-align-right">
                    {trans.invoice.total}
                  </TableCell>
                  <TableCell width="5%"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderItemList?.map((item: any, index: any) => (
                  <TableRow
                    key={item?.uid}
                    hover
                    role="checkbox"
                    aria-checked={isSelected(item?.uid)}
                    selected={isSelected(item?.uid)}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      padding="checkbox"
                      onClick={(event) => handleSelectOneRow(event, item)}
                    >
                      <Checkbox
                        color="primary"
                        checked={isSelected(item?.uid)}
                        inputProps={{
                          "aria-labelledby": "",
                        }}
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell component="th" scope="row" key={item?.id}>
                      {uid === item?.uid && editOrderItem ? (
                        <InputBase
                          keyword="name"
                          placeholder="name"
                          size="small"
                          displayErrorText={false}
                          value={dataFormOrderItem?.name}
                          handleChange={handleChangeInput}
                        />
                      ) : (
                        item?.name
                      )}
                    </TableCell>
                    <TableCell className="text-align-right">
                      {uid == item?.uid && editOrderItem ? (
                        <InputFormatNumber
                          keyword="value"
                          size="small"
                          displayErrorText={false}
                          value={dataFormOrderItem?.value}
                          handleChange={handleChangeInput}
                        />
                      ) : (
                        `${item?.value} ${currency ?? ""}`
                      )}
                    </TableCell>
                    <TableCell className="text-align-center">
                      {uid == item?.uid && editOrderItem ? (
                        <InputBase
                          keyword="tax_rate"
                          size="small"
                          displayErrorText={false}
                          errorText={taxRateEachRowError}
                          value={dataFormOrderItem?.tax_rate}
                          handleChange={handleChangeInput}
                        />
                      ) : (
                        `${item?.tax_rate ? item?.tax_rate : 0} %`
                      )}
                    </TableCell>
                    <TableCell className="text-align-right">
                      {formatCurrencyValue(
                        getTotalValueInvoiceOrderItem(
                          item?.value,
                          item?.tax_rate
                        )?.toString()
                      )}{" "}
                      {currency}
                    </TableCell>
                    <TableCell>
                      {uid == item?.uid && editOrderItem ? (
                        <IconButton
                          onClick={() => updateOrderItemEachRow(item?.uid)}
                        >
                          <SaveIcon />
                        </IconButton>
                      ) : (
                        <Stack direction="row">
                          <IconButton
                            onClick={() => handleDeleteOrderItem(item?.uid)}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleEditOrderItem(item?.uid)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {newLine}
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Button onClick={addNewLine}>{trans.invoice.add_an_optional}</Button>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container>
            <Grid item xs md={3}>
              <Link href="#" underline="none">
                {/* File attactment */}
              </Link>
            </Grid>
            <Grid
              item
              xs
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography>Total items: {orderItemSelected?.length}</Typography>
              <Stack sx={{ width: "50%" }}>
                <Grid container>
                  <Grid item xs>
                    <Typography>{trans.invoice.total_value}</Typography>
                    <Typography>{trans.invoice.tax_values} </Typography>
                    <Typography sx={{ borderTop: "1px solid grey" }}>
                      {trans.invoice.total}:{" "}
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography textAlign="right">
                      {formatCurrencyValue(totalValue.toString())} {currency}{" "}
                    </Typography>
                    <Typography textAlign="right">
                      {formatCurrencyValue(totalTaxRate.toString())} {currency}{" "}
                    </Typography>
                    <Typography
                      sx={{ borderTop: "1px solid grey" }}
                      textAlign="right"
                    >
                      {formatCurrencyValue(total.toString())} {currency}
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleCloseModal} className="btn-cancel">
              {trans.task.cancle}
            </Button>
            <Button onClick={handleCreateInvoice} className="btn-save">
              {trans.invoice.submit}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  invoice: state?.invoice,
  orderItem: state?.orderItem,
  errors: state.invoice?.error?.response?.data?.properties ?? {},
  order: state?.order,
});

const mapDispatchToProps = {
  createInvoice,
  clearData,
  getDetailOrder,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormCreateInvoiceFromOrderDetail);
