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
import InputBase from "../Input/InputBase";
import SelectDefault from "../Input/SelectDefault";
import { genders, rowsPerPage, rowsPerPageLimit } from "../../constants";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { searchCustomer } from "../../redux/actions/customer";
import SelectInput from "../Input/SelectInput/SelectInput";
import InputTiny from "../Input/InputTiny";
import {
  searchContact,
  createContact,
  updateContact,
  getDetailContact,
  clearData,
} from "../../redux/actions/contact";
import { getFirstValueInObject } from "../../helpers";
import useTrans from "../../utils/useTran";
import tranformDescription from "../../utility/tranformDescription";

type DataFormType = {
  email: string | null;
  firstName: string;
  lastName: string;
  gender:string |  number | null;
  phone: string | null;
  description:string;
  customerId:string | number | null;
  sector: string;
};

const INIT_DATA = {
  email: "",
  firstName: "",
  lastName: "",
  gender: "",
  phone: "",
  description: "",
  customerId: "",
  sector: "",
};

const INIT_ERROR = {
  email: "",
  firstName: "",
  lastName: "",
  gender: "",
  phone: "",
  description: "",
  customerId: "",
  sector: "",
};

const FormCreateOrUpdateContact = (props: any) => {
  const trans = useTrans();
  const {
    searchContact,
    createContact,
    getDetailContact,
    updateContact,
    searchCustomer,
    clearData,
    errors,
    openEditModal,
    setOpenEditModal,
    dataCustomer,
    id,
  } = props;
  const { dataContactDetail, dataUpdateContact, dataCreateContact } =
    props.contact;
  const { dataCustomerList } = props.customer;
  const [dataForm, setDataForm] = useState<DataFormType>(INIT_DATA);
  const [dataError, setDataError] = useState(INIT_ERROR);
  const router = useRouter();

  useEffect(() => {
    clearData("dataContactDetail");
    if (id ) {
      getDetailContact(id);
    }
  }, [id]);

  useEffect(() => {
    dataContactDetail && openEditModal &&
      setDataForm({
        ...INIT_DATA,
        ...dataContactDetail,
        customerId: dataContactDetail?.customer?.id ? Number(dataContactDetail?.customer?.id) : "",
      });
  }, [dataContactDetail, openEditModal]);

  useEffect(() => {
    dataCustomer && openEditModal &&
      setDataForm({
        ...INIT_DATA,
        ...dataContactDetail,
        customerId: dataCustomer?.id ?  Number(dataCustomer?.id) : "",
      });
  }, [dataCustomer, openEditModal]);
  useEffect(() => {
    const query = `limit=${rowsPerPageLimit}&offset=${0}`;
    searchCustomer(query);
  }, []);

  const handleChangeInput = function (key: any, value: any) {
    setDataForm({
      ...dataForm,
      [key]: value ?? "",
    });
  };

  const handleChagneInputEmail = function (key: any, value: any) {
    setDataForm({
      ...dataForm,
      [key]: value == "" ? "" : value,
    });
  };

  const handleChangeSelect = function (key: any, value: any) {
    setDataForm({ ...dataForm, [key]: Number(value) ?? "" });
  };

  useEffect(() => {
    if (openEditModal && !id) {
      clearData("dataContactDetail");
      setDataError(INIT_ERROR);
    }
  }, [openEditModal, id]);

  const handleCloseEditModal = function () {
    if (dataCreateContact) clearData("dataCreateContact");
    if (dataUpdateContact) clearData("dataUpdateContact");
    setDataError(INIT_ERROR);
    setDataForm({
      ...INIT_DATA,
      customerId:dataCustomer?.id ? Number(dataCustomer?.id) : "",
    });
    setOpenEditModal(false);
  };

  useEffect(() => {
    setDataError({ ...INIT_ERROR, ...errors });
  }, [errors]);

  const handleSubmitForm = function () {
    if (id) {
      const { tags, ...newBody }: any = dataForm;
      updateContact(newBody, id);
    } else {
      const {...payload}:any = dataForm;
      const formData = new FormData();
       Object.keys(payload).forEach((key:any) => {
        if (key == 'attachment') {
            Object.values(payload[key]).forEach(function (file: any) {
            formData.append('attachment[]', file);
          })
        }
        if(key == "description") {
          formData.append('description', (tranformDescription(dataForm?.description)));
        }
         else {
          formData.append(key, payload[key]);
        }
      });
      createContact(formData);
    }
  };

  const CustomerOptions = dataCustomerList?.items?.map(
    (key: { id: any; name: any }) => ({
      id: key?.id,
      value: key?.id,
      label: key?.name,
    })
  );

  useEffect(() => {
    if (dataCreateContact) {
      setDataForm(INIT_DATA);
      handleCloseEditModal();
      searchContact();
      if (dataCustomer) {
        router.push(`/customer/${dataCustomer?.id}`);
      } else {
        router.push(router.route);
      }
    }
  }, [dataCreateContact]);

  useEffect(() => {
    let querySearch = `limit=${rowsPerPage}`;
    if (router.query?.page) {
      querySearch = `limit=${rowsPerPage}&offset=${
        (Number(router.query.page) - 1) * rowsPerPage
      }`;
    }
    if (dataUpdateContact) {
      searchContact(querySearch);
      handleCloseEditModal();
    }
  }, [dataUpdateContact]);

  return (
    <>
      <Dialog
        disableEnforceFocus={true}
        disableAutoFocus={true}
        open={openEditModal}
        onClose={handleCloseEditModal}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
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
          {id != null ? trans.contact.update_contact : trans.contact.add_contact}
          <Button onClick={handleCloseEditModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box className="box-title">
            <Typography>{trans.contact.name_occupation}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <InputBase
                labelText={trans.user.first_name}
                keyword="firstName"
                placeholder={trans.user.first_name}
                require={true}
                value={dataForm?.firstName}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.firstName)}
              />
            </Grid>
            <Grid item md={6}>
              <InputBase
                labelText={trans.user.last_name}
                keyword="lastName"
                placeholder={trans.user.last_name}
                value={dataForm?.lastName}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.lastName)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <SelectDefault
                labelText={trans.contact.gender}
                keyword="gender"
                keyMenuItem="id"
                keyValue="name"
                data={genders}
                value={dataForm?.gender}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.gender)}
              />
            </Grid>
          </Grid>
          <Box className="box-title">
            <Typography>{trans.user.contact_details}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <InputBase
                labelText={trans.contact.email}
                keyword="email"
                placeholder={trans.contact.email}
                value={dataForm?.email}
                handleChange={handleChagneInputEmail}
                errorText={getFirstValueInObject(dataError?.email)}
              />
            </Grid>
            <Grid item md={6}>
              <InputBase
                labelText={trans.contact.phone}
                keyword="phone"
                placeholder={trans.contact.phone}
                value={dataForm?.phone}
                handleChange={handleChagneInputEmail}
                errorText={getFirstValueInObject(dataError?.phone)}
              />
            </Grid>
          </Grid>
          <Box className="box-title">
            <Typography>{trans.contact.description_information}</Typography>
          </Box>
          <InputTiny
            handleChange={handleChangeInput}
            keyword="description"
            value={dataForm?.description}
            setDataForm={setDataForm}
            dataForm={dataForm}
            canDrop={true}
          />
          <Box className="box-title">
            <Typography>{trans.menu.customer}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <SelectInput
                labelText={trans.customer.customer_name}
                keyword="customerId"
                keyMenuItem="id"
                keyValue="name"
                disabled={!!dataCustomer}
                options={CustomerOptions}
                value={dataForm?.customerId}
                handleChange={handleChangeSelect}
                isCreateNew={false}
              />
            </Grid>
            <Grid item md={6}>
              <InputBase
                labelText={trans.contact._position}
                keyword="sector"
                placeholder={trans.contact._position}
                value={dataForm?.sector}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.sector)}
              />
            </Grid>
          </Grid>
          <DialogActions className="dialog-actions">
            <Button className="btn-save" onClick={handleSubmitForm}>
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
  contact: state.contact,
  customer: state.customer,
  tag: state.tag,
  errors: state.contact?.error?.response?.data?.properties ?? {},
});

const mapDispatchToProps = {
  searchContact,
  createContact,
  getDetailContact,
  updateContact,
  clearData,
  searchCustomer,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormCreateOrUpdateContact);
