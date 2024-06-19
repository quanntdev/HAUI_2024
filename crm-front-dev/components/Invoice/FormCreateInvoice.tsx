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
  Autocomplete,
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import InputBase from "../Input/InputBase";
import SelectDefault from "../Input/SelectDefault";
import { connect } from "react-redux";
import DatePickerDefault from "../Input/DatePickerDefault";
import { useCallback, useEffect, useState } from "react";
import { clearData } from "../../redux/actions/task";
import { searchUser } from "../../redux/actions/user";
import Checkbox from "@mui/material/Checkbox";
import { getFirstValueInObject } from "../../helpers";
import { useRouter } from "next/router";
import {
  searchCustomer,
  searchNameAndIdCustomer,
} from "../../redux/actions/customer";
import { searchDeal } from "../../redux/actions/deal";
import { searchOrder, getDetailOrder } from "../../redux/actions/order";
import {
  todayMoment,
  tomorrowMoment,
  rowsPerPageLimit,
  REGEX_NUMBER,
} from "../../constants";
import FormTableRowCreateOrderItem from "./FormTableRowCreateOrderItem";
import { getInvoiceCategoryList } from "../../redux/actions/invoiceCategory";
import removeCommaCurrencyValue from "../../utility/removeCommaCurrencyValue";
import InputFormatNumber from "../Input/InputFormatNumber";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import getTotalValueInvoiceOrderItem from "../../utility/getTotalValueInvoiceOrderItem";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import { createInvoice, searchInvoices } from "../../redux/actions/invoice";
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
  order_id: null,
  invoice_category_id: null,
  start_date: "",
  due_date: "",
};

const FormCreateInvoice = (props: any) => {
  const trans = useTrans();
  const {
    clearData,
    openFormModal,
    setOpenFormModal,
    errors,
    onScreen = false,
    searchCustomer,
    searchOrder,
    getInvoiceCategoryList,
    getDetailOrder,
    createInvoice,
    searchNameAndIdCustomer,
  } = props;
  const { dataListNameAndIDByCustomer } = props.customer;
  const { dataCreateInvoice } = props.invoice;
  const { dataUpdateOrderItem } = props.orderItem;
  const { dataOrderList, dataOrderDetail } = props.order;
  const { dataCreateTask } = props.task;
  const { dataInvoiceCategoryList } = props.invoiceCategory;
  const [dataForm, setDataForm] = useState<any>(INIT_DATA);
  const [dataError, setDataError] = useState<any>(INIT_ERROR);
  const router = useRouter();
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [keywordItems, setKeywordItems] = useState<any>(null);
  const [newLine, setNewLine] = useState<any>(null);
  const [dataFormOrderItem, setDataFormOrderItem] =
    useState<DataFormOrderItemType>(INIT_DATA_ORDER_ITEM);
  const [orderItemList, setOrderItemList] = useState<any>([]);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const isSelected = (id: string) => selected?.indexOf(id) !== -1;
  const [listOrder, setListOrder] = useState<any>(null);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [orderItemSelected, setOrderItemSelected] = useState<
    readonly DataFormOrderItemType[]
  >([]);
  const [uid, setUid] = useState<number | null>(null);
  const [editOrderItem, setEditOrderItem] = useState<boolean>(false);
  const [orderDetail, setOrderDeatil] = useState<any>(null);
  const currency = orderDetail?.currency?.sign;
  const [totalTaxRate, setTotalTaxRate] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [taxRateCommon, setTaxRateCommon] = useState<number>(0);
  const [taxRateCommonSubmit, setTaxRateCommonSubmit] = useState<number>(0);
  const [taxRateCommonError, setTaxRateCommonError] = useState<boolean>(false);
  const [taxRateEachRowError, setTaxRateEachRowError] =
    useState<boolean>(false);

  const [customerOptions, setCustomerOptions] = useState([]);
  const [searchNameCustomer, setSearchNameCustomer] = useState("");

  const getTaxRate = (value: number, taxRate: number) => {
    if (taxRate != 0) return value * (taxRate / 100);
    return 0;
  };
  const [orderId, setOrderId] = useState<any>(null);

  useEffect(() => {
    if (openFormModal) {
      getInvoiceCategoryList();
    }
  }, [openFormModal]);

  useEffect(() => {
    if (!openFormModal) {
      setDataForm(INIT_DATA);
    }
  });

  useEffect(() => {
    const query = `limit=${rowsPerPageLimit}&offset=${0}`;
    searchCustomer(query);
  }, []);

  const addNewLine = useCallback(() => {
    setNewLine(
      <FormTableRowCreateOrderItem
        dataFormOrderItem={dataFormOrderItem}
        handleChangeInput={handleChangeInput}
        orderItemList={orderItemList}
        setOrderItemList={setOrderItemList}
        setNewLine={setNewLine}
        newLineId={orderItemList?.length}
      />
    );
  }, [dataFormOrderItem, orderItemList, setNewLine]);

  useEffect(() => {
    if (dataOrderList) {
      setListOrder(
        dataOrderList?.data?.items?.filter((item: any) => item.currency != null)
      );
    }
  }, [dataOrderList]);

  useEffect(() => {
    if (dataOrderDetail) {
      setOrderDeatil(dataOrderDetail);
      setOrderId(dataOrderDetail?.id);
    }
  }, [dataOrderDetail]);

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

  const handleEditOrderItem = (uid: number) => {
    setUid(uid);
    setDataFormOrderItem({
      ...INIT_DATA_ORDER_ITEM,
      ...orderItemList?.find((item: any) => item?.uid == uid),
    });
    setEditOrderItem(true);
  };

  const handleDeleteOrderItem = (uid: number) => {
    const newOrderItemList = [...orderItemList];
    const index = newOrderItemList.findIndex((item: any) => item.uid == uid);
    if (index > -1) newOrderItemList.splice(index, 1);
    setOrderItemList(newOrderItemList);
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

  useEffect(() => {
    if (errors) setDataError(errors);
  }, [errors]);

  useEffect(() => {
    if (dataCreateTask) {
      clearData("dataCreateTask");
      handleCloseModal();
      if (!onScreen) {
        router.push("/task");
      }
    }
  }, [dataCreateTask]);

  useEffect(() => {
    if (taxRateCommon) {
      setDataForm({
        ...dataForm,
        VAT: taxRateCommon,
      });
    }
  }, [taxRateCommon]);

  useEffect(() => {
    if (
      dataForm?.dueDate &&
      dataForm?.startDate &&
      dataForm?.dueDate < dataForm?.startDate
    ) {
      setDataError({
        ...dataError,
        ["dueDate"]: ["DueDate must be bigger StartDate"],
      });
    }
  }, [errors]);

  const handleChangeInput = useCallback(
    (key: any, value: any) => {
      if (key === "tax_rate" || key === "name" || key === "value") {
        setDataFormOrderItem((prevDataFormOrderItem) => ({
          ...prevDataFormOrderItem,
          [key]: value ?? "",
        }));
      } else {
        setDataForm({
          ...dataForm,
          [key]: value ?? "",
        });
      }
    },
    [dataForm]
  );

  const handleChangeSelect = (key: any, value: any) => {
    setDataForm({ ...dataForm, [key]: Number(value) });
    if (key == "customerId") {
      const querySearch = `customerId=${value}`;
      searchOrder(querySearch);
    }
    if (key == "order_id") {
      getDetailOrder(value);
    }
  };

  const renderParams = useCallback((params: any) => {
    return <TextField {...params} onChange={handleTextFieldChange} />;
  }, [handleTextFieldChange]);

  
  useEffect(() => {
    setDataForm({
      ...dataForm,
      customerId: null,
      dealId: null,
      orderId: null,
      invoiceId: null,
    });
  }, [keywordItems]);

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
    setOrderItemList(
      orderDetail?.items?.map((item: any) => {
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
  }, [orderDetail]);

  useEffect(() => {
    const newOrderItemSelected = orderItemSelected.map(
      ({ uid, ...rest }) => rest
    );
    if (orderId) {
      setDataForm({
        ...dataForm,
        order_id: Number(orderId),
        order_items: newOrderItemSelected,
      });
    }
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
    if (dataCreateInvoice) clearData("dataCreateInvoice");
    if (dataUpdateOrderItem) clearData("dataUpdateOrderItem");
    handleCloseModal();
  }, [dataCreateInvoice, dataUpdateOrderItem]);

  useEffect(() => {
    if (dataCreateInvoice) {
      handleCloseModal();
      router.push(router.route);
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

  const handleCloseModal = () => {
    setDataForm(INIT_DATA);
    setDataError(INIT_ERROR);
    setTaxRateCommonSubmit(0);
    setTaxRateCommon(0);
    setOrderItemSelected([]);
    setOrderItemList([]);
    setSelected([]);
    setOpenFormModal(false);
    setListOrder(null);
    clearData("dataOrderList");
    clearData("dataOrderDetail");
    setOrderDeatil(null);
  };

  const handleChangeTaxRate = (key: any, value: any) => {
    setTaxRateCommon(value);
  };
  ///////

  function handleTextFieldChange(e: any) {
    const updatedValue = e.target.value;
    setSearchNameCustomer(updatedValue);
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const query = `keyword=${searchNameCustomer}`;
      searchNameAndIdCustomer(query);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchNameCustomer]);

  useEffect(() => {
    const CustomerOptions = dataListNameAndIDByCustomer?.map(
      (key: { id: any; name: any }) => ({
        id: key?.id,
        value: key?.id,
        label: key?.name,
      })
    );
    setCustomerOptions(CustomerOptions);
  }, [dataListNameAndIDByCustomer]);

  const handleAutocompleteChange = useCallback(
    (event: any, value: any) => {
      if (value) {
        const { id } = value;
        const querySearch = `customerId=${id}`;
        searchOrder(querySearch);
      } else {
        setListOrder([]);
      }
    },
    [searchOrder, setListOrder]
  );

  return (
    <>
      <Dialog
        open={openFormModal}
        onClose={handleCloseModal}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        disableEnforceFocus={true}
        disableAutoFocus={true}
        className="dialog-form"
        classes={{
          container: "form-dialog-container",
          paper: "form-dialog-paper",
        }}
      >
        <DialogTitle
          className="dialog-title"
          id="scroll-dialog-title"
          variant="h6"
        >
          {trans.invoice.add_invoice}
          <Button onClick={handleCloseModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box className="box-title">
            <Typography>{trans.menu.customer}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <Typography>{trans.customer.customer_name}</Typography>
              <Autocomplete
                disablePortal
                options={customerOptions}
                renderInput={renderParams}
                onChange={handleAutocompleteChange}
              />
            </Grid>
            <Grid item md={12}>
              <SelectDefault
                labelText={trans.order.order_name}
                keyword="order_id"
                keyMenuItem="id"
                keyValue="name"
                data={listOrder ?? []}
                require={true}
                handleChange={handleChangeSelect}
                value={dataForm?.order_id}
                errorText={getFirstValueInObject(dataError?.order_id)}
              />
            </Grid>
          </Grid>
          <Box className="box-title">
            <Typography>{trans.invoice.invoice_detail}</Typography>
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
                    {trans.invoice.add}
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
                  <TableCell width="30%">{trans.invoice.title}</TableCell>
                  <TableCell width="15%" className="text-align-right">
                    {trans.invoice.value}
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
                        ).toString()
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
                    <Button onClick={addNewLine}>
                      {trans.invoice.add_an_optional}
                    </Button>
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
              <Typography>
                {trans.invoice.total_items}: {orderItemSelected?.length}
              </Typography>
              <Stack sx={{ width: "50%" }}>
                <Grid container>
                  <Grid item xs>
                    <Typography>{trans.invoice.total_value}</Typography>
                    <Typography>{trans.invoice.tax_values}</Typography>
                    <Typography sx={{ borderTop: "1px solid grey" }}>
                      {trans.invoice.total}
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography textAlign="right">
                      {formatCurrencyValue(totalValue.toString())} {currency}
                    </Typography>
                    <Typography textAlign="right">
                      {formatCurrencyValue(totalTaxRate.toString())} {currency}
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
          <DialogActions className="dialog-actions">
            <Button className="btn-save" onClick={handleCreateInvoice}>
              {trans.invoice.submit}
            </Button>
            <Button onClick={handleCloseModal} className="btn-cancel">
              {trans.task.cancle}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  task: state.task,
  user: state.user,
  deal: state?.deal,
  orderItem: state?.orderItem,
  order: state?.order,
  invoice: state?.invoice,
  customer: state?.customer,
  invoiceCategory: state.invoiceCategory,
  errors: state?.task?.error?.response?.data?.properties ?? {},
});

const mapDispatchToProps = {
  createInvoice,
  clearData,
  searchUser,
  searchCustomer,
  searchDeal,
  searchOrder,
  searchInvoices,
  getInvoiceCategoryList,
  getDetailOrder,
  searchNameAndIdCustomer,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormCreateInvoice);
