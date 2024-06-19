import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import styles from "./styles.module.scss";
import { connect } from "react-redux";
import { todayMoment } from "../../constants";
import useTrans from "../../utils/useTran";
import SelectDefault from "../Input/SelectDefault";
import InputFormatNumber from "../Input/InputFormatNumber";
import InputBase from "../Input/InputBase";
import SelectInput from "../Input/SelectInput/SelectInput";
import DatePickerDefault from "../Input/DatePickerDefault";
import InputTiny from "../Input/InputTiny";
import {
  listPartner,
  clearData as clearDataPartner,
} from "../../redux/actions/partner";
import { useCallback, useEffect, useState } from "react";
import {
  getOrderByPartnerId,
  createPartnerPayment,
  clearData as clearDataPayment,
  updatePartnerPayment,
  createPaymentWithManyInvoice,
} from "../../redux/actions/partnerPayment";
import { getCanPaidInvoicesListByOrderId } from "../../redux/actions/order";
import { getDetailInvoice } from "../../redux/actions/invoice";
import {
  getDetailPartnerInvoice,
  clearData,
  getInvoicePartnerByOrderId,
} from "../../redux/actions/partnerInvoice";
import { getPaymentMethods } from "../../redux/actions/paymentMethod";
import { getFirstValueInObject } from "../../helpers";
import tranformDescription from "../../utility/tranformDescription";

import CancelIcon from "@mui/icons-material/Cancel";

const INIT_DATA_PAYMENT = {
  notes: "",
  amount: "",
  orderId: "",
  methodId: "",
  invoicePartnerId: "",
  partnerId: "",
  paymentDate: todayMoment.format("YYYY-MM-DD"),
  transaction: "",
  currencyId: "",
};
const INIT_DATA_PAYMENT_MULTI = {
  notes: "",
  transaction: "",
  methodId: "",
  orderId: "",
  invoicePartnerIds: "",
  paymentDate: todayMoment.format("YYYY-MM-DD"),
};

const INIT_ERROR = {
  notes: "",
  amount: "",
  orderId: "",
  methodId: "",
  partnerId: "",
  invoicePartnerId: "",
  paymentDate: "",
  transaction: "",
  currencyId: "",
};

const FormCreateOrUpdatePayment = (props: any) => {
  //use Hook
  const trans = useTrans();

  //varriable (if default)

  //props
  const {
    openModal,
    setOpenModal,
    listPartner,
    getOrderByPartnerId,
    getInvoicePartnerByOrderId,
    getDetailPartnerInvoice,
    clearData,
    getPaymentMethods,
    clearDataPayment,
    clearDataPartner,
    createPartnerPayment,
    createPaymentWithManyInvoice,
    errors,
    dataDetail,
    updatePartnerPayment,
    updated,
    isLoggedInUserId,
  } = props;
  const { dataListPartner } = props.partner;
  const {
    dataListOrderByPartner,
    dataCreatePaymentPartner,
    dataUpdatePaymentPartner,
    dataManyPartnerInvoice,
  } = props.partnerPayment;
  const { dataInvoicePartnerByOrder, dataDetailPartnerInvoice } =
    props.partnerInvoice;
  const { dataPaymentMethods } = props.paymentMethod;

  //useState
  const [formDataPayment, setFormDataPayment] =
    useState<any>(INIT_DATA_PAYMENT);

  const [formDataPaymentMulti, setFormDataPaymentMulti] = useState<any>(
    INIT_DATA_PAYMENT_MULTI
  );

  const [changePartner, setChangePartner] = useState<boolean>(false);
  const [changeOrder, setChangeOrder] = useState<boolean>(false);
  const [dataError, setDataError] = useState(INIT_ERROR);

  const [tab, setTab] = useState(0);
  const [total, setTotal] = useState(0);
  const [renderlistInvoice, setRenderListInvoice] = useState<string[]>([]);
  const [selectedPartnerID, setSelectedPartnerID] = useState<string[]>([]);

  const clearInput = () => {
    clearData("dataDetailPartnerInvoice");
    clearDataPayment("dataListOrderByPartner");
    clearDataPayment("dataDetailPaymentPartner");
    clearData("dataInvoicePartnerByOrder");
    clearDataPartner("dataListPartner");
    setFormDataPayment(INIT_DATA_PAYMENT);
    setFormDataPaymentMulti(INIT_DATA_PAYMENT_MULTI);
  };
  //list handle open/close modal
  const handleCloseModal = useCallback(() => {
    clearInput();
    setRenderListInvoice([]);
    setSelectedPartnerID([]);
    setFormDataPaymentMulti(INIT_DATA_PAYMENT_MULTI);
    setOpenModal((prevOpenModal: any) => !prevOpenModal);
  }, [setOpenModal]);

  const handleSubmitForm = async (e: any) => {
    if (!dataDetail) {
      const { ...payload }: any = formDataPayment;
      const formData = new FormData();
      Object.keys(payload).forEach((key: any) => {
        if (key == "attachment") {
          Object.values(payload[key]).forEach(function (file: any) {
            formData.append("attachment[]", file);
          });
        } else if (key == "notes") {
          formData.append("notes", tranformDescription(formDataPayment?.notes));
        } else {
          formData.append(key, payload[key]);
        }
      });
      await createPartnerPayment(formData);
    } else {
      await updatePartnerPayment(formDataPayment, dataDetail?.data?.id);
    }
  };

  const handleSubmitFormMulti = async () => {
    if (!dataDetail) {
      const { ...payload }: any = formDataPaymentMulti;
      const formData = new FormData();
      Object.keys(payload).forEach((key: any) => {
        if (key == "attachment") {
          Object.values(payload[key]).forEach(function (file: any) {
            formData.append("attachment[]", file);
          });
        } else if (key == "notes") {
          formData.append(
            "notes",
            tranformDescription(formDataPaymentMulti?.notes)
          );
        } else {
          formData.append(key, payload[key]);
        }
      });
      await createPaymentWithManyInvoice(formData);
    }
  };

  // list handle Change data
  const handleChangeSelect = useCallback(
    (key: any, value: any) => {
      if (
        key === "partnerId" &&
        Number(formDataPayment?.partnerId) !== Number(value)
      ) {
        setChangePartner(true);
        getOrderByPartnerId(value);
      }
      if (
        key === "orderId" &&
        Number(formDataPayment?.orderId) !== Number(value)
      ) {
        setChangeOrder(true);
        getInvoicePartnerByOrderId(value);
      }
      if (key === "invoicePartnerId") {
        getDetailPartnerInvoice(value);
      }
      setFormDataPayment((prevFormDataPayment: any) => {
        return { ...prevFormDataPayment, [key]: Number(value) ?? "" };
      });
    },
    [
      formDataPayment,
      setChangePartner,
      setChangeOrder,
      getOrderByPartnerId,
      getInvoicePartnerByOrderId,
      getDetailPartnerInvoice,
    ]
  );

  const handleChangeSelectMulti = useCallback(
    (key: any, value: any) => {
      if (
        key === "partnerId" &&
        Number(formDataPaymentMulti?.partnerId) !== Number(value)
      ) {
        setChangePartner(true);
        getOrderByPartnerId(value);
      }
      if (
        key === "orderId" &&
        Number(formDataPaymentMulti?.orderId) !== Number(value)
      ) {
        setChangeOrder(true);
        getInvoicePartnerByOrderId(value);
      }
      if (key === "invoicePartnerId") {
        getDetailPartnerInvoice(value);
      }
      setFormDataPaymentMulti((prevFormDataPayment: any) => {
        return { ...prevFormDataPayment, [key]: Number(value) ?? "" };
      });
    },
    [
      formDataPaymentMulti,
      setChangePartner,
      setChangeOrder,
      getOrderByPartnerId,
      getInvoicePartnerByOrderId,
      getDetailPartnerInvoice,
    ]
  );

  const handleChangeInputNumber = useCallback(
    (key: any, value: any) => {
      if (value === "") value = "";
      setFormDataPayment({ ...formDataPayment, [key]: value });
    },
    [formDataPayment, setFormDataPayment]
  );

  const handleChangeInput = useCallback(
    (key: any, value: any) => {
      setFormDataPayment({ ...formDataPayment, [key]: value ?? "" });
    },
    [formDataPayment, setFormDataPayment]
  );

  const handleChangeInputMulti = useCallback(
    (key: any, value: any) => {
      setSelectedPartnerID([]);
      setFormDataPaymentMulti({ ...formDataPaymentMulti, [key]: value ?? "" });
    },
    [formDataPaymentMulti, setFormDataPaymentMulti]
  );

  //useEfffect
  useEffect(() => {
    if (openModal) {
      setTab(0);
      listPartner();
      getPaymentMethods();
    }
  }, [openModal]);

  useEffect(() => {
    if (dataDetailPartnerInvoice) {
      setFormDataPayment({
        ...formDataPayment,
        amount: dataDetailPartnerInvoice?.data?.total_value,
        currencyId:
          +dataDetailPartnerInvoice?.data?.customerPartner?.partnerCustomer
            ?.currency?.id,
      });
    }
  }, [dataDetailPartnerInvoice]);

  useEffect(() => {
    if (changeOrder) {
      clearData("dataDetailPartnerInvoice");
      clearData("dataInvoicePartnerByOrder");
      setFormDataPayment({
        ...formDataPayment,
        amount: "",
        currencyId: "",
        invoicePartnerId: "",
      });
      setChangeOrder(false);
    }
  }, [changeOrder]);

  useEffect(() => {
    if (changePartner) {
      clearData("dataDetailPartnerInvoice");
      clearDataPayment("dataListOrderByPartner");
      clearData("dataInvoicePartnerByOrder");
      setFormDataPayment({
        ...formDataPayment,
        orderId: "",
        amount: "",
        currencyId: "",
        invoicePartnerId: "",
      });
      setChangePartner(false);
    }
  }, [changePartner]);

  useEffect(() => {
    setDataError({ ...INIT_ERROR, ...errors });
  }, [errors]);

  useEffect(() => {
    if (
      dataCreatePaymentPartner ||
      dataUpdatePaymentPartner ||
      dataManyPartnerInvoice
    ) {
      setOpenModal(false);
      setSelectedPartnerID([]);
      setTotal(0);
      clearDataPayment("dataCreatePaymentPartner");
      clearDataPayment("dataUpdatePaymentPartner");
      setFormDataPayment(INIT_DATA_PAYMENT);
      setFormDataPaymentMulti(INIT_DATA_PAYMENT_MULTI);
    }
  }, [
    dataCreatePaymentPartner,
    dataUpdatePaymentPartner,
    dataManyPartnerInvoice,
  ]);

  // Clear change Tab
  useEffect(() => {
    clearInput();
    setSelectedPartnerID([]);
  }, [tab]);

  useEffect(() => {
    if (dataDetail) {
      getOrderByPartnerId(dataDetail?.data?.partner?.id);
      getInvoicePartnerByOrderId(
        dataDetail?.data?.order?.id,
        dataDetail?.data?.invoicePartner?.id
      );
      setFormDataPayment({
        ...formDataPayment,
        amount: dataDetail?.data?.amount,
        currencyId: dataDetail?.data?.currency?.id,
        invoicePartnerId: dataDetail?.data?.invoicePartner?.id,
        notes: dataDetail?.data?.notes,
        orderId: dataDetail?.data?.order?.id,
        methodId: dataDetail?.data?.method?.id,
        partnerId: dataDetail?.data?.partner?.id,
        paymentDate: dataDetail?.data?.paymentDate,
        transaction: dataDetail?.data?.transactionId,
      });
    }
  }, [dataDetail]);

  // other (like const, varriable, ...)
  const PartnerOptions = dataListPartner?.data?.items?.map(
    (key: { id: any; name: any }) => ({
      id: key?.id,
      value: key?.id,
      label: key?.name,
    })
  );

  const handleChangeTab = useCallback((event: any, newValue: any) => {
    setTab(newValue);
    setRenderListInvoice([]);
    setSelectedPartnerID([]);
  }, []);

  
  //  Total Invoice
  const handleChangeMultiSelect = useCallback(
    (e: { target: { value: any } }) => {
      const value = e.target.value;
      setSelectedPartnerID(() =>
        typeof value === "string" ? value.split(",") : value
      );
      const item = value.join(", ");
      setFormDataPaymentMulti((prevFormDataPayment: any) => ({
        ...prevFormDataPayment,
        invoicePartnerIds: item,
      }));
    },
    []
  );

  useEffect(() => {
    if (dataInvoicePartnerByOrder?.data) {
      let listInvoice: any[] = [];
      dataInvoicePartnerByOrder.data.forEach(
        (e: { id(id: any): unknown; code: any }) => {
          listInvoice.push(e);
        }
      );

      setRenderListInvoice(listInvoice);
    }
  }, [dataInvoicePartnerByOrder]);

  // Total
  useEffect(() => {
    let totalValue = 0;
    dataInvoicePartnerByOrder?.data?.forEach((code: any) => {
      totalValue += selectedPartnerID.includes(code.id)
        ? Number(code.total_value)
        : 0;
    });
    setTotal(totalValue);
  }, [dataInvoicePartnerByOrder, selectedPartnerID]);

  const handleDeleteInvoice = useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  const handleDelete = (value: any) => () => {
    setSelectedPartnerID(selectedPartnerID.filter((item) => item !== value));
  };

  return (
    <Dialog
      open={openModal}
      onClose={handleCloseModal}
      className={styles["dialog"]}
      fullWidth
      disableEnforceFocus={true}
      disableAutoFocus={true}
    >
      <DialogTitle className={styles["dialog-title"]} id="scroll-dialog-title">
        <Typography variant="h6">{trans.payment.add_payment}</Typography>
        <Button onClick={handleCloseModal}>
          <Close />
        </Button>
      </DialogTitle>
      <Divider />

      <Tabs
        value={tab}
        onChange={handleChangeTab}
        centered
        aria-label="basic tabs example"
      >
        <Tab label={trans.partner.Create_Payments} />
        <Tab label={trans.partner.Create_A_Payment} />
      </Tabs>

      <DialogContent>
        {tab == 1 && (
          <Box sx={{ width: "100%" }}>
            <Box className={"mt-8"}>
              <SelectInput
                labelText={trans.partner.partner_name}
                keyword="partnerId"
                keyMenuItem="id"
                keyValue="name"
                options={PartnerOptions}
                value={formDataPayment?.partnerId}
                handleChange={handleChangeSelect}
                isCreateNew={false}
                errorText={getFirstValueInObject(dataError?.partnerId)}
              />
            </Box>

            <Box className="mt-8">
              <SelectDefault
                labelText={trans.menu.order}
                keyword="orderId"
                keyMenuItem="id"
                keyValue="name"
                value={formDataPayment?.orderId}
                data={dataListOrderByPartner?.data}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.orderId)}
              />
            </Box>

            <Box className="mt-8">
              <SelectDefault
                labelText={trans.partner.invoice_partner_id}
                keyword="invoicePartnerId"
                keyMenuItem="id"
                keyValue="code"
                value={formDataPayment?.invoicePartnerId}
                data={dataInvoicePartnerByOrder?.data}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.invoicePartnerId)}
                require={true}
              />
            </Box>

            <Box className="mt-8">
              <InputFormatNumber
                keyword="amount"
                placeholder={trans.payment.amount_}
                label={trans.payment.amount_}
                require={true}
                value={formDataPayment?.amount}
                currency={dataDetail?.data?.currency?.sign}
                handleChange={handleChangeInputNumber}
                errorText={getFirstValueInObject(dataError?.amount)}
                disabled={true}
              />
            </Box>

            <Box className="mt-8" sx={{ marginTop: "20px !important" }}>
              <InputBase
                labelText={trans.payment.transaction_id}
                keyword="transaction"
                type="text"
                placeholder={trans.payment.transaction_id}
                value={formDataPayment?.transaction}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.transaction)}
              />
            </Box>

            <Box className="mt-8">
              <Grid container spacing={2}>
                <Grid item xs={7}>
                  <DatePickerDefault
                    labelText={trans.payment.date}
                    require={true}
                    keyword="paymentDate"
                    value={formDataPayment?.paymentDate}
                    handleChange={handleChangeInput}
                    errorText={getFirstValueInObject(dataError?.paymentDate)}
                  />
                </Grid>
                <Grid item xs={5}>
                  <SelectDefault
                    require={true}
                    labelText={trans.payment.payment_method_}
                    keyword="methodId"
                    keyMenuItem="id"
                    keyValue="name"
                    value={formDataPayment?.methodId}
                    data={dataPaymentMethods}
                    handleChange={handleChangeSelect}
                    errorText={getFirstValueInObject(dataError?.methodId)}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box className="mt-8">
              {updated ? (
                <InputTiny
                  handleChange={handleChangeInput}
                  keyword="notes"
                  value={formDataPayment?.notes ?? ""}
                  setDataForm={setFormDataPayment}
                  dataForm={formDataPayment}
                  object={dataDetail?.data}
                  objectName={"payment_partner"}
                  isLoggedInUserId={isLoggedInUserId}
                  onEdit={true}
                />
              ) : (
                <InputTiny
                  handleChange={handleChangeInput}
                  keyword="notes"
                  value={formDataPayment?.notes ?? ""}
                  setDataForm={setFormDataPayment}
                  dataForm={formDataPayment}
                  canDrop={true}
                />
              )}
            </Box>
          </Box>
        )}

        {tab == 0 && (
          <>
            <Box className={"mt-8"}>
              <SelectInput
                labelText={trans.partner.partner_name}
                keyword="partnerId"
                keyMenuItem="id"
                keyValue="name"
                options={PartnerOptions}
                value={formDataPayment?.partnerId}
                handleChange={handleChangeSelect}
                isCreateNew={false}
                errorText={getFirstValueInObject(dataError?.partnerId)}
              />
            </Box>

            <Box className="mt-8">
              <SelectDefault
                labelText={trans.menu.order}
                keyword="orderId"
                keyMenuItem="id"
                keyValue="name"
                value={formDataPaymentMulti?.orderId}
                data={dataListOrderByPartner?.data}
                handleChange={handleChangeSelectMulti}
                errorText={getFirstValueInObject(dataError?.orderId)}
              />
            </Box>

            <FormControl sx={{ width: 535, marginTop: "10px" }}>
              <Typography>{"Invoice Partner ID"}</Typography>
              <Select
                multiple
                value={selectedPartnerID}
                onChange={handleChangeMultiSelect}
                renderValue={(selected) => (
                  <Stack gap={1} direction="row" flexWrap="wrap">
                    {selected.map((value) =>
                      dataInvoicePartnerByOrder?.data.map((item: any) => {
                        if (value == item.id) {
                          return (
                            <Chip
                              key={value}
                              label={item.code}
                              onDelete={handleDelete(value)}
                              deleteIcon={
                                <CancelIcon onMouseDown={handleDeleteInvoice} />
                              }
                            />
                          );
                        }
                      })
                    )}
                  </Stack>
                )}
              >
                {renderlistInvoice.length === 0 ? (
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                ) : (
                  renderlistInvoice.map((name: any) => (
                    <MenuItem key={name} value={name.id}>
                      {name.code}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <Box className="mt-8">
              <InputFormatNumber
                keyword="amount"
                placeholder={trans.payment.amount_}
                label={trans.payment.amount_}
                require={true}
                value={total}
                currency={dataDetail?.data?.currency?.sign}
                handleChange={handleChangeInputNumber}
                errorText={getFirstValueInObject(dataError?.amount)}
                disabled={true}
              />
            </Box>

            <Box className="mt-8" sx={{ marginTop: "20px !important" }}>
              <InputBase
                labelText={trans.payment.transaction_id}
                keyword="transaction"
                type="text"
                placeholder={trans.payment.transaction_id}
                value={formDataPaymentMulti?.transaction}
                handleChange={handleChangeInputMulti}
                errorText={getFirstValueInObject(dataError?.transaction)}
              />
            </Box>

            <Box className="mt-8">
              <Grid container spacing={2}>
                <Grid item xs={7}>
                  <DatePickerDefault
                    labelText={trans.payment.date}
                    require={true}
                    keyword="paymentDate"
                    value={formDataPaymentMulti?.paymentDate}
                    handleChange={handleChangeInputMulti}
                    errorText={getFirstValueInObject(dataError?.paymentDate)}
                  />
                </Grid>
                <Grid item xs={5}>
                  <SelectDefault
                    require={true}
                    labelText={trans.payment.payment_method_}
                    keyword="methodId"
                    keyMenuItem="id"
                    keyValue="name"
                    value={formDataPaymentMulti?.methodId}
                    data={dataPaymentMethods}
                    handleChange={handleChangeSelectMulti}
                    errorText={getFirstValueInObject(dataError?.methodId)}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box className="mt-8">
              {updated ? (
                <InputTiny
                  handleChange={handleChangeInputMulti}
                  keyword="notes"
                  value={formDataPaymentMulti?.notes ?? ""}
                  setDataForm={setFormDataPaymentMulti}
                  dataForm={formDataPaymentMulti}
                  object={dataDetail?.data}
                  objectName={"payment_partner"}
                  isLoggedInUserId={isLoggedInUserId}
                  onEdit={true}
                />
              ) : (
                <InputTiny
                  handleChange={handleChangeInputMulti}
                  keyword="notes"
                  value={formDataPaymentMulti?.notes ?? ""}
                  setDataForm={setFormDataPaymentMulti}
                  dataForm={formDataPaymentMulti}
                  canDrop={true}
                />
              )}
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions className={styles["dialog-actions"]}>
        <Button
          className="btn-save"
          onClick={tab == 0 ? handleSubmitFormMulti : handleSubmitForm}
        >
          {trans.task.save}
        </Button>
        <Button onClick={handleCloseModal} className="btn-cancel">
          {trans.task.cancle}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state: any) => ({
  partner: state.partner,
  partnerPayment: state?.partnerPayment,
  order: state.order,
  invoice: state.invoice,
  partnerInvoice: state?.partnerInvoice,
  paymentMethod: state.paymentMethod,
  errors: state.partnerPayment?.error?.response?.data?.properties ?? {},
});

const mapDispatchToProps = {
  listPartner,
  getOrderByPartnerId,
  getCanPaidInvoicesListByOrderId,
  getDetailInvoice,
  getInvoicePartnerByOrderId,
  getDetailPartnerInvoice,
  clearData,
  getPaymentMethods,
  clearDataPayment,
  clearDataPartner,
  createPartnerPayment,
  createPaymentWithManyInvoice,
  updatePartnerPayment,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormCreateOrUpdatePayment);
function setPartnerIds(filteredPartnerIds: any) {
  throw new Error("Function not implemented.");
}
