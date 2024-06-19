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
import { Close } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import InputBase from "../Input/InputBase";
import DatePickerDefault from "../Input/DatePickerDefault";
import { getListBilling } from "../../redux/actions/billing";
import { createOrder, clearData } from "../../redux/actions/order";
import SelectDefault from "../Input/SelectDefault";
import { getFirstValueInObject } from "../../helpers";
import { partnerSaleOption, todayMoment, tomorrowMoment } from "../../constants";
import useTrans from "../../utils/useTran";
import InputFormatNumber from "../Input/InputFormatNumber";

type DataFormType = {
  name: string;
  orderManager: string;
  startDate: string | null;
  dueDate: string | null;
  billingTypeId: number | null;
  partnerSalePercent: string | number | null;
};

const INIT_ERROR = {
  name: "",
  orderManager: "",
  startDate: "",
  dueDate: "",
  partnerSalePercent: "",
};

const FormCreateOrderFromDealDetail = (props: any) => {
  const trans = useTrans();
  const {
    clearData,
    errors,
    openEditModal,
    setOpenEditModal,
    dataDealDetail,
    getListBilling,
    createOrder,
  } = props;
  const { dataBillingList } = props.billing;
  const { dataCreateOrder } = props.order;

  const INIT_DATA = {
    name: dataDealDetail?.name ?? "",
    orderManager: "",
    startDate: todayMoment.format("YYYY-MM-DD"),
    dueDate: tomorrowMoment.format("YYYY-MM-DD"),
    billingTypeId: null,
    dealId: Number(dataDealDetail?.id) ?? null,
    partnerSalePercent: dataDealDetail?.customer?.partners[0] ? Number(dataDealDetail?.customer?.partners[0]?.salePercent) : null,
  };

  const [dataForm, setDataForm] = useState<DataFormType>(INIT_DATA);
  const [dataError, setDataError] = useState(INIT_ERROR);
  const router = useRouter();

  useEffect(() => {
    setDataForm({
      ...INIT_DATA,
    });
  }, [dataDealDetail]);

  useEffect(() => {
    getListBilling();
  }, []);

  const handleChangeInput = useCallback((key: any, value: any) => {
    setDataForm((prevDataForm: any) => ({ ...prevDataForm, [key]: value ?? "" }));
  }, [setDataForm]);


  const handleChangeSelect = (key: any, value: any) => {
    setDataForm({ ...dataForm, [key]: Number(value) ?? "" });
  };

  useEffect(() => {
    setDataError({ ...INIT_ERROR, ...errors });
  }, [errors]);

  const handleCloseEditModal = () => {
    setDataError(INIT_ERROR);
    setOpenEditModal(false);
  };

  const handleSubmitForm = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    createOrder(dataForm);
  };

  useEffect(() => {
    if (dataCreateOrder) {
      router.push(`/order/${dataCreateOrder?.data?.id}`);
    }
    clearData("dataCreateOrder");
  }, [dataCreateOrder]);

  return (
    <>
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        className="dialog-form"
      >
        <DialogTitle
          className="dialog-title"
          id="scroll-dialog-title"
          variant="h6"
        >
          {trans.order.add_order}
          <Button onClick={handleCloseEditModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <InputBase
                labelText={trans.order.order_name}
                keyword="name"
                type="text"
                placeholder={trans.order.order_name}
                require={true}
                value={dataForm?.name}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.name)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item mt={1} md={12}>
              <SelectDefault
                labelText={trans.order.billing_type}
                keyword="billingTypeId"
                keyMenuItem="id"
                keyValue="name"
                data={dataBillingList ?? []}
                require={true}
                handleChange={handleChangeSelect}
                value={dataForm?.billingTypeId}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item mt={1} md={12}>
              <InputBase
                labelText={trans.deal.order_manager}
                keyword="orderManager"
                type="text"
                placeholder="Order Manager"
                value={dataForm?.orderManager}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.orderManager)}
              />
            </Grid>
          </Grid>
          {(Number(dataDealDetail?.customer?.partners[0]?.saleType) === partnerSaleOption.TOTAL_PAYMENT_REVENUE)&& (
             <>
             <Box className="box-title">
             <Typography>{trans.menu.partner}</Typography>
           </Box>
           <Grid container spacing={2}>
           <Grid item md={12} mt={1} sx={{ zIndex: 10 }}>
               <InputBase
                 labelText={trans.partner.partner_name}
                 value={dataDealDetail?.customer?.partners[0]?.partners?.name}
                 disabled={true}
               />
                 </Grid>
                 <Grid item md={12} mt={1} sx={{ zIndex: 10 }}>
                   <InputFormatNumber
                     keyword="partnerSalePercent"
                     size="medium"
                     placeholder={trans.partner.sale}
                     value={dataForm?.partnerSalePercent}
                     handleChange={handleChangeInput}
                     errorText={getFirstValueInObject(dataError?.partnerSalePercent)}
                     probability={true}
                   />
                 </Grid>
               </Grid>
             </>
          )}
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <DatePickerDefault
                labelText={trans.order.start_date}
                keyword="startDate"
                value={dataForm?.startDate}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.startDate)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <DatePickerDefault
                labelText={trans.order.due_date_}
                keyword="dueDate"
                minDate={dataForm?.startDate}
                value={dataForm?.dueDate}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.dueDate)}
              />
            </Grid>
          </Grid>
          <DialogActions className="dialog-actions">
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
  billing: state?.billing,
  order: state?.order,
});

const mapDispatchToProps = {
  clearData,
  getListBilling,
  createOrder,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormCreateOrderFromDealDetail);
