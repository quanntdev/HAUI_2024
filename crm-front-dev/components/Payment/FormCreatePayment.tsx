import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { connect } from "react-redux";

import {
  searchCustomer,
  getListOrderHasInvoiceByCustomerId,
  getDetailCustomer,
  findInvoiceByCustomerId
} from "../../redux/actions/customer";
import {
  getDetailInvoice,
  getInvoiceByCode,
  searchInvoices
} from "../../redux/actions/invoice";
import { getPaymentMethods } from "../../redux/actions/paymentMethod";
import { createPayment, clearData } from "../../redux/actions/payment";
import removeCommaCurrencyValue from "../../utility/removeCommaCurrencyValue";
import { getCanPaidInvoicesListByOrderId,searchOrder, getDetailOrder } from "../../redux/actions/order";
import TabCreateOrUpdatePayment from "./TabCreateOrUpdatePayment";
import { todayMoment } from "../../constants";
import { getCurrencyList } from "../../redux/actions/currency";
import useTrans from "../../utils/useTran";
import tranformDescription from "../../utility/tranformDescription";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function setTabId(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const INIT_DATA_PAYMENT = {
  notes: "",
  amount: "",
  orderId: "",
  methodId: "",
  invoiceId: "",
  customerId: "",
  paymentDate: todayMoment.format("YYYY-MM-DD"),
  transactionId: "",
  attachment: "",
  currencyId: "",
};

const INIT_ERROR = {
  notes: "",
  amount: "",
  orderId: "",
  methodId: "",
  invoiceId: "",
  customerId: "",
  paymentDate: "",
  transactionId: "",
  attachment: "",
  currencyId: ""
};

const FormCreatePayment = (props: any) => {
  const trans = useTrans();
  const {
    openModal,
    clearData,
    setOpenModal,
    createPayment,
    searchCustomer,
    getInvoiceByCode,
    getPaymentMethods,
    getListOrderHasInvoiceByCustomerId,
    getCanPaidInvoicesListByOrderId,
    errors,
    searchOrder,
    searchInvoices,
    getDetailInvoice,
    getDetailOrder,
    getDetailCustomer,
    getCurrencyList
  } = props;

  const { dataCreatePayment } = props.payment;
  const { dataPaymentMethods } = props.paymentMethod;
  const { dataCanPaidInvoiceList, dataOrderList, dataOrderDetail } = props.order;
  const { dataCustomerList, dataListOrderHasInvoice, dataDetailCustomer } = props.customer;
  const { dataInvoiceByCode, dataInvoiceList, dataDetailInvoice} = props.invoice;
  const { dataCurrencyList } = props.currency;
  const [tab, setTab] = useState<any>(0);
  const [curency, setCurrency] = useState<any>("");
  const [balanceDue, setBalanceDue] = useState<any>("");
  const [orderName, setOrderName] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [dataError, setDataError] = useState<any>(INIT_ERROR);
  const [dataError2, setDataError2] = useState<any>(INIT_ERROR);
  const [changeCustomer, setChangeCustomer] = useState<boolean>(false)
  const [changeOrder, setrChangeOrder] = useState<boolean>(false)
  const [formDataPayment, setFormDataPayment] =
    useState<any>(INIT_DATA_PAYMENT);
  const [queryCode, setQueryCode] = useState<string>("");
  const [infoImage, setInfoImage] = useState<any>({
    name: "",
    url: "",
  });

  useEffect(() => {
    setFormDataPayment({
      ...INIT_DATA_PAYMENT,
    });
  }, []);

  useEffect(() => {
    if(!dataOrderList) {
      searchOrder();
    }

    if(!dataInvoiceList) {
      searchInvoices(`notInStatus=5`)
    }
  }, [dataOrderList, dataInvoiceList])

  useEffect(() => {
    if (errors && tab == 0) {
      setDataError({
        ...dataError,
        ...errors,
      });
    }
    if (errors && tab == 1) {
      setDataError2({
        ...dataError,
        ...errors,
      });
    }
  }, [errors]);

  useEffect(() => {
    if (tab) {
      setDataError(INIT_ERROR);
      setDataError2(INIT_ERROR);
    }
  }, [tab]);

  useEffect(() => {
    if (openModal) {
      searchCustomer(`limit=0&offset=0`);
      getPaymentMethods();
    }
    {
      setFormDataPayment({
        ...INIT_DATA_PAYMENT,
      });
    }
  }, [openModal]);

  useEffect(() => {
    if (dataCreatePayment) {
      clearData("dataCreatePayment");
      clearData("dataListOrderHasInvoice")
      clearData("dataInvoiceList")
      setOpenModal(!openModal);
    }
  }, [dataCreatePayment]);


  useEffect(() => {
    if (dataInvoiceByCode) {
      setFormDataPayment({
        ...formDataPayment,
        amount: Number(dataInvoiceByCode?.data?.balanceDue) ?? "",
        invoiceId: Number(dataInvoiceByCode?.data?.id) ?? "",
        customerId: Number(dataInvoiceByCode?.data?.order?.customer?.id) ?? "",
        currencyId:Number(dataInvoiceByCode?.data?.order?.customer?.currency?.id) ?? "",
      });
      setBalanceDue(dataInvoiceByCode?.data?.balanceDue);
      setCurrency(dataInvoiceByCode?.data?.currency_sign);
      setOrderName(dataInvoiceByCode?.data?.order?.name);
      setCustomerName(dataInvoiceByCode?.data?.order?.customer?.name);
    }
  }, [dataInvoiceByCode]);

  const handleChangeTab = (event: any, newValue: any) => {
    setTab(newValue);
    setFormDataPayment(INIT_DATA_PAYMENT);
    setInfoImage({ ...infoImage, url: "", name: "" });
  };

  const handleCloseModal = () => {
    setOpenModal(!openModal);
    setDataError(INIT_ERROR);
    setDataError2(INIT_ERROR);
    setInfoImage({
      name: "",
      url: "",
    });
    clearData("dataListOrderHasInvoice")
    clearData("dataOrderList")
    clearData("dataCanPaidInvoiceList")
    setrChangeOrder(false)
    setChangeCustomer(false)
    setBalanceDue("");
    setCurrency("")
  };


  const handleChangeSelect = (key: any, value: any) => {
    if (key === "customerId" && Number(formDataPayment?.customerId) !== Number(value)) {
      getListOrderHasInvoiceByCustomerId(value)
      searchInvoices(`customerId=${value}&notInStatus=5`)
      setChangeCustomer(true);
      getCurrencyList()
      getDetailCustomer(value);
    };
    if (key === "orderId" && Number(formDataPayment?.orderId) !== Number(value)){
      getCanPaidInvoicesListByOrderId(value)
      setrChangeOrder(true)
      getDetailOrder(value)
    };
    if (key === "invoiceId") {
      getDetailInvoice(value);
    }
    setFormDataPayment({
      ...formDataPayment,
      [key]: Number(value) ?? "",
    });
  };


  useEffect(() => {
    if(dataDetailInvoice && openModal) {
      setFormDataPayment({
        ...formDataPayment,
        customerId:Number(dataDetailInvoice?.order?.customer?.id),
        orderId: Number(dataDetailInvoice?.order?.id),
        amount: Number(dataDetailInvoice?.balanceDue),
        currencyId: Number(dataDetailInvoice?.order?.customer?.currency?.id)
      })

      setBalanceDue(dataDetailInvoice?.balanceDue);
      setCurrency(dataDetailInvoice?.currency_sign)
    }
  }, [dataDetailInvoice])

  useEffect(() => {
    if(changeOrder && dataOrderDetail) {
      setFormDataPayment({
        ...formDataPayment,
        customerId: Number(dataOrderDetail?.customer?.id),
        invoiceId: "",
        currencyId: dataOrderDetail?.customer?.currency?.id ? Number(dataOrderDetail?.customer?.currency?.id) : "",
      })

      setCurrency(dataOrderDetail?.customer?.currency?.sign)
    }
  }, [changeOrder, dataOrderDetail])

  useEffect(() => {
    if(changeCustomer) {
      setFormDataPayment({
        ...formDataPayment,
        orderId: "",
        invoiceId: "",
        amount: "",
      })

      setBalanceDue("");
      setCurrency("")
    }

    if(dataDetailCustomer) {
      setFormDataPayment({
        ...formDataPayment,
        currencyId:dataDetailCustomer?.currency?.id ? Number(dataDetailCustomer?.currency?.id) : "",
      })
    }

    if(dataDetailCustomer) setCurrency(dataDetailCustomer?.currency?.sign);

  }, [changeCustomer, dataDetailCustomer])

  const handleChangeInput = (key: any, value: any) => {
    key === "amount"
      ? setFormDataPayment({
          ...formDataPayment,
          [key]: removeCommaCurrencyValue(value) ?? "",
        })
      : setFormDataPayment({ ...formDataPayment, [key]: value ?? "" });
  };

  const handleCreatePayment = (e: { preventDefault: () => void }) => {
    if (
      formDataPayment?.customerId === "" &&
      formDataPayment?.orderId === "" &&
      tab == 0
    ) {
      setDataError({
        ...INIT_ERROR,
        ...errors,
      });
      setDataError2({
        ...INIT_ERROR,
        ...errors,
      });
    }
    e.preventDefault();
    const {...payload}:any = formDataPayment;
      const formData = new FormData();
       Object.keys(payload).forEach((key:any) => {
        if (key == 'attachment') {
            Object.values(payload[key]).forEach(function (file: any) {
            formData.append('attachment[]', file);
          })
        } 
        else if(key == "notes") {
          formData.append('notes', (tranformDescription(formDataPayment?.notes)));
        }
         else {
          formData.append(key, payload[key]);
        }
      });
      createPayment(formData);
    !!tab ? clearData("dataInvoiceByCode") : clearData("dataDetailInvoice");
    clearData("dataCanPaidInvoiceList");
    clearData("formDataPayment");
    setBalanceDue("");
    setCurrency("");
  };

  const handleChangeImage = (e: any) => {
    setFormDataPayment({ ...formDataPayment, attachment: e.target.files[0] });
    const creatUrlObject = URL.createObjectURL(e.target.files[0]);
    setInfoImage({
      name: e.target.files[0].name,
      url: creatUrlObject,
    });
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
      <DialogContent>
        <Box sx={{ width: "100%" }}>
          <Box>
            <Tabs
              value={tab}
              onChange={handleChangeTab}
              centered
              aria-label="basic tabs example"
            >
              <Tab label={trans.payment.add_by_customer} {...setTabId(0)} />
              <Tab label={trans.payment.add_by_invoice_ID} {...setTabId(1)} />
            </Tabs>
          </Box>
          <TabPanel value={tab} index={0}>
            <TabCreateOrUpdatePayment
              tab={tab}
              formDataPayment={formDataPayment}
              setQueryCode={setQueryCode}
              queryCode={queryCode}
              getInvoiceByCode={getInvoiceByCode}
              dataInvoiceByCode={dataInvoiceByCode}
              balanceDue={balanceDue}
              curency={curency}
              handleChangeInput={handleChangeInput}
              handleChangeSelect={handleChangeSelect}
              dataPaymentMethods={dataPaymentMethods}
              dataCanPaidInvoiceList={dataCanPaidInvoiceList ?? dataInvoiceList?.data}
              dataListOrderHasInvoice={dataListOrderHasInvoice ?? dataOrderList?.data}
              dataCurrencyList={dataCurrencyList}
              dataCustomerList={dataCustomerList}
              dataError={dataError}
              handleChangeImage={handleChangeImage}
              infoImage={infoImage}
              currencyId={dataDetailCustomer?.currency?.id ? Number(dataDetailCustomer?.currency?.id) : ""}
              setFormDataPayment={setFormDataPayment}
            />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <TabCreateOrUpdatePayment
              tab={tab}
              formDataPayment={formDataPayment}
              setQueryCode={setQueryCode}
              queryCode={queryCode}
              getInvoiceByCode={getInvoiceByCode}
              orderName={orderName}
              customerName={customerName}
              balanceDue={balanceDue}
              curency={curency}
              handleChangeInput={handleChangeInput}
              handleChangeSelect={handleChangeSelect}
              dataPaymentMethods={dataPaymentMethods}
              handleChangeImage={handleChangeImage}
              infoImage={infoImage}
              dataError2={dataError2}
              setFormDataPayment={setFormDataPayment}
            />
          </TabPanel>
        </Box>
      </DialogContent>
      <DialogActions className={styles["dialog-actions"]}>
        <Button className="btn-save" onClick={handleCreatePayment}>
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
  customer: state.customer,
  invoice: state.invoice,
  order: state.order,
  paymentMethod: state.paymentMethod,
  payment: state.payment,
  errors: state.payment?.error?.response?.data?.properties ?? {},
  currency: state.currency,
});

const mapDispatchToProps = {
  searchCustomer,
  getListOrderHasInvoiceByCustomerId,
  getCanPaidInvoicesListByOrderId,
  getDetailInvoice,
  getPaymentMethods,
  createPayment,
  getInvoiceByCode,
  clearData,
  searchOrder,
  searchInvoices,
  findInvoiceByCustomerId,
  getDetailOrder,
  getCurrencyList,
  getDetailCustomer
};

export default connect(mapStateToProps, mapDispatchToProps)(FormCreatePayment);
