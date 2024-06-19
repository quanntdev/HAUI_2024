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
  FormControl,
  Stack,
  Chip,
  Select,
  MenuItem,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import InputBase from "../Input/InputBase";
import SelectDefault from "../Input/SelectDefault";
import { connect } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { clearData, createTask } from "../../redux/actions/task";
import { searchUser } from "../../redux/actions/user";
import {
  PRIORITY_LIST,
  PUBLIC_STATUS_LIST,
  RELATED_ITEMS,
  FOMAT_DATE,
  rowsPerPageLimit,
} from "../../constants";
import { getFirstValueInObject } from "../../helpers";
import { useRouter } from "next/router";
import InputTiny from "../Input/InputTiny";
import { searchCustomer } from "../../redux/actions/customer";
import { searchDeal } from "../../redux/actions/deal";
import { searchOrder } from "../../redux/actions/order";
import { searchInvoices } from "../../redux/actions/invoice";
import moment from "moment";
import "flatpickr/dist/themes/material_green.css";
import NewDateTime from "../Input/DateTimePickerDefault/NewDateTime";
import MutiSelectInForm from "../Input/MutiSelect/MutiSelectInForm";
import useTrans from "../../utils/useTran";
import tranformDescription from "../../utility/tranformDescription";
import { getDetailProfile } from "../../redux/actions/profile";
import CancelIcon from "@mui/icons-material/Cancel";

const INIT_DATA = {
  name: "",
  priorityId: 2,
  usersId: "",
  description: "",
  isPublic: 1,
  customerId: "",
  dealId: "",
  orderId: "",
  invoiceId: "",
  startDate: null,
  dueDate: null,
};

const INIT_ERROR = {
  name: "",
  priorityId: "",
  usersId: "",
  statusId: "",
  startDate: "",
  dueDate: "",
  description: "",
  isPublic: "",
  customerId: "",
  dealId: "",
  orderId: "",
  invoiceId: "",
};

const FormCreateTask = (props: any) => {
  const trans = useTrans();
  const {
    createTask,
    clearData,
    openFormModal,
    setOpenFormModal,
    searchUser,
    errors,
    dataCustomer,
    dataDeal,
    dataOrder,
    dataInvoice,
    onScreen = false,
    searchCustomer,
    searchDeal,
    searchOrder,
    searchInvoices,
    getDetailProfile,
  } = props;
  const { dataCustomerList } = props.customer;
  const { dataDealList } = props.deal;
  const { dataOrderList } = props.order;
  const { dataInvoiceList } = props.invoice;
  const { dataCreateTask } = props.task;
  const { dataUserList } = props.user;
  const { dataDetailProfile } = props?.profile;
  const [dataForm, setDataForm] = useState<any>(INIT_DATA);
  const [dataError, setDataError] = useState<any>(INIT_ERROR);
  const router = useRouter();
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [dataItemsRelated, setDataItemsRelated] = useState<any>([]);
  const [keywordItems, setKeywordItems] = useState<any>(null);
  const [itemsRelated, setItemsRelated] = useState<any>(null);

  const [selectedNames, setSelectedNames] = useState([
    `${dataDetailProfile?.id}`,
  ]);
  const [customerOptions, setCustomerOptions] = useState([]);

  const now = moment();
  const next = now.clone().add(1, "days");

  useEffect(() => {
    if (errors) setDataError(errors);
  }, [errors]);

  useEffect(() => {
    if (dataCreateTask) {
      clearData("dataCreateTask");
      handleCloseFormModal();
      if (!onScreen) {
        router.push("/task");
      }
    }
  }, [dataCreateTask]);

  useEffect(() => {
    searchUser("");
    getDetailProfile();
    setDataForm({
      ...dataForm,
      customerId: dataCustomer?.id ?? "",
      dealId: dataDeal?.id ?? "",
      orderId: dataOrder?.id ?? "",
      invoiceId: dataInvoice?.id ?? "",
      startDate: now.format(FOMAT_DATE),
      dueDate: next.format(FOMAT_DATE),
      usersId: `${dataDetailProfile?.id}`,
    });
    setSelectedNames([`${dataDetailProfile?.id}`]);
  }, [openFormModal, dataCustomer, dataDeal, dataOrder, dataInvoice]);

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

  const handleChangeInput = (key: any, value: any) => {
    setDataForm({ ...dataForm, [key]: value });
  };

  const clearAllData = () => {
    clearData("dataCustomerList");
    clearData("dataDealList");
    clearData("dataOrderList");
    clearData("dataInvoiceList");
  };

  const handleChangeSelect = useCallback(
    (key: any, value: any) => {
      const query = `limit=${rowsPerPageLimit}&offset=${0}`;
      if (key === "relatedItems") {
        setItemsRelated(value);
        switch (value) {
          case "Customer":
            clearAllData();
            searchCustomer(query);
            setKeywordItems("customerId");
            break;
          case "Deal":
            clearAllData();
            searchDeal(query);
            setKeywordItems("dealId");
            break;
          case "Order":
            clearAllData();
            searchOrder(query);
            setKeywordItems("orderId");
            break;
          case "Invoice":
            clearAllData();
            searchInvoices(query);
            setKeywordItems("invoiceId");
            break;
        }
      }

      setDataForm((prevDataForm: any) => ({
        ...prevDataForm,
        [key]: Number(value),
      }));
    },
    [
      rowsPerPageLimit,
      setItemsRelated,
      clearAllData,
      searchCustomer,
      searchDeal,
      searchOrder,
      searchInvoices,
      setKeywordItems,
    ]
  );

  useEffect(() => {
    if (keywordItems) {
      setDataForm({
        ...dataForm,
        customerId: "",
        dealId: "",
        orderId: "",
        invoiceId: "",
      });
    }
  }, [keywordItems]);

  useEffect(() => {
    dataCustomerList && setDataItemsRelated(dataCustomerList?.items);
    dataDealList && setDataItemsRelated(dataDealList?.items);
    dataOrderList && setDataItemsRelated(dataOrderList?.data?.items);
    dataInvoiceList && setDataItemsRelated(dataInvoiceList?.data?.items);
  }, [dataCustomerList, dataDealList, dataOrderList, dataInvoiceList]);

  const handleCloseFormModal = () => {
    setDataForm(INIT_DATA);
    setDataError(INIT_ERROR);
    setOpenFormModal(false);
    setItemsRelated(null);
    setDataItemsRelated([]);
  };

  const handleSubmitForm = () => {
    if (isCreate) {
      return;
    }
    setIsCreate(true);
    const { ...payload }: any = dataForm;
    const formData = new FormData();

    const formFields = [
      {
        key: "attachment",
        transform: (files: any[]) =>
          files.forEach((file) => formData.append("attachment[]", file)),
      },
      {
        key: "description",
        transform: (value: any) =>
          formData.append("description", tranformDescription(value)),
      },
      {
        key: "startDate",
        transform: (value: any) =>
          formData.append(
            "startDate",
            moment(new Date(value)).format("YYYY-MM-DD HH:mm")
          ),
      },
      {
        key: "dueDate",
        transform: (value: any) =>
          formData.append(
            "dueDate",
            moment(new Date(value)).format("YYYY-MM-DD HH:mm")
          ),
      },
    ];

    Object.keys(payload).forEach((key: any) => {
      const field = formFields.find((f) => f.key === key);
      if (field) {
        field.transform(payload[key]);
      } else {
        formData.append(key, payload[key]);
      }
    });

    createTask(formData).then(() => {
      setIsCreate(false);
    });
  };

  useEffect(() => {
    if (dataCreateTask) {
      handleCloseFormModal();
    }
  }, [dataCreateTask]);

  useEffect(() => {
    if (dataForm?.dueDate <= dataForm?.startDate) {
      setDataForm({
        ...dataForm,
        dueDate: moment(dataForm.startDate)?.add(1, "days").format(FOMAT_DATE),
      });
    }
  }, [dataForm?.startDate]);

  useEffect(() => {
    setDataForm({ ...dataForm, usersId: selectedNames.join() });
  }, [selectedNames]);

  useEffect(() => {
    if (dataUserList?.items) {
      const convert = dataUserList?.items.map(
        (key: { id: any; profile: any }) => ({
          id: key?.id,
          value: `${key.profile?.first_name} ${key.profile?.last_name}`,
        })
      );
      setCustomerOptions(convert);
    }
  }, [dataUserList]);

  const handleChangeUser = useCallback((e: any) => {
    const value = e.target.value;
    setSelectedNames(value);
  }, []);

  const handleMouseDown = useCallback((event: any) => {
    event.stopPropagation();
  }, []);

  return (
    <>
      <Dialog
        open={openFormModal}
        onClose={handleCloseFormModal}
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
          {trans.task.add_task}
          <Button onClick={handleCloseFormModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box className="box-title">
            <Typography>{trans.home.details}</Typography>
          </Box>
          {dataCustomer && (
            <Grid container spacing={2} sx={{ marginTop: 0, marginBottom: 1 }}>
              <Grid item md>
                <InputBase
                  keyword="customerId"
                  labelText={trans.customer.customer_name}
                  value={dataCustomer?.name}
                  disabled={true}
                />
              </Grid>
            </Grid>
          )}
          {dataDeal && (
            <Grid container spacing={2} sx={{ marginTop: 0, marginBottom: 1 }}>
              <Grid item md>
                <InputBase
                  keyword="DealId"
                  labelText={trans.deal.deal_name}
                  value={dataDeal?.name}
                  disabled={true}
                />
              </Grid>
            </Grid>
          )}

          {dataOrder && (
            <Grid container spacing={2} sx={{ marginTop: 0, marginBottom: 1 }}>
              <Grid item md>
                <InputBase
                  keyword="orderId"
                  labelText={trans.order.order_name}
                  value={dataOrder?.name}
                  disabled={true}
                />
              </Grid>
            </Grid>
          )}

          {dataInvoice && (
            <Grid container spacing={2} sx={{ marginTop: 0, marginBottom: 1 }}>
              <Grid item md>
                <InputBase
                  keyword="invoiceId"
                  labelText={trans.invoice.invoice_name}
                  value={dataInvoice?.code}
                  disabled={true}
                />
              </Grid>
            </Grid>
          )}
          <InputBase
            keyword="name"
            labelText={trans.task.task_name}
            placeholder={trans.task.task_name}
            require={true}
            value={dataForm?.name}
            handleChange={handleChangeInput}
            errorText={getFirstValueInObject(dataError?.name)}
          />
          {!dataInvoice && !dataCustomer && !dataDeal && !dataOrder && (
            <Grid container spacing={2} sx={{ marginTop: 0, marginBottom: 1 }}>
              <Grid item md>
                <SelectDefault
                  keyword="relatedItems"
                  labelText={trans.task.related_items}
                  keyMenuItem="name"
                  keyValue="name"
                  value={itemsRelated}
                  data={RELATED_ITEMS}
                  handleChange={handleChangeSelect}
                  errorText={getFirstValueInObject(dataError?.relatedItems)}
                />
              </Grid>
              <Grid item md>
                <MutiSelectInForm
                  selectOption={dataItemsRelated}
                  dataForm={dataForm}
                  keyword={keywordItems}
                  setDataForm={setDataForm}
                  labelText={trans.task.items}
                  placeholder={trans.task.select}
                />
              </Grid>
            </Grid>
          )}
          <Grid container spacing={2} sx={{ marginTop: 0, marginBottom: 1 }}>
            <Grid item md>
              <SelectDefault
                keyword="priorityId"
                labelText={trans.customer.priority}
                keyMenuItem="id"
                keyValue="name"
                require={true}
                value={dataForm?.priorityId}
                data={PRIORITY_LIST}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.priorityId)}
              />
            </Grid>
            <Grid item md>
              <SelectDefault
                keyword="isPublic"
                labelText={trans.task.public}
                keyMenuItem="id"
                keyValue="name"
                require={true}
                value={dataForm?.isPublic}
                data={PUBLIC_STATUS_LIST}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.isPublic)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ marginTop: 0, marginBottom: 1 }}>
            <Typography
              variant="body1"
              color="initial"
              sx={{ marginLeft: "15px" }}
            >
              {trans.customer.user_assigned}
            </Typography>
            <FormControl sx={{ width: "99%", marginLeft: "15px" }}>
              <Select
                multiple
                value={selectedNames}
                onChange={handleChangeUser}
                renderValue={(selected) => (
                  <Stack gap={1} direction="row" flexWrap="wrap">
                    {selected.map((value) =>
                      customerOptions.map((item: any) => {
                        if (item.id === value) {
                          return (
                            <Chip
                              key={value}
                              label={item.value}
                              onDelete={() =>
                                setSelectedNames(
                                  selectedNames.filter((item) => item !== value)
                                )
                              }
                              deleteIcon={
                                <CancelIcon onMouseDown={handleMouseDown} />
                              }
                            />
                          );
                        }
                        return null;
                      })
                    )}
                  </Stack>
                )}
              >
                {customerOptions.map((item: any) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <NewDateTime
                keyword="startDate"
                labelText={trans.order.start_date}
                value={dataForm?.startDate}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.startDate)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <NewDateTime
                keyword="dueDate"
                labelText={trans.order.due_date_}
                value={dataForm?.dueDate}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.dueDate)}
                minDate={dataForm?.startDate}
              />
            </Grid>
          </Grid>
          <Box className="box-title">
            <Typography>{trans.order.description_information}</Typography>
          </Box>
          <InputTiny
            handleChange={handleChangeInput}
            keyword="description"
            value={dataForm?.description}
            setDataForm={setDataForm}
            dataForm={dataForm}
            canDrop={true}
          />
          <DialogActions className="dialog-actions">
            <Button className="btn-save" onClick={handleSubmitForm}>
              {trans.task.save}
            </Button>
            <Button onClick={handleCloseFormModal} className="btn-cancel">
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
  order: state?.order,
  invoice: state?.invoice,
  customer: state?.customer,
  profile: state?.profile,
  errors: state?.task?.error?.response?.data?.properties ?? {},
});

const mapDispatchToProps = {
  createTask,
  clearData,
  searchUser,
  searchCustomer,
  searchDeal,
  searchOrder,
  searchInvoices,
  getDetailProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormCreateTask);
