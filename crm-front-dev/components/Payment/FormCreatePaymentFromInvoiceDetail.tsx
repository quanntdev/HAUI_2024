import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import styles from "./styles.module.scss";
import { Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import InputBase from "../Input/InputBase";
import DatePickerDefault from "../Input/DatePickerDefault";
import { createPayment, clearData } from "../../redux/actions/payment";
import SelectDefault from "../Input/SelectDefault";
import { getFirstValueInObject } from "../../helpers";
import InputFormatNumber from "../Input/InputFormatNumber";
import { getPaymentMethods } from "../../redux/actions/paymentMethod";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import removeCommaCurrencyValue from "../../utility/removeCommaCurrencyValue";
import { getCountries } from "../../redux/actions/countries";
import {
  getInvoiceStatusList,
  getDetailInvoice,
} from "../../redux/actions/invoice";
import InputTiny from "../Input/InputTiny";
import { todayMoment } from "../../constants";
import useTrans from "../../utils/useTran";

const INIT_ERROR = {
  invoiceId: "",
  orderId: "",
  customerId: "",
  paymentDate: "",
  methodId: "",
  amount: "",
  notes: "",
  transactionId: "",
};

const FormCreatePaymentFromInvoiceDetail = (props: any) => {
  const trans = useTrans();
  const {
    clearData,
    errors,
    openModal,
    setOpenModal,
    dataDetailInvoice,
    getPaymentMethods,
    getCountries,
    getInvoiceStatusList,
    getDetailInvoice,
    createPayment,
  } = props;
  const { dataCreatePayment } = props.payment;
  const { dataPaymentMethods } = props.paymentMethod;
  const currency = dataDetailInvoice?.currency_sign;
  const balanceDue = dataDetailInvoice?.balanceDue;
  const invoiceCode = dataDetailInvoice?.code;
  const orderName = dataDetailInvoice?.order?.name;
  const customerName = dataDetailInvoice?.customer_name;

  const INIT_DATA = {
    invoiceId: +dataDetailInvoice?.id,
    orderId: +dataDetailInvoice?.order?.id,
    customerId: +dataDetailInvoice?.order?.customer?.id,
    paymentDate: todayMoment.format("YYYY-MM-DD"),
    methodId: null,
    amount: +dataDetailInvoice?.balanceDue,
    notes: "",
    transactionId: null,
    attachment: "",
  };

  const [dataForm, setDataForm] = useState<any>(INIT_DATA);
  const [dataError, setDataError] = useState(INIT_ERROR);
  const [infoImage, setInfoImage] = useState<any>({
    name: "",
    url: ""
  });

  useEffect(() => {
    setDataForm({
      ...INIT_DATA,
    });
  }, [dataDetailInvoice]);

  useEffect(() => {
    if (openModal) {
      getPaymentMethods();
    }
  }, [openModal]);

  const handleChangeInput = (key: any, value: any) => {
    key === "amount"
      ? setDataForm({
          ...dataForm,
          [key]: removeCommaCurrencyValue(value) ?? "",
        })
      : setDataForm({ ...dataForm, [key]: value ?? "" });
  };

  const changeImage = (e: any) => {
    setDataForm({ ...dataForm, attachment: e.target.files[0] })
    const creatUrlObject = URL.createObjectURL(e.target.files[0])
    setInfoImage({
      name: e.target.files[0].name,
      url: creatUrlObject
    });
  }

  const handleChangeSelect = (key: any, value: any) => {
    setDataForm({ ...dataForm, [key]: Number(value) ?? "" });
  };

  useEffect(() => {
    setDataError({ ...INIT_ERROR, ...errors });
  }, [errors]);

  const handleCloseEditModal = () => {
    setDataError(INIT_ERROR);
    setDataForm(INIT_DATA);
    setOpenModal(false);
  };

  const handleSubmitForm = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    createPayment(dataForm);
    setDataForm(INIT_DATA);
    if(!errors) {
      setOpenModal(false)
    }
  };

  useEffect(() => {
    if (dataCreatePayment) {
      clearData("dataDetailInvoice")
      handleCloseEditModal();
      setDataForm({...INIT_DATA});
      clearData("dataCreatePayment");
    }
  }, [dataCreatePayment]);

  useEffect(() => {
    if (dataCreatePayment) {
      getCountries();
      getInvoiceStatusList();
      getDetailInvoice(+dataDetailInvoice?.id);
    }
  }, [dataCreatePayment]);

  return (
    <>
      <Dialog
        open={openModal}
        onClose={handleCloseEditModal}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle
          className={styles["dialog-title"]}
          id="scroll-dialog-title"
        >
          <Typography variant="h6">{trans.invoice.add_payment}</Typography>
          <Button onClick={handleCloseEditModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <InputBase
                labelText={trans.menu.customer}
                keyword="customerName"
                disabled={true}
                type="text"
                value={customerName}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.customerId)}
              />
            </Grid>
            <Grid item md={12}>
              <InputBase
                labelText={trans.menu.order}
                keyword="orderName"
                disabled={true}
                type="text"
                value={orderName}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.orderId)}
              />
            </Grid>
            <Grid item md={12}>
              <InputBase
                labelText={trans.invoice.invoiceID}
                keyword="invoiceID"
                disabled={true}
                value={invoiceCode}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.invoiceId)}
              />
              {balanceDue != "" && (
                <Box className={`mt-8 ${styles["value-balance"]}`}>
                  <Typography
                    className={`${styles["balance-text"]} require-before`}
                  >
                    {trans.customer_detail.balance_due} : {formatCurrencyValue(balanceDue) + currency}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item mt={1} md={12}>
              <Box className={`"mt-8" ${styles["invoice-input"]}`}>
                <Box>
                  <Typography className="require">{trans.payment.amount_}</Typography>
                  <InputFormatNumber
                    require={true}
                    keyword="amount"
                    placeholder={trans.payment.amount_}
                    value={dataForm?.amount}
                    handleChange={handleChangeInput}
                  />
                </Box>
                <Box className={styles["amount-sign"]}>{currency}</Box>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item mt={2} md={12}>
              <InputBase
                labelText={trans.payment.transaction_id}
                keyword="transactionId"
                placeholder={trans.payment.transaction_id}
                value={dataForm?.transactionId ?? ""}
                handleChange={handleChangeInput}
              />
              <span
                className="text-cursor text-link ml-8"
              >
                <label htmlFor="input-file1" className="text-cursor text-decoration mt-8 mr-8">{trans.home.attach_file}</label>
                <input
                  type="file"
                  id="input-file1"
                  onChange={changeImage}
                  className={styles["input-file"]}
                />
                {!!infoImage?.url && <a href={infoImage?.url} target="_blank" rel="noreferrer">{infoImage?.name}</a>}
              </span>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <DatePickerDefault
                labelText={trans.customer_detail.date}
                require={true}
                keyword="paymentDate"
                value={dataForm?.paymentDate}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.paymentDate)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <SelectDefault
                require={true}
                labelText={trans.customer_detail.method}
                keyword="methodId"
                keyMenuItem="id"
                keyValue="name"
                value={dataForm?.methodId}
                data={dataPaymentMethods}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.methodId)}
              />
            </Grid>
          </Grid>
          <Grid item md={12} mt={2}>
            <InputTiny
              handleChange={handleChangeInput}
              keyword="notes"
              value={dataForm?.notes ?? ""}
            />
          </Grid>
          <DialogActions className={styles["dialog-actions"]}>
            <Button onClick={handleSubmitForm} className="btn-save">
              {trans.task.save}
            </Button>
            <Button onClick={handleCloseEditModal} className="btn-cancel">
              {trans.task.cancle}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  errors: state.deal?.error?.response?.data?.properties ?? {},
  order: state?.order,
  paymentMethod: state.paymentMethod,
  payment: state.payment,
  country: state?.country,
  invoice: state?.invoice,
});

const mapDispatchToProps = {
  clearData,
  getPaymentMethods,
  createPayment,
  getCountries,
  getInvoiceStatusList,
  getDetailInvoice,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormCreatePaymentFromInvoiceDetail);
