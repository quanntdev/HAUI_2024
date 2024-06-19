import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import styles from "./styles.module.scss";
import { connect } from "react-redux";
import { todayMoment } from "../../constants";
import useTrans from "../../utils/useTran";
import SelectDefault from "../Input/SelectDefault";
import InputFormatNumber from "../Input/InputFormatNumber";
import InputBase from "../Input/InputBase";
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

const FormCreatePaymentFormPartnerInvoice = (props: any) => {
  //use Hook
  const trans = useTrans();

  //varriable (if default)

  //props
  const {
    openModal,
    setOpenModal,
    listPartner,
    clearData,
    getPaymentMethods,
    clearDataPayment,
    clearDataPartner,
    createPartnerPayment,
    errors,
    dataDetail,
    updatePartnerPayment,
    updated,
    isLoggedInUserId,
    dataDetailInvoice,
  } = props;
  const { dataPaymentMethods } = props.paymentMethod;

  //useState
  const [formDataPayment, setFormDataPayment] =
    useState<any>(INIT_DATA_PAYMENT);
  const [dataError, setDataError] = useState(INIT_ERROR);

  //list handle open/close modal
  const handleCloseModal = useCallback(() => {
    clearDataPayment("dataListOrderByPartner");
    clearDataPayment("dataDetailPaymentPartner");
    clearData("dataInvoicePartnerByOrder");
    clearDataPartner("dataListPartner");
    setFormDataPayment(INIT_DATA_PAYMENT);
    setOpenModal((prevOpenModal: any) => !prevOpenModal);
  }, [setOpenModal]);

  const handleSubmitForm = useCallback(async (e: any) => {
    if (!dataDetail) {
      const { ...payload }: any = formDataPayment;
      const formData = new FormData();
      Object.keys(payload).forEach((key: any) => {
        if (key === "attachment") {
          Object.values(payload[key]).forEach(function (file: any) {
            formData.append("attachment[]", file);
          });
        } else if (key === "notes") {
          formData.append("notes", tranformDescription(formDataPayment?.notes));
        } else {
          formData.append(key, payload[key]);
        }
      });
      await createPartnerPayment(formData);
    } else {
      await updatePartnerPayment(formDataPayment, dataDetail?.data?.id);
    }
  }, [dataDetail, formDataPayment, createPartnerPayment, updatePartnerPayment]);
  

  // list handle Change data
  const handleChangeSelect = useCallback(
    (key: any, value: any) => {
      setFormDataPayment((prevFormDataPayment: any) => {
        return { ...prevFormDataPayment, [key]: Number(value) ?? "" };
      });
    },
    [formDataPayment]
  );

  const handleChangeInput = useCallback(
    (key: any, value: any) => {
      setFormDataPayment({ ...formDataPayment, [key]: value ?? "" });
    },
    [formDataPayment, setFormDataPayment]
  );

  //useEfffect
  useEffect(() => {
    if (openModal) {
      listPartner();
      getPaymentMethods();
    }
  }, [openModal]);

  useEffect(() => {
    setDataError({ ...INIT_ERROR, ...errors });
  }, [errors]);

  useEffect(() => {
    if (dataDetailInvoice) {
      setFormDataPayment({
        ...formDataPayment,
        amount: dataDetailInvoice?.commisson_amount,
        orderId: +dataDetailInvoice?.order?.id,
        invoicePartnerId: +dataDetailInvoice?.id,
        partnerId: +dataDetailInvoice?.customerPartner?.partners?.id,
        currencyId: +dataDetailInvoice?.customerPartner?.partnerCustomer?.currency?.id
      });
    }
  }, [dataDetailInvoice, openModal]);

  // other (like const, varriable, ...)

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
      <DialogContent>
        <Box sx={{ width: "100%" }}>
          <Box className={"mt-8"}>
            <InputBase
              labelText={trans.partner.partner_name}
              type="text"
              placeholder={trans.partner.partner_name}
              value={dataDetailInvoice?.partnerName}
              disabled={true}
            />
          </Box>
          <Box className="mt-8">
            <InputBase
              labelText={trans.menu.order}
              type="text"
              placeholder={trans.menu.order}
              value={dataDetailInvoice?.order?.name}
              disabled={true}
            />
          </Box>
          <Box className="mt-8">
            <InputBase
              labelText={trans.partner.invoice_partner_id}
              type="text"
              placeholder={trans.partner.invoice_partner_id}
              value={dataDetailInvoice?.code}
              disabled={true}
            />
          </Box>
          <Box className="mt-8">
            <InputFormatNumber
              placeholder={trans.payment.amount_}
              label={trans.payment.amount_}
              require={true}
              value={dataDetailInvoice?.commisson_amount}
              currency={dataDetailInvoice?.currency_sign}
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
      </DialogContent>
      <DialogActions className={styles["dialog-actions"]}>
        <Button className="btn-save" onClick={handleSubmitForm}>
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
  updatePartnerPayment,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormCreatePaymentFormPartnerInvoice);
