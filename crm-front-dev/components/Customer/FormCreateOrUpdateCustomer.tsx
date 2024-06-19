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
import { getFirstValueInObject } from "../../helpers";
import InputBase from "../Input/InputBase";
import SelectDefault from "../Input/SelectDefault";
import DatePickerDefault from "../Input/DatePickerDefault";
import { getIndustry } from "../../redux/actions/industry";
import { getCities } from "../../redux/actions/city";
import { getEmployee } from "../../redux/actions/employee";
import { getCountries } from "../../redux/actions/countries";
import InputTiny from "../Input/InputTiny";
import InputFormatNumber from "../Input/InputFormatNumber";
import { getCurrencyList } from "../../redux/actions/currency";
import { searchCustomerLevel } from "../../redux/actions/customerLevel";
import {
  createCustomer,
  getCid,
  clearData,
  getDetailCustomer,
  updateCustomer,
} from "../../redux/actions/customer";
import SelectInput from "../Input/SelectInput/SelectInput";
import {
  CUSTOMER_PARTNER_LIST,
  CUSTOMER_PRIORITY_LIST,
} from "../../constants/customer";
import { searchUser } from "../../redux/actions/user";
import { getSaleChannel } from "../../redux/actions/saleChannel";
import useTrans from "../../utils/useTran";
import defaultCountrySelect from "../../utility/defaultCountrySelect";
import tranformDescription from "../../utility/tranformDescription";
import { listPartner } from "../../redux/actions/partner";
import { partnerSaleOption } from "../../constants";

type DataFormType = {
  email: string | null;
  name: string | null;
  subName: string | null;
  esTabLishMent: string | Date | null;
  phone: string | null;
  fax: string;
  website: string | null;
  address: string;
  description: string;
  cityId: string | number | null;
  employeeId: string | number | null;
  industryId: string | number | null;
  countryId: string | number | null;
  currencyId: string | number | null;
  cidCode: string | null;
  capital: string | null;
  postalCode: string | null;
  levelId: string | number | null;
  channelId: string | number | null;
  assignedId: string | number | null;
  priorityId: string | number | null;
  partnerId: string | number | null;
  partnerSaleType: string | number | null;
  partnerSalePercent: string | number | null;
  saleStartDate: string | null;
  saleEndDate: string | null;
};

const INIT_DATA = {
  email: "",
  name: "",
  subName: "",
  esTabLishMent: "",
  phone: "",
  fax: "",
  website: "",
  address: "",
  description: "",
  cityId: "",
  employeeId: "",
  industryId: "",
  countryId: "",
  currencyId: "",
  cidCode: "",
  capital: "",
  postalCode: "",
  levelId: "",
  channelId: "",
  assignedId: "",
  priorityId: "",
  partnerId: "",
  partnerSaleType: "",
  partnerSalePercent: "",
  saleStartDate: "",
  saleEndDate: "",
};

const INIT_ERROR = {
  email: "",
  name: "",
  subName: "",
  esTabLishMent: "",
  phone: "",
  fax: "",
  website: "",
  address: "",
  description: "",
  cityId: "",
  employeeId: "",
  industryId: "",
  countryId: "",
  currencyId: "",
  cidCode: "",
  capital: "",
  postalCode: "",
  levelId: "",
  channelId: "",
  assignedId: "",
  priorityId: "",
  partnerId: "",
  partnerSaleType: "",
  partnerSalePercent: "",
  saleStartDate: "",
  saleEndDate: "",
};

const FormCreateOrUpdateCustomer = (props: any) => {
  const trans = useTrans();
  const {
    openModal,
    setOpenModal,
    createCustomer,
    getDetailCustomer,
    updateCustomer,
    getCid,
    clearData,
    errors,
    getCountries,
    getIndustry,
    getEmployee,
    getCities,
    getCurrencyList,
    id,
    searchCustomerLevel,
    searchUser,
    getSaleChannel,
    listPartner,
  } = props;
  const {
    dataCreateCustomer,
    dataDetailCustomer,
    dataUpdateCustomer,
    dataCid,
  } = props.customer;
  const { dataDetailProfile } = props?.profile;
  const { dataCustomerLevel } = props.level;
  const { dataSaleChannelList } = props.saleChannel;
  const { dataUserList } = props.user;
  const { dataIndustryList } = props.industry;
  const { dataEmployeeList } = props.employee;
  const { dataCityList } = props.city;
  const { dataCurrencyList } = props.currency;
  const { dataCountryList } = props.country;
  const { dataListPartner } = props.partner;
  const [dataForm, setDataForm] = useState<DataFormType>(INIT_DATA);
  const [dataError, setDataError] = useState<any>(INIT_ERROR);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      getDetailCustomer(id);
    } else {
      clearData("dataDetailCustomer");
    }
  }, [id]);

  useEffect(() => {
    getCountries();
    getIndustry();
    getEmployee();
    getCurrencyList();
    getSaleChannel();
  }, [dataCreateCustomer]);

  useEffect(() => {
    if (!dataCustomerLevel) {
      searchCustomerLevel();
    }
    searchUser();
    listPartner();
  }, [openModal]);

  const dataLevel = dataCustomerLevel?.map((key: any) => ({
    id: key?.id,
    value: key?.id,
    label: key?.name,
  }));

  const optionCustomer = dataUserList?.items?.map(
    (key: { id: any; profile: any }) => ({
      id: key?.id,
      label: key?.profile?.first_name + " " + key?.profile?.last_name,
      value: key?.id,
    })
  );

  const optionPartner = dataListPartner?.data?.items?.map(
    (key: { id: any; name: any }) => ({
      id: key?.id,
      label: key?.name,
      value: key?.id,
    })
  );

  useEffect(() => {
    if (dataForm?.countryId) {
      getCities(`${dataForm?.countryId}`);
    }
  }, [dataForm?.countryId, getCities]);

  useEffect(() => {
    setDataForm({
      ...INIT_DATA,
      ...dataDetailCustomer,
      cityId: dataDetailCustomer?.city?.id ? dataDetailCustomer?.city?.id : "",
      employeeId: dataDetailCustomer?.employee?.id
        ? dataDetailCustomer?.employee?.id
        : "",
      industryId: dataDetailCustomer?.industry?.id
        ? dataDetailCustomer?.industry?.id
        : "",
      countryId: dataDetailCustomer?.country?.id
        ? dataDetailCustomer?.country?.id
        : "",
      cidCode: dataDetailCustomer?.cid?.code
        ? dataDetailCustomer?.cid?.code
        : "",
      currencyId: dataDetailCustomer?.currency?.id
        ? +dataDetailCustomer?.currency?.id
        : "",
    });
  }, [dataDetailCustomer]);

  useEffect(() => {
    if (defaultCountrySelect(dataCountryList)) {
      getCid(Number(defaultCountrySelect(dataCountryList)));
    }

    if (openModal && !id) {
      setDataForm({
        ...INIT_DATA,
        countryId: Number(defaultCountrySelect(dataCountryList)),
        cidCode: dataCid?.cidCode,
        assignedId: dataDetailProfile?.id,
        priorityId: CUSTOMER_PRIORITY_LIST[2]?.id,
      });
    }
  }, [id, openModal]);

  useEffect(() => {
    setDataError({ ...INIT_ERROR, ...errors });
  }, [errors]);

  const handleChangeInput = useCallback((key: any, value: any) => {
    if (value === "") value = "";
    setDataForm((prevDataForm) => ({ ...prevDataForm, [key]: value }));
  }, []);

  const handleChangeSelect = useCallback(
    (key: any, value: any) => {
      if (key === "countryId") getCid(value);
      setDataForm((prevDataForm) => ({
        ...prevDataForm,
        [key]: Number(value),
      }));
    },
    [getCid]
  );

  useEffect(() => {
    if (dataCid && dataCid?.cidCode !== dataForm.cidCode)
      setDataForm({ ...dataForm, ["cidCode"]: dataCid?.cidCode });
  }, [dataCid]);

  const handleCreateCustomer = async (e: { preventDefault: () => void }) => {
    const { ...payload }: any = dataForm;
    const formData = new FormData();
    Object.keys(payload).forEach((key: any) => {
      if (key == "attachment") {
        Object.values(payload[key]).forEach(function (file: any) {
          formData.append("attachment[]", file);
        });
      }
      if (key == "description") {
        formData.append(
          "description",
          tranformDescription(dataForm?.description)
        );
      } else {
        formData.append(key, payload[key]);
      }
    });
    createCustomer(formData);
  };

  useEffect(() => {
    if (dataCreateCustomer) {
      setDataForm(INIT_DATA);
      router.push(router.route);
    }
  }, [dataCreateCustomer]);

  const handleUpdateCustomer = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    updateCustomer(dataForm, id);
  };

  const handleCloseModal = function () {
    if (dataCreateCustomer) clearData("dataCreateCustomer");
    if (dataUpdateCustomer) clearData("dataUpdateCustomer");
    setDataForm(INIT_DATA);
    setDataError(INIT_ERROR);
    clearData("dataCid");
    setOpenModal(false);
  };

  useEffect(() => {
    if (dataCreateCustomer || dataUpdateCustomer) {
      handleCloseModal();
    }
  }, [dataCreateCustomer, dataUpdateCustomer]);

  useEffect(() => {
    if (dataCreateCustomer) {
      router.push(router.route);
    }
  }, [dataCreateCustomer]);

  useEffect(() => {
    if (dataForm?.partnerSaleType === partnerSaleOption.TOTAL_PAYMENT_REVENUE) {
      setDataForm({
        ...dataForm,
        partnerSalePercent: "",
        saleStartDate: "",
        saleEndDate: "",
      });
    }
  }, [dataForm?.partnerSaleType]);

  const optionSaleChannel = dataSaleChannelList?.map(
    (key: { id: any; name: any }) => ({
      id: key.id,
      label: key.name,
      value: key.id,
    })
  );

  return (
    <>
      <Dialog
        disableEnforceFocus={true}
        disableAutoFocus={true}
        open={openModal}
        onClose={handleCloseModal}
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
          {id ? trans.customer.edit_customer : trans.customer.add_customer}
          <Button onClick={handleCloseModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box className="box-title">
            <Typography>{trans.customer_detail.customer_details}</Typography>
          </Box>
          <InputBase
            labelText={trans.customer.customer_name}
            keyword="name"
            placeholder={trans.customer.customer_name}
            type="text"
            require={true}
            value={dataForm?.name}
            handleChange={handleChangeInput}
            errorText={getFirstValueInObject(dataError?.name)}
          />
          <Grid item md={6} mt={2}>
            <InputBase
              labelText={trans.customer.sub_name}
              keyword="subName"
              placeholder={trans.customer.sub_name}
              type="text"
              value={dataForm?.subName}
              handleChange={handleChangeInput}
              errorText={getFirstValueInObject(dataError?.subName)}
            />
          </Grid>

          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <SelectInput
                labelText={trans.customer.level}
                keyword="levelId"
                keyMenuItem="id"
                keyValue="name"
                options={dataLevel}
                value={dataForm?.levelId}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.levelId)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <DatePickerDefault
                labelText={trans.customer_detail.establishment}
                handleChange={handleChangeInput}
                value={dataForm?.esTabLishMent}
                keyword="esTabLishMent"
                errorText={getFirstValueInObject(dataError?.esTabLishMent)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <SelectDefault
                labelText={trans.customer_detail.employee}
                keyword="employeeId"
                keyMenuItem="id"
                keyValue="name"
                data={dataEmployeeList}
                value={dataForm?.employeeId}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.employeeId)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <SelectDefault
                labelText={trans.customer_detail.currency}
                keyword="currencyId"
                keyMenuItem="id"
                keyValue="name"
                data={dataCurrencyList}
                value={dataForm?.currencyId}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.currencyId)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <InputFormatNumber
                label={trans.customer_detail.capital}
                keyword="capital"
                placeholder={trans.customer_detail.capital}
                value={dataForm?.capital}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.capital)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <SelectDefault
                labelText={trans.customer_detail.industry}
                keyword="industryId"
                keyMenuItem="id"
                keyValue="name"
                data={dataIndustryList}
                value={dataForm?.industryId}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.industryId)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <InputBase
                labelText={trans.customer_detail.phone}
                keyword="phone"
                placeholder={trans.customer_detail.phone}
                type="text"
                value={dataForm?.phone}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.phone)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <InputBase
                labelText={trans.customer_detail.fax}
                keyword="fax"
                placeholder={trans.customer_detail.fax}
                type="text"
                value={dataForm?.fax}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.fax)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <InputBase
                labelText={trans.customer_detail.website}
                keyword="website"
                placeholder={trans.customer_detail.website}
                type="text"
                value={dataForm?.website}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.website)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <InputBase
                labelText={trans.customer_detail.email}
                keyword="email"
                placeholder={trans.customer_detail.email}
                type="text"
                value={dataForm?.email}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.email)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <SelectInput
                labelText={trans.customer_detail.assigned}
                keyword="assignedId"
                keyMenuItem="id"
                keyValue="name"
                options={optionCustomer}
                value={dataForm?.assignedId}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.assignedId)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <SelectInput
                labelText={trans.customer_detail.priority}
                keyword="priorityId"
                keyMenuItem="id"
                keyValue="name"
                options={CUSTOMER_PRIORITY_LIST}
                value={dataForm?.priorityId}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.priorityId)}
              />
            </Grid>
          </Grid>

          <Box className="box-title">
            <Typography>{trans.customer_detail.address_infomation}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <SelectDefault
                labelText={trans.country.country}
                keyword="countryId"
                keyMenuItem="id"
                keyValue="name"
                data={dataCountryList}
                value={dataForm?.countryId}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.countryId)}
              />
            </Grid>
            <Grid item md={6}>
              <InputFormatNumber
                label="CID"
                placeholder="CID"
                keyword="cidCode"
                disabled={!dataForm?.countryId}
                handleChange={handleChangeInput}
                value={dataForm.cidCode}
                errorText={getFirstValueInObject(dataError?.cidCode)}
                disable={true}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <SelectDefault
                labelText={trans.customer_detail.province}
                keyword="cityId"
                keyMenuItem="id"
                keyValue="name"
                disabled={
                  (!dataDetailCustomer?.country?.id && !dataForm?.countryId) ||
                  dataCityList?.length === 0
                }
                data={dataCityList}
                value={dataForm?.cityId}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.cityId)}
              />
            </Grid>
            <Grid item md={6} mt={2}>
              <InputBase
                labelText={trans.customer_detail.postal_code}
                keyword="postalCode"
                placeholder={trans.customer_detail.postal_code}
                type="text"
                value={dataForm?.postalCode}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.postalCode)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={12} mt={2}>
              <InputBase
                labelText={trans.customer_detail.address}
                keyword="address"
                placeholder={trans.customer_detail.address}
                type="text"
                value={dataForm?.address}
                handleChange={handleChangeInput}
                errorText={getFirstValueInObject(dataError?.address)}
              />
            </Grid>
            <Grid sx={{ zIndex: 100 }} item md={12}>
              <SelectInput
                labelText={trans.sale_channel.channel_name}
                keyword="channelId"
                keyMenuItem="id"
                keyValue="name"
                options={optionSaleChannel}
                value={dataForm?.channelId}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.assignedId)}
              />
            </Grid>
          </Grid>
          <Box className="box-title">
            <Typography>{trans.menu.partner}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2} sx={{ zIndex: 11 }}>
              <SelectInput
                labelText={trans.menu.partner}
                keyword="partnerId"
                keyMenuItem="id"
                keyValue="name"
                options={optionPartner}
                value={dataForm?.partnerId}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.partnerId)}
              />
            </Grid>
            <Grid item md={6} mt={2} sx={{ zIndex: 11 }}>
              <SelectInput
                labelText={trans.partner.partner_payment_option}
                keyword="partnerSaleType"
                keyMenuItem="id"
                keyValue="name"
                options={CUSTOMER_PARTNER_LIST}
                value={dataForm?.partnerSaleType}
                handleChange={handleChangeSelect}
                errorText={getFirstValueInObject(dataError?.partnerSaleType)}
              />
            </Grid>
          </Grid>
          {(dataForm?.partnerSaleType ==
            partnerSaleOption.TOTAL_PAYMENT_BY_PERIOD ||
            dataForm?.partnerSaleType ==
              partnerSaleOption.TOTAL_PAYMENT_REVENUE) && (
            <>
              <Box className="box-title">
                <Typography>{trans.partner.payment_tern}</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item md={2} sx={{ zIndex: 10 }}>
                  <InputFormatNumber
                    keyword="partnerSalePercent"
                    size="medium"
                    placeholder={trans.partner.sale_rate}
                    value={dataForm?.partnerSalePercent}
                    handleChange={handleChangeInput}
                    errorText={getFirstValueInObject(
                      dataError?.partnerSalePercent
                    )}
                    probability={true}
                    label={trans.partner.sale}
                  />
                </Grid>
                <Grid item md={5}>
                  <DatePickerDefault
                    labelText={trans.order.start_date}
                    keyword="saleStartDate"
                    value={dataForm?.saleStartDate}
                    handleChange={handleChangeInput}
                    errorText={getFirstValueInObject(dataError?.saleStartDate)}
                    disabled={
                      dataForm?.partnerSaleType ==
                      partnerSaleOption.TOTAL_PAYMENT_REVENUE
                    }
                  />
                </Grid>
                <Grid item md={5}>
                  <DatePickerDefault
                    labelText={trans.order.due_date_}
                    keyword="saleEndDate"
                    value={dataForm?.saleEndDate}
                    handleChange={handleChangeInput}
                    minDate={dataForm?.saleEndDate}
                    errorText={getFirstValueInObject(dataError?.saleEndDate)}
                    disabled={
                      dataForm?.partnerSaleType ==
                      partnerSaleOption.TOTAL_PAYMENT_REVENUE
                    }
                  />
                </Grid>
              </Grid>
            </>
          )}
          <Box className="box-title">
            <Typography>
              {trans.customer_detail.description_information}
            </Typography>
          </Box>
          <InputTiny
            handleChange={handleChangeInput}
            keyword="description"
            value={dataForm?.description}
            setDataForm={setDataForm}
            dataForm={dataForm}
            canDrop={true}
          />
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button
            className="btn-save"
            onClick={id ? handleUpdateCustomer : handleCreateCustomer}
          >
            {trans.task.save}
          </Button>
          <Button onClick={handleCloseModal} className="btn-cancel">
            {trans.task.cancle}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  city: state?.city,
  customer: state?.customer,
  employee: state?.employee,
  industry: state?.industry,
  currency: state.currency,
  country: state?.country,
  errors: state.customer?.error?.response?.data?.properties ?? {},
  level: state.customerLevel,
  user: state.user,
  saleChannel: state.saleChannel,
  profile: state?.profile,
  partner: state.partner,
});

const mapDispatchToProps = {
  createCustomer,
  updateCustomer,
  getDetailCustomer,
  clearData,
  getCid,
  getCountries,
  getIndustry,
  getEmployee,
  getCities,
  getCurrencyList,
  searchCustomerLevel,
  searchUser,
  getSaleChannel,
  listPartner,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormCreateOrUpdateCustomer);
