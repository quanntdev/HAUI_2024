import { Button, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import DatePickerDefault from "../Input/DatePickerDefault";
import InputBase from "../Input/InputBase";
import InputFormatNumber from "../Input/InputFormatNumber";
import SelectDefault from "../Input/SelectDefault";
import { getFirstValueInObject } from "../../helpers";
import SelectInput from "../Input/SelectInput/SelectInput";
import InputTiny from "../Input/InputTiny";

import styles from "./styles.module.scss";
import { URL_API_IMAGE_ATTACHMENT } from "../../constants";
import useTrans from "../../utils/useTran";

const TabCreateOrUpdatePayment = (props: any) => {
  const trans = useTrans();
  const {
    tab,
    formDataPayment,
    setQueryCode,
    queryCode,
    getInvoiceByCode,
    orderName,
    customerName,
    balanceDue,
    curency,
    handleChangeInput,
    handleChangeSelect,
    dataPaymentMethods,
    dataCanPaidInvoiceList,
    dataListOrderHasInvoice,
    dataCustomerList,
    dataError,
    dataError2,
    infoImage,
    dataCurrencyList,
    currencyId,
    setFormDataPayment,
    updated,
    dataPayment,
    isLoggedInUserId
  } = props;

  const handleInputCode = (e: any) => {
    setQueryCode(e);
  };

  const handleClickAddInvoice = () => {
    if (tab) {
      getInvoiceByCode(queryCode);
    }
  };

  const CustomerOptions = dataCustomerList?.items?.map(
    (key: { id: any; name: any }) => ({
      id: key?.id,
      value: key?.id,
      label: key?.name,
    })
  );

  const getLinkImagePayments = () => {
    return URL_API_IMAGE_ATTACHMENT + formDataPayment?.attachment;
  }

  return (
    <>
      {!!+tab ? (
        <>
          <Box className={`"mt-8" ${styles["invoice-input"]}`}>
            <InputBase
              labelText={trans.invoice.invoiceID}
              placeholder={trans.invoice.invoiceID}
              require={true}
              value={queryCode}
              handleChange={handleInputCode}
              errorText={getFirstValueInObject(dataError2?.invoiceId)}
            />
            <Box
              className={styles["invoice-add"]}
              onClick={handleClickAddInvoice}
            >
              <Button>{trans.invoice.add_invoice}</Button>
            </Box>
          </Box>
          <Box className="mt-8">
            <InputBase
              labelText={trans.menu.customer}
              disabled={true}
              value={customerName ?? ""}
            />
          </Box>
          <Box className="mt-8">
            <InputBase
              labelText={trans.menu.order}
              disabled={true}
              value={orderName ?? ""}
            />
          </Box>
          {balanceDue != ""&& (
            <Box className={`mt-8 ${styles["value-balance"]}`}>
              <Typography
                className={`${styles["balance-text"]} require-before`}
              >
                {trans.customer_detail.balance_due} : {formatCurrencyValue(balanceDue) + curency}
              </Typography>
            </Box>
          )}
          <Box className={`"mt-8" ${styles["invoice-input"]}`}>
            <Box>
              <Typography className="require">{trans.payment.amount_}</Typography>
              <InputFormatNumber
                require={true}
                keyword="amount"
                placeholder={trans.payment.amount_}
                value={formDataPayment?.amount}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError2?.amount)}
              />
            </Box>
            <Box className={styles["amount-sign"]}>{curency}</Box>
          </Box>
          <Box className="mt-8">
            <InputBase
              labelText={trans.payment.transaction_id}
              keyword="transactionId"
              placeholder={trans.payment.transaction_id}
              value={formDataPayment?.transactionId ?? ""}
              handleChange={handleChangeInput}
              errorText={getFirstValueInObject(dataError2?.transactionId)}
            />
            <span className="text-cursor text-link ml-8">
              {/* <label
                htmlFor="input-file"
                className="text-cursor text-decoration mt-8 mr-8"
              >
                Attach file
              </label>
              <input
                type="file"
                id="input-file"
                onChange={handleChangeImage}
                className={styles["input-file"]}
              /> */}
              {!!infoImage?.url && (
                <a href={infoImage?.url} target="_blank" rel="noreferrer">
                  {infoImage?.name}
                </a>
              )}
              {!infoImage?.url && !!formDataPayment?.attachment && (
                <a
                  href={getLinkImagePayments()}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cursor text-link ml-8 mt-8"
                >
                  {formDataPayment?.attachment}
                </a>
              )}
            </span>
          </Box>
          <Box className="mt-8">
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <DatePickerDefault
                  labelText={trans.payment.date}
                  require={true}
                  keyword="paymentDate"
                  value={formDataPayment?.paymentDate}
                  handleChange={handleChangeInput}
                  errorText={getFirstValueInObject(dataError2?.paymentDate)}
                />
              </Grid>
              <Grid item xs={7}>
                <SelectDefault
                  require={true}
                  labelText={trans.payment.payment_method_}
                  keyword="methodId"
                  keyMenuItem="id"
                  keyValue="name"
                  value={formDataPayment?.methodId}
                  data={dataPaymentMethods}
                  handleChange={handleChangeSelect}
                  errorText={getFirstValueInObject(dataError2?.methodId)}
                />
              </Grid>
            </Grid>
          </Box>
          <Box className="mt-8">
             <InputTiny
              handleChange={handleChangeInput}
              keyword="notes"
              value={formDataPayment?.notes ?? ""}
              setDataForm={setFormDataPayment}
              dataForm={formDataPayment}
              canDrop={true}
            />
          </Box>
        </>
      ) : (
        <>
          <Box className={`"mt-8" ${styles["invoice-input"]}`}>
            <SelectInput
              //labelText="Customer"
              labelText={trans.menu.customer}
              keyword="customerId"
              keyMenuItem="id"
              keyValue="name"
              options={CustomerOptions}
              value={formDataPayment?.customerId}
              handleChange={handleChangeSelect}
              isCreateNew={false}
              errorText={getFirstValueInObject(dataError?.customerId)}
              require={true}
            />
          </Box>
          <Box className="mt-8">
            <SelectDefault
              //labelText="Order"
              labelText={trans.menu.order}
              keyword="orderId"
              keyMenuItem="id"
              keyValue="name"
              value={formDataPayment?.orderId}
              data={dataListOrderHasInvoice?.items}
              handleChange={handleChangeSelect}
              errorText={getFirstValueInObject(dataError?.orderId)}
            />
          </Box>
          <Box className="mt-8">
            <SelectDefault
              //labelText="Invoice ID ( not Completed )"
              labelText={trans.customer_detail.invoice_id}
              keyword="invoiceId"
              keyMenuItem="id"
              keyValue="code"
              value={formDataPayment?.invoiceId}
              data={dataCanPaidInvoiceList?.items}
              handleChange={handleChangeSelect}
              errorText={getFirstValueInObject(dataError?.invoiceId)}
            />
          </Box>
          {balanceDue != "" && (
            <Box className={`mt-8 ${styles["value-balance"]}`}>
              <Typography
                className={`${styles["balance-text"]} require-before`}
              >
                Balance Due : {formatCurrencyValue(balanceDue) + curency}
              </Typography>
            </Box>
          )}
          <Box className={`"mt-8" ${styles["invoice-input"]}`}>
            <Box>
              <Typography className="require">{trans.payment.amount_}</Typography>
              <InputFormatNumber
                keyword="amount"
                placeholder={trans.payment.amount_}
                value={formDataPayment?.amount}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.amount)}
              />
            </Box>
            <Box className={styles["amount-sign"]}>{curency}</Box>
            <SelectDefault
              labelText={trans.customer_detail.currency}
              keyword="currencyId"
              keyMenuItem="id"
              keyValue="name"
              disabled={tab === "0" || !!currencyId}
              data={dataCurrencyList}
              value={formDataPayment?.currencyId}
              handleChange={handleChangeSelect}
              errorText={getFirstValueInObject(dataError?.currencyId)}
            />
          </Box>
          <Box className="mt-8">
            <InputBase
              labelText={trans.payment.transaction_id}
              keyword="transactionId"
              placeholder={trans.payment.transaction_id}
              value={formDataPayment?.transactionId ?? ""}
              handleChange={handleChangeInput}
              errorText={getFirstValueInObject(dataError?.transactionId)}
            />
            <span className="text-cursor text-link ml-8">
              {/* <label
                htmlFor="input-file"
                className="text-cursor text-decoration mt-8 mr-8"
              >
                Attach file
              </label>
              <input
                type="file"
                id="input-file"
                onChange={handleChangeImage}
                className={styles["input-file"]}
              /> */}
              {!!infoImage?.url && (
                <a href={infoImage?.url} target="_blank" rel="noreferrer">
                  {infoImage?.name}
                </a>
              )}
            </span>
          </Box>
          <Box className="mt-8">
            <Grid container spacing={2}>
              <Grid item xs={7}>
                <DatePickerDefault
                  labelText ={trans.payment.date}
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
                  labelText ={trans.payment.payment_method_}
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
              object={dataPayment}
              objectName={"payments"}
              isLoggedInUserId={isLoggedInUserId}
              onEdit={true}
            />
            ): (
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
        </>
      )}
    </>
  );
};

export default TabCreateOrUpdatePayment;
