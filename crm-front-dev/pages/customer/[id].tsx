import {
  Box,
  Grid,
  Typography,
  Paper,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  styled,
  Button,
  Chip,
  TextField,
  Autocomplete,
  Modal,
  Stack,
  Pagination,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AddIcon from "@mui/icons-material/Add";
import CallMergeIcon from "@mui/icons-material/CallMerge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import type { NextPage } from "next";
import styles from "./styles.module.scss";
import { partnerSaleOption, rowsPerPage, statusCode } from "../../constants";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import SelectDefault from "../../components/Input/SelectDefault";
import { getIndustry } from "../../redux/actions/industry";
import { getEmployee } from "../../redux/actions/employee";
import { getCities } from "../../redux/actions/city";
import { getCountries } from "../../redux/actions/countries";
import DatePickerDefault from "../../components/Input/DatePickerDefault";
import { getCurrencyList } from "../../redux/actions/currency";
import { getStatusList } from "../../redux/actions/status";
import { getFirstValueInObject } from "../../helpers";
import { getObjectTask } from "../../redux/actions/task";
import HeadMeta from "../../components/HeadMeta";
import { getPayment, searchPayment } from "../../redux/actions/payment";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  getDetailCustomer,
  clearData,
  getListContactByCustomerId,
  getListDealByCustomerId,
  getListOrderByCustomerId,
  updateCustomer,
  getListPaymentByCustomerId,
  getCid,
  deleteCustomer,
  searchCustomer,
} from "../../redux/actions/customer";
import Breadcrumb from "../../components/Breadcumb";
import Link from "next/link";
import InputBase from "../../components/Input/InputBase";
import { showGender } from "../../constants/contact";
import {
  getInvoicesByCustomerId,
  searchInvoices,
} from "../../redux/actions/invoice";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import PaginationDefault from "../../components/Pagination";
import checkChangeDataBeforeUpdate from "../../utility/checkChangeDataBeforeUpdate";
import FormCreateDealFromCustomerDetail from "../../components/Deal/FormCreateDealFromCustomerDetail";
import FormCreateTask from "../../components/Task/FormCreateTask";
import InputTiny from "../../components/Input/InputTiny";
import { getDetailProfile } from "../../redux/actions/profile";
import {
  TAB_CUSTOMER_CONTACT,
  TAB_CUSTOMER_DEAL,
  TAB_CUSTOMER_INVOICE,
  TAB_CUSTOMER_NOTE,
  TAB_CUSTOMER_ORDER,
  TAB_CUSTOMER_PAYMENT,
  TAB_CUSTOMER_TASK,
  TAB_LOG_CUSTOMER_DETAIL,
} from "../../constants/customerDetail";
import FormCreateOrUpdateContact from "../../components/Contact/FormCreateOrUpdateContact";
import TabPanelTaskList from "../../components/TabList/TabPanelTaskList";
import { IconBuildingCommunity } from "@tabler/icons";
import TabPanelPaymentListCustomer from "../../components/TabList/TabPaymentListCustomer";
import LogNote from "../../components/LogNote";
import InputFormatNumber from "../../components/Input/InputFormatNumber";
import { searchCustomerLevel } from "../../redux/actions/customerLevel";
import ModalDelete from "../../components/Modal/ModalDelete";
import ModalUpdateCountry from "../../components/Modal/ModalUpdateCountry";
import { CUSTOMER_PRIORITY_LIST } from "../../constants/customer";
import { searchUser } from "../../redux/actions/user";
import ModalDeleteNotification from "../../components/Modal/ModalDeleteNotification";
import removeQueryParam from "../../utility/removeQueryParam";
import { getSaleChannel } from "../../redux/actions/saleChannel";
import useTrans from "../../utils/useTran";
import FormShowDetailPayment from "../../components/Payment/FormShowDetailPayment";
import { uploadFileRaw } from "../../redux/actions/comment";
import moment from "moment";
import { listPartner } from "../../redux/actions/partner";
import fomatDate from "../../utility/fomatDate";
import ModalDetailCustomer from "../../components/Modal/ModalDetailCustomer";
import AddIcCallOutlinedIcon from "@mui/icons-material/AddIcCallOutlined";
import { checkLinkComment } from "../../utility/checkLinkComment";
const BoxTotalPrice = styled("div")(({ theme }) => ({
  padding: "0 8px",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
  [theme.breakpoints.up("md")]: {
    width: "25%",
  },
  [theme.breakpoints.up("lg")]: {
    width: "25%",
  },
}));

const DataCircle = (props: any) => {
  const { value, borderColor, textColor } = props;
  return (
    <div
      className={styles["circle"]}
      style={{
        borderColor: borderColor,
        width: 40,
        height: 40,
        fontSize: 14,
      }}
    >
      <div
        style={{
          color: textColor,
        }}
      >
        {value}
      </div>
    </div>
  );
};

const INIT_DATA = {
  email: null,
  name: "",
  subName: "",
  esTabLishMent: null,
  phone: null,
  fax: "",
  website: null,
  address: "",
  description: "",
  cityId: null,
  employeeId: null,
  industryId: null,
  countryId: null,
  currencyId: null,
  cidCode: "",
  capital: null,
  postalCode: null,
  levelId: null,
  channelId: null,
  assignedId: null,
  priorityId: null,
  partnerId: null,
  partnerSaleType: null,
  partnerSalePercent: null,
  saleStartDate: null,
  saleEndDate: null,
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

interface InitData {
  subName: string | null;
  email: string | null;
  name: string;
  esTabLishMent: Date | null;
  phone: string | null;
  fax: string;
  website: string | null;
  address: string;
  description: string;
  cityId: number | null;
  employeeId: number | null;
  industryId: number | null;
  countryId: number | null;
  currencyId: number | null;
  cidCode: string | null;
  capital: string | null;
  postalCode: string | null;
  levelId: number | null;
  channelId: number | null;
  assignedId: number | null;
  priorityId: number | null;
  partnerId: string | number | null;
  partnerSaleType: string | number | null;
  partnerSalePercent: string | number | null;
  saleStartDate: string | null;
  saleEndDate: string | null;
}

function TabPanel(props: any) {
  const { children, value, index } = props;
  return (
    <div>
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const CustomerDetail: NextPage = (props: any) => {
  const {
    getDetailCustomer,
    clearData,
    getListContactByCustomerId,
    getListDealByCustomerId,
    getListOrderByCustomerId,
    getInvoicesByCustomerId,
    updateCustomer,
    getCities,
    getCountries,
    getCurrencyList,
    getCid,
    getListPaymentByCustomerId,
    getIndustry,
    getEmployee,
    errors,
    getObjectTask,
    searchPayment,
    searchInvoices,
    getDetailProfile,
    searchCustomerLevel,
    deleteCustomer,
    searchUser,
    searchCustomer,
    getSaleChannel,
    getPayment,
    listPartner,
  } = props;
  const { dataCustomerLevel } = props.level;
  const {
    dataDetailCustomer,
    error,
    dataListContacts,
    dataListDeals,
    dataListOrders,
    dataUpdateCustomer,
    dataDeleteCustomer,
    dataCid,
    dataListPayment,
    logNoteCustomer,
    dataCustomerList,
  } = props.customer;

  const { dataCreateDeal } = props.deal;
  const { dataCreateContact } = props.contact;
  const { dataPaymentList, dataPayment } = props.payment;
  const { dataInvoicesByCustomerId } = props.invoice;
  const { dataCurrencyList } = props.currency;
  const { dataSaleChannelList } = props.saleChannel;
  const { dataIndustryList } = props.industry;
  const { dataEmployeeList } = props.employee;
  const { dataCountryList } = props.country;
  const { dataCityList } = props.city;
  const { dataTaskObject, dataCreateTask } = props.task;
  const { dataDetailProfile } = props?.profile;
  const { dataUserList } = props.user;
  const { dataListPartner } = props.partner;

  const newLineContact = null;
  const router = useRouter();
  const q: any = useMemo(() => router.query, [router]);
  const id = q?.id || "";
  const [initForm, setInitForm] = useState<InitData>(INIT_DATA);
  const [errorForm, setErrorForm] = useState(INIT_ERROR);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDealFormModal, setOpenDealFormModal] = useState<boolean>(false);
  const [openTaskFormModal, setOpenTaskModal] = useState<boolean>(false);
  const [isLoggedInUserId, setIsLoggedInUserId] = useState<any>();
  const [openContactFormModal, setOpenContactFormModal] =
    useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [value, setValue] = React.useState(0);
  const [pageOrderItem, setPageOrderItem] = useState<number>(1);
  const [querySearch, setQuerySearch] = useState<string>("");
  const [newLineDeal, setNewLineDeal] = useState<any>(null);
  const [applyData, setApplyData] = useState<boolean>(true);
  const tabRef = useRef<HTMLDivElement>(null);
  const [openModalDeleteNotification, setOpenModalDeleteNotification] =
    useState<boolean>(false);
  const [editDescriptionButton, setEditDescriptionButton] =
    useState<boolean>(false);

  const [showDetalCustomer, setShowDetailCustomer] = useState(false);
  const [idCustomerMerge, setIdCustomerMerge] = useState();

  const handleChange = useCallback(
    (event: any, newValue: any) => {
      removeQueryParam(router, ["view", "tab"]);
      setApplyData(false);
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          tab: newValue,
        },
      });
    },
    [router, removeQueryParam, setApplyData]
  );

  const handleModalDeleteCustomer = useCallback(() => {
    deleteCustomer(id);
  }, [deleteCustomer, id]);

  const handleDeleteCustomer = useCallback(() => {
    if (
      dataListDeals?.items.length ||
      dataListContacts?.items.length ||
      dataListOrders?.items.length ||
      dataListPayment?.data?.items.length ||
      dataInvoicesByCustomerId?.data?.items.length ||
      dataTaskObject?.items?.length
    ) {
      setOpenModalDeleteNotification(true);
    } else {
      setOpenDeleteModal(true);
    }
  }, [
    dataListDeals,
    dataListContacts,
    dataListOrders,
    dataListPayment,
    dataInvoicesByCustomerId,
    dataTaskObject,
    setOpenModalDeleteNotification,
    setOpenDeleteModal,
  ]);

  const [openModalUpdateCountry, setOpenModalUpdateCountry] =
    useState<boolean>(false);

  const [openModalDetailPayment, setOpenModalDetailPayment] =
    useState<boolean>(false);

  const [openModalUpdateCustomerName, setOpenModalUpdateCustomerName] =
    useState<boolean>(false);

  const [onOpenModalCustomer, setOnOpenModalCustomer] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openModalMerge, setOpenModalMerge] = React.useState(false);
  const [hiddenDetailCustomer, setHiddenDetailCustomer] = useState(false);
  const [hiddenInfoCustomer, setHiddenInfoCustomer] = useState(false);
  const [pageDeal, setPageDeal] = useState(1);
  const [pageOrder, setPageOrder] = useState(1);
  const [pageContact, setPageContact] = useState(1);

  useEffect(() => {
    searchCustomer();
  }, []);
  const [customerOptions, setCustomerOptions] = useState([]);

  useEffect(() => {
    if (dataCustomerList?.items) {
      const convert = dataCustomerList?.items.map(
        (key: {
          id: any;
          name: any;
          email: any;
          phone: any;
          website: any;
          country: any;
          city: any;
          level: any;
          address: any;
          postalCode: any;
        }) => {
          if (dataDetailCustomer?.id != key?.id) {
            return {
              id: key?.id,
              value: key?.id,
              label: key?.name,
              email: key?.email,
              phone: key?.phone,
              website: key?.website,
              country: key?.country?.name,
              city: key?.city?.name,
              level: key?.level?.name,
              address: key?.address,
              postalCode: key?.postalCode,
            };
          }
          return null;
        }
      );

      const filteredConvert = convert.filter((item: any) => item !== null); // Lọc bỏ các phần tử null

      setCustomerOptions(filteredConvert);
    }
  }, [dataCustomerList?.items, dataDetailCustomer?.id]);

  const handleAutocompleteChange = useCallback((event: any, data: any) => {
    if (data) {
      handleShowDetailCustomer(data);
    }
  }, []);

  const handleShowDetailCustomer = (item: any) => {
    setIdCustomerMerge(item);
    setShowDetailCustomer(true);
  };

  useEffect(() => {
    if (dataDeleteCustomer && !openDeleteModal) {
      router.push(`/customer`);
    }
  }, [dataDeleteCustomer, openDeleteModal]);

  useEffect(() => {
    if (router.query.tab === "lognote") {
      setValue(7);
    } else {
      const parsedTab = Number(router?.query?.tab);
      setValue(isNaN(parsedTab) ? 0 : parsedTab);
    }
  }, [router?.query]);

  useEffect(() => {
    const handlePopstate = () => {
      if (router?.query?.tab) {
        router.push({
          pathname: router.pathname,
          query: {
            ...router.query,
            tab: 0,
          },
        });
      }

      if (router?.query?.tab === "0") {
        router.push("/customer");
      }
    };

    window.addEventListener("popstate", handlePopstate);
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [router]);

  useEffect(() => {
    if (dataUpdateCustomer || dataDeleteCustomer || value !== 7) {
      if (router?.query?.view) {
        removeQueryParam(router, ["view"]);
      }
    }
  }, [dataUpdateCustomer, dataDeleteCustomer, value]);

  useEffect(() => {
    if (!dataDetailProfile) {
      getDetailProfile();
    } else {
      setIsLoggedInUserId(dataDetailProfile?.id);
    }
  }, [dataDetailProfile]);

  useEffect(() => {
    if (initForm?.countryId) {
      getCities(`${initForm?.countryId}`);
    }
  }, [initForm?.countryId]);

  useEffect(() => {
    if (!dataCustomerLevel) {
      searchCustomerLevel();
    }
    if (!dataSaleChannelList) {
      getSaleChannel();
    }
    if (router.query?.taskId) {
      setValue(6);
    }
  }, [router.query]);

  useEffect(() => {
    setInitForm({
      ...INIT_DATA,
      ...dataDetailCustomer,
      industryId: dataDetailCustomer?.industry?.id
        ? Number(dataDetailCustomer?.industry?.id)
        : null,
      employeeId: dataDetailCustomer?.employee?.id
        ? Number(dataDetailCustomer?.employee?.id)
        : null,
      countryId: dataDetailCustomer?.country?.id
        ? Number(dataDetailCustomer?.country?.id)
        : null,
      cityId: dataDetailCustomer?.city?.id
        ? Number(dataDetailCustomer?.city?.id)
        : null,
      currencyId: dataDetailCustomer?.currency?.id
        ? Number(dataDetailCustomer?.currency?.id)
        : null,
      cidCode: dataDetailCustomer?.cidCode ?? "",
      levelId: dataDetailCustomer?.level?.id ?? null,
      channelId: dataDetailCustomer?.channel?.id ?? null,
      priorityId: dataDetailCustomer?.priority
        ? Number(dataDetailCustomer?.priority)
        : null,
      assignedId: dataDetailCustomer?.userAssign
        ? Number(dataDetailCustomer?.userAssign?.id)
        : null,
      partnerId: dataDetailCustomer?.partners[0]?.partners?.id
        ? Number(dataDetailCustomer?.partners[0]?.partners?.id)
        : null,
      partnerSaleType: dataDetailCustomer?.partners[0]?.saleType
        ? Number(dataDetailCustomer?.partners[0]?.saleType)
        : null,
      partnerSalePercent: dataDetailCustomer?.partners[0]?.salePercent
        ? Number(dataDetailCustomer?.partners[0]?.salePercent)
        : null,
      saleStartDate: dataDetailCustomer?.partners[0]?.startDate
        ? dataDetailCustomer?.partners[0]?.startDate
        : "",
      saleEndDate: dataDetailCustomer?.partners[0]?.endDate
        ? dataDetailCustomer?.partners[0]?.endDate
        : "",
    });
  }, [dataDetailCustomer, editDescriptionButton]);

  // preview avatar
  const avatar = { preview: "" };

  useEffect(() => {
    return () => {
      avatar && URL.revokeObjectURL(avatar?.preview);
    };
  }, [avatar]);

  const optionUser = dataUserList?.items?.map(
    (key: { id: any; profile: any }) => ({
      id: key?.id,
      name: key?.profile?.first_name + key?.profile?.last_name,
      value: key?.id,
    })
  );

  useEffect(() => {
    setPageOrderItem(1);
  }, [value]);

  useEffect(() => {
    if (id && !dataPaymentList) {
      searchPayment(`customerId=${id}`);
      searchInvoices(`customerId=${id}`);
    }
  }, [id]);

  useEffect(() => {
    if (
      (id && applyData) ||
      (id && applyData && localStorage.getItem("languages"))
    ) {
      clearData("dataDetailCustomer");
      getDetailCustomer(id);
      getListContactByCustomerId(
        id,
        `limit=${rowsPerPage}&offset=${(pageOrderItem - 1) * rowsPerPage}`
      );
      getListDealByCustomerId(
        id,
        `limit=${rowsPerPage}&offset=${(pageOrderItem - 1) * rowsPerPage}`
      );
      getListOrderByCustomerId(
        id,
        `limit=${rowsPerPage}&offset=${(pageOrderItem - 1) * rowsPerPage}`
      );
      getInvoicesByCustomerId(
        id,
        `limit=${rowsPerPage}&offset=${(pageOrderItem - 1) * rowsPerPage}`
      );
      getListPaymentByCustomerId(
        id,
        `limit=${rowsPerPage}&offset=${(pageOrderItem - 1) * rowsPerPage}`
      );
      getObjectTask(
        `limit=${rowsPerPage}&offset=${
          (pageOrderItem - 1) * rowsPerPage
        }&customerId=${id}`
      );
    }
  }, [q, localStorage.getItem("languages")]);

  useEffect(() => {
    if (pageOrderItem && id) {
      switch (value) {
        case 1: {
          getListContactByCustomerId(
            id,
            `limit=${rowsPerPage}&offset=${(pageOrderItem - 1) * rowsPerPage}`
          );
          break;
        }
        case 2: {
          getListDealByCustomerId(
            id,
            `limit=${rowsPerPage}&offset=${(pageOrderItem - 1) * rowsPerPage}`
          );
          break;
        }
        case 3: {
          getListOrderByCustomerId(
            id,
            `limit=${rowsPerPage}&offset=${(pageOrderItem - 1) * rowsPerPage}`
          );
          break;
        }
        case 4: {
          getInvoicesByCustomerId(
            id,
            `limit=${rowsPerPage}&offset=${(pageOrderItem - 1) * rowsPerPage}`
          );
          break;
        }
        case 5: {
          getListPaymentByCustomerId(
            id,
            `limit=${rowsPerPage}&offset=${(pageOrderItem - 1) * rowsPerPage}`
          );
          break;
        }
        case 6: {
          getObjectTask(
            `limit=${rowsPerPage}&offset=${
              (pageOrderItem - 1) * rowsPerPage
            }&customerId=${id}`
          );
          break;
        }
        default: {
          return;
        }
      }
    }
  }, [pageOrderItem, value, id]);

  useEffect(() => {
    if (id) {
      getDetailCustomer(id);
    }
  }, [
    dataUpdateCustomer,
    dataCreateDeal,
    dataCreateContact,
    localStorage.getItem("languages"),
    dataCreateTask,
    showDetalCustomer,
  ]);

  useEffect(() => {
    if (id) {
      switch (value) {
        case 1: {
          dataListContacts ?? getListContactByCustomerId(id);
          break;
        }
        case 2: {
          dataListDeals ?? getListDealByCustomerId(id);
          break;
        }
        case 3: {
          dataListOrders ?? getListOrderByCustomerId(id);
          break;
        }
        case 4: {
          dataListPayment?.data ?? getInvoicesByCustomerId(id);
          break;
        }
        case 5: {
          dataListPayment?.data ?? getListPaymentByCustomerId(id);
          break;
        }
        case 6: {
          dataTaskObject ?? getObjectTask(`customerId=${id}`);
          break;
        }
        default: {
          break;
        }
      }
    }
  }, [value, id]);

  useEffect(() => {
    if (error === 404) {
      router.push("/404");
      clearData("error");
    }
  }, [error]);

  useEffect(() => {
    if (dataCid) {
      setInitForm({ ...initForm, ["cidCode"]: dataCid?.cidCode });
    }
  }, [dataCid]);

  useEffect(() => {
    if (error?.message) {
      setErrorForm({
        ...errorForm,
        ...error?.response?.data?.properties,
        ["message"]: error?.message,
      });
    } else {
      clearData("error");
      setErrorForm(INIT_ERROR);
    }
    if (dataUpdateCustomer) {
      clearData("dataUpdateCustomer");
      setOpenEditModal(false);
    }
    if (dataDeleteCustomer) {
      clearData("dataDeleteCustomer");
    }
  }, [error, dataUpdateCustomer, dataDeleteCustomer]);

  const handleInlineEditClose = (action: boolean, setAction: any) => {
    setAction(!action);
    clearData("dataUpdateCustomer");
  };

  const handleOpen = useCallback(() => {
    setOpenModalUpdateCountry(true);
  }, [setOpenModalUpdateCountry]);

  const handleEditCustomer = () => {
    handleClose();
    if (!openEditModal) {
      return setOpenEditModal(true);
    }
    if (
      openEditModal &&
      (initForm?.name !== String(dataDetailCustomer?.name) ||
        initForm?.industryId !==
          (dataDetailCustomer?.industry?.id
            ? Number(dataDetailCustomer?.industry?.id)
            : null) ||
        initForm?.capital !== dataDetailCustomer?.capital ||
        initForm?.employeeId !==
          (dataDetailCustomer?.employee?.id
            ? Number(dataDetailCustomer?.employee?.id)
            : null) ||
        initForm?.website !== dataDetailCustomer?.website ||
        initForm?.cityId !==
          (dataDetailCustomer?.city?.id
            ? Number(dataDetailCustomer?.city?.id)
            : null) ||
        initForm?.address !== dataDetailCustomer?.address ||
        initForm?.email != dataDetailCustomer?.email ||
        initForm?.countryId !==
          (dataDetailCustomer?.country?.id
            ? Number(dataDetailCustomer?.country?.id)
            : null) ||
        initForm?.currencyId !==
          (dataDetailCustomer?.currency?.id
            ? Number(dataDetailCustomer?.currency?.id)
            : null) ||
        initForm?.phone !== dataDetailCustomer?.phone ||
        initForm?.esTabLishMent !== dataDetailCustomer?.esTabLishMent ||
        initForm?.postalCode !== dataDetailCustomer?.postalCode ||
        initForm?.cidCode !== (dataDetailCustomer?.cidCode ?? "") ||
        initForm?.assignedId !== Number(dataDetailCustomer?.userAssign?.id) ||
        initForm?.priorityId !==
          (dataDetailCustomer?.priority
            ? Number(dataDetailCustomer?.priority)
            : dataDetailCustomer?.priority) ||
        initForm?.levelId !==
          (dataDetailCustomer?.level?.id
            ? dataDetailCustomer?.level?.id
            : null) ||
        initForm?.channelId !==
          Number(
            dataDetailCustomer?.channel?.id
              ? dataDetailCustomer?.channel?.id
              : null
          ))
    ) {
      updateCustomer(initForm, id);
    } else {
      setOpenEditModal(false);
    }
  };

  const handleChangeInput = useCallback(
    (key: any, value: any) => {
      setInitForm((prevInitForm) => ({
        ...prevInitForm,
        [key]: value ?? "",
      }));
    },
    [setInitForm]
  );

  useEffect(() => {
    if (openEditModal) {
      dataIndustryList ?? getIndustry();
      dataEmployeeList ?? getEmployee();
      dataCountryList ?? getCountries();
      dataCurrencyList ?? getCurrencyList();
      dataUserList ?? searchUser();
      dataListPartner ?? listPartner();
      setOnOpenModalCustomer(true);
      setOpenModalUpdateCustomerName(false);
    } else {
      if (dataUpdateCustomer) clearData("dataUpdateCustomer");
      setErrorForm(INIT_ERROR);
    }
  }, [openEditModal]);

  useEffect(() => {
    if (dataCreateDeal) {
      setNewLineDeal(null);
      getListDealByCustomerId(
        id,
        `limit=${rowsPerPage}&offset=${(pageOrderItem - 1) * rowsPerPage}`
      );
    }
  }, [dataCreateDeal]);

  useEffect(() => {
    if (dataCreateContact) {
      setNewLineDeal(null);
      getListContactByCustomerId(
        id,
        `limit=${rowsPerPage}&offset=${(pageOrderItem - 1) * rowsPerPage}`
      );
    }
  }, [dataCreateContact]);

  useEffect(() => {
    if (dataCreateTask) {
      getObjectTask(
        `limit=${rowsPerPage}&offset=${
          (pageOrderItem - 1) * rowsPerPage
        }&customerId=${id}`
      );
    }
  }, [dataCreateTask]);

  const handleOpenForm = useCallback(() => {
    setOpenDealFormModal(true);
  }, []);

  const handleChangeSelect = useCallback(
    (key: any, value: any) => {
      if (key === "countryId") {
        getCid(value);
      }
      setInitForm((prevInitForm) => ({
        ...prevInitForm,
        [key]: Number(value),
      }));
    },
    [getCid, setInitForm]
  );

  const handleEditDescription = useCallback(() => {
    setEditDescriptionButton(
      (prevEditDescriptionButton) => !prevEditDescriptionButton
    );
    if (
      editDescriptionButton &&
      (checkChangeDataBeforeUpdate(initForm, dataDetailCustomer) ||
        initForm?.description !== String(dataDetailCustomer?.description))
    ) {
      updateCustomer(initForm, id);
    }
    handleInlineEditClose(editDescriptionButton, setEditDescriptionButton);
  }, [
    setEditDescriptionButton,
    editDescriptionButton,
    checkChangeDataBeforeUpdate,
    initForm,
    dataDetailCustomer,
    updateCustomer,
    id,
    handleInlineEditClose,
  ]);

  useEffect(() => {
    if (errors != undefined && errors.statusCode == statusCode.NOT_FOUND)
      router.push("/404");
  }, [errors]);

  const handleOpenFormTask = useCallback(
    (action: any) => {
      setOpenTaskModal(action);
    },
    [setOpenTaskModal]
  );

  const handleOpenFormContact = useCallback(() => {
    setOpenContactFormModal(true);
  }, [setOpenContactFormModal]);

  useEffect(() => {
    if (initForm.countryId) {
      setInitForm({
        ...initForm,
        cityId: null,
      });
    }
  }, [initForm.countryId]);

  const trans = useTrans();

  const handleDetailpayment = async (id: any) => {
    clearData("dataPayment");
    await getPayment(id, `limit=6&offset=0`);
    setOpenModalDetailPayment(true);
  };

  const optionPartner = dataListPartner?.data?.items?.map(
    (key: { id: any; name: any }) => ({
      id: key?.id,
      name: key?.name,
      value: key?.id,
    })
  );

  useEffect(() => {
    if (initForm?.partnerSaleType === partnerSaleOption.TOTAL_PAYMENT_REVENUE) {
      setInitForm({
        ...initForm,
        saleStartDate: "",
        saleEndDate: "",
      });
    }
  }, [initForm?.partnerSaleType]);

  const convertSaleType = (saleType: any) => {
    if (saleType == 1) {
      return trans.partner.TOTAL_PAYMENT_REVENUE;
    } else if (saleType == 2) {
      return trans.partner.TOTAL_PAYMENT_BY_PERIOD;
    } else {
      return "";
    }
  };

  const convertTotal = (total: any, sign: any) => {
    if (sign) {
      return `${formatCurrencyValue(total)} ${sign}`;
    } else {
      return formatCurrencyValue(total);
    }
  };

  const CUSTOMER_PARTNER_LIST = [
    {
      id: 1,
      value: 1,
      label: "Total order revenue",
      name: trans.partner.TOTAL_PAYMENT_REVENUE,
    },
    {
      id: 2,
      value: 2,
      label: "Total revenue by period",
      name: trans.partner.TOTAL_PAYMENT_BY_PERIOD,
    },
  ];

  const renderInput = useCallback(
    (params: any) => <TextField {...params} label={trans.menu.customer} />,
    []
  );

  // Menu
  const open = Boolean(anchorEl);
  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // Modal Merger Customer
  const handleCloseModalMerger = useCallback(() => {
    setOpenModalMerge(false);
  }, []);

  const openModalMerCustomer = useCallback(() => {
    setOpenModalMerge(true);
  }, []);

  // hidden and show
  const handleShowMoreDetail = useCallback(() => {
    setHiddenDetailCustomer((prev: any) => !prev);
  }, [hiddenInfoCustomer]);

  const handleShowMoreInfo = useCallback(() => {
    setHiddenInfoCustomer((prev: any) => !prev);
  }, [hiddenInfoCustomer]);

  const handleChangeDealPage = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setPageDeal(value);
    },
    []
  );

  const startIndexDeal = (pageDeal - 1) * 5;
  const endIndexDeal = startIndexDeal + 5;
  const currentItemsDeal = dataListDeals?.items.slice(
    startIndexDeal,
    endIndexDeal
  );

  /// Page Order
  const handleChangeOrderPage = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setPageOrder(value);
    },
    []
  );

  const startIndexOrder = (pageOrder - 1) * 5;
  const endIndexOrder = startIndexOrder + 5;
  const currentItemsOrder = dataListOrders?.items.slice(
    startIndexOrder,
    endIndexOrder
  );

  /// Page Contact
  const handleChangeContactPage = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setPageContact(value);
    },
    []
  );

  const startIndexContact = (pageContact - 1) * 5;
  const endIndexContact = startIndexContact + 5;
  const currentItemsContact = dataListContacts?.items.slice(
    startIndexContact,
    endIndexContact
  );

  useEffect(() => {
    handleClose();
  }, [dataCreateContact, dataCreateDeal]);

  if (id) {
    return (
      <div>
        <HeadMeta
          title={trans.menu.customer}
          param={dataDetailCustomer?.name}
        />
        <Breadcrumb
          title={dataDetailCustomer?.name}
          prevPage={trans.menu.customer}
          icon={<IconBuildingCommunity className={styles["icons"]} />}
        />

        <Box
          sx={{
            padding: "10px",
            borderRadius: "12px",
            backgroundColor: "white",
            marginTop: 3,
            display: "flex",
          }}
        >
          <Box sx={{ width: "99%" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              TabIndicatorProps={{
                style: { display: "none" },
              }}
              className={styles.boxTab}
            >
              <Tab
                label={trans.customer_detail.customer_details}
                id="simple-tab-0"
              />
              <Tab
                sx={{ display: "none" }}
                label={trans.menu.contact}
                id="simple-tab-1"
              />
              <Tab
                sx={{ display: "none" }}
                label={trans.menu.deal}
                id="simple-tab-2"
              />
              <Tab
                sx={{ display: "none" }}
                label={trans.menu.order}
                id="simple-tab-3"
              />
              <Tab label={trans.menu.invoice} id="simple-tab-4" />
              <Tab label={trans.menu.payment} id="simple-tab-5" />
              <Tab label={trans.menu.task} id="simple-tab-6" />
              <Tab
                sx={{ display: "none" }}
                label={trans.menu.lognote}
                id="simple-tab-7"
              />
            </Tabs>
          </Box>

          <Box>
            {value == 0 && (
              <Box>
                {openEditModal && (
                  <span
                    style={{
                      color: "gray",
                      marginTop: "12px",
                      cursor: "pointer",
                      display: "inline-block",
                    }}
                    onClick={() => handleEditCustomer()}
                  >
                    <SaveIcon />
                  </span>
                )}
                {!openEditModal && (
                  <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? "long-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}

                <Menu
                  sx={{ marginLeft: "-36px" }}
                  id="long-menu"
                  MenuListProps={{
                    "aria-labelledby": "long-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleOpenForm}>
                    <AddIcon />
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "10px",
                      }}
                    >
                      {trans.deal.add_deal}
                    </span>
                  </MenuItem>
                  <MenuItem onClick={handleOpenFormContact}>
                    <AddIcCallOutlinedIcon />
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "10px",
                      }}
                    >
                      {trans.customer_detail.add_new_contact}
                    </span>
                  </MenuItem>
                  <MenuItem onClick={openModalMerCustomer}>
                    <CallMergeIcon />{" "}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "10px",
                      }}
                    >
                      {trans.customer.merge_customer}
                    </span>
                  </MenuItem>
                  <MenuItem onClick={() => handleEditCustomer()}>
                    {!openEditModal && <EditIcon />}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "10px",
                      }}
                    >
                      {trans.customer.edit_customer}
                    </span>
                  </MenuItem>
                  <MenuItem
                    sx={{ color: "#e74c3c" }}
                    onClick={handleDeleteCustomer}
                  >
                    <DeleteOutlineOutlinedIcon />{" "}
                    <span
                      style={{
                        color: "#e74c3c",
                        display: "inline-block",
                        marginLeft: "10px",
                      }}
                    >
                      {trans.customer.delete}
                    </span>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Box>

        <Box className={styles["contact-wrapper"]}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12}>
              <Box ref={tabRef}>
                <Box className={styles.boxGuide}>
                  <Box className={styles.boxTabPanel}>
                    <TabPanel value={value} index={TAB_LOG_CUSTOMER_DETAIL}>
                      <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                      >
                        <Grid item xs={6}>
                          <Box
                            sx={{
                              padding: "20px",
                              borderRadius: "12px",
                              backgroundColor: "white",
                              height: hiddenDetailCustomer ? "700px" : "400px",
                            }}
                          >
                            <Box>
                              <Box>
                                <Grid>
                                  <Box>
                                    <Typography
                                      sx={{
                                        padding: "2px",
                                        fontWeight: "700",
                                        paddingLeft: "10px",
                                        borderRadius: "5px",
                                        paddingBottom: "12px",
                                        paddingTop: "12px",
                                        background:
                                          "linear-gradient(93deg, rgba(232,232,232,1) 0%, rgba(245,240,240,0.41208202030812324) 43%, rgba(255,255,255,1) 100%)",
                                      }}
                                    >
                                      {trans.customer_detail.customer_details}
                                    </Typography>
                                  </Box>
                                </Grid>

                                <Grid
                                  container
                                  className={styles["contact-detail-row"]}
                                >
                                  <Grid
                                    item
                                    md={4}
                                    xs
                                    className={styles["contact-detail-title"]}
                                    sx={{ color: "gray" }}
                                  >
                                    {trans.customer.customer_name}
                                  </Grid>

                                  {openEditModal ? (
                                    <Grid item xs={6}>
                                      <div
                                        onClick={() => {
                                          setOpenModalUpdateCustomerName(true);
                                        }}
                                      >
                                        <InputBase
                                          keyword="name"
                                          size="small"
                                          value={initForm?.name}
                                          handleChange={handleChangeInput}
                                          errorText={getFirstValueInObject(
                                            errorForm?.name
                                          )}
                                        />
                                      </div>
                                    </Grid>
                                  ) : (
                                    <Grid item xs>
                                      {dataDetailCustomer?.name}
                                    </Grid>
                                  )}
                                </Grid>

                                <Grid
                                  container
                                  className={styles["contact-detail-row"]}
                                >
                                  <Grid
                                    item
                                    md={4}
                                    xs
                                    className={styles["contact-detail-title"]}
                                    sx={{ color: "gray" }}
                                  >
                                    {trans.customer.sub_name}
                                  </Grid>
                                  {openEditModal ? (
                                    <Grid item xs={6}>
                                      <div
                                        onClick={() => {
                                          setOpenModalUpdateCustomerName(true);
                                        }}
                                      >
                                        <InputBase
                                          keyword="subName"
                                          size="small"
                                          value={initForm?.subName}
                                          handleChange={handleChangeInput}
                                          errorText={getFirstValueInObject(
                                            errorForm?.subName
                                          )}
                                        />
                                      </div>
                                    </Grid>
                                  ) : (
                                    <Grid item xs>
                                      {dataDetailCustomer?.subName}
                                    </Grid>
                                  )}
                                </Grid>

                                <Grid
                                  container
                                  className={styles["contact-detail-row"]}
                                >
                                  <Grid
                                    item
                                    md={4}
                                    xs
                                    className={styles["contact-detail-title"]}
                                    sx={{ color: "gray" }}
                                  >
                                    {trans.customer_detail.customer_level}
                                  </Grid>
                                  {openEditModal ? (
                                    <Grid item xs={6}>
                                      <SelectDefault
                                        keyword="levelId"
                                        keyMenuItem="id"
                                        keyValue="name"
                                        data={dataCustomerLevel}
                                        value={initForm?.levelId}
                                        handleChange={handleChangeSelect}
                                        size="small"
                                      />
                                    </Grid>
                                  ) : (
                                    <Grid item xs>
                                      {dataDetailCustomer?.level?.name} -{" "}
                                      {dataDetailCustomer?.level?.description}
                                    </Grid>
                                  )}
                                </Grid>

                                <Grid
                                  container
                                  className={styles["contact-detail-row"]}
                                >
                                  <Grid
                                    item
                                    md={4}
                                    xs
                                    className={styles["contact-detail-title"]}
                                    sx={{ color: "gray" }}
                                  >
                                    {trans.customer_detail.establishment}
                                  </Grid>
                                  {openEditModal ? (
                                    <Grid
                                      item
                                      xs={6}
                                      className={styles["contact-detail-title"]}
                                    >
                                      <DatePickerDefault
                                        handleChange={handleChangeInput}
                                        value={initForm?.esTabLishMent}
                                        keyword="esTabLishMent"
                                        size="small"
                                        errorText={getFirstValueInObject(
                                          errorForm?.esTabLishMent
                                        )}
                                      />
                                    </Grid>
                                  ) : (
                                    <Grid
                                      item
                                      xs
                                      className={styles["contact-detail-title"]}
                                    >
                                      {dataDetailCustomer?.esTabLishMent}
                                    </Grid>
                                  )}
                                </Grid>

                                <Grid
                                  container
                                  className={styles["contact-detail-row"]}
                                >
                                  <Grid
                                    item
                                    md={4}
                                    xs
                                    className={styles["contact-detail-title"]}
                                    sx={{ color: "gray" }}
                                  >
                                    {trans.customer_detail.industry}
                                  </Grid>
                                  {openEditModal ? (
                                    <Grid item xs={6}>
                                      <SelectDefault
                                        keyword="industryId"
                                        keyMenuItem="id"
                                        keyValue="name"
                                        data={dataIndustryList}
                                        value={initForm?.industryId}
                                        handleChange={handleChangeSelect}
                                        size="small"
                                      />
                                    </Grid>
                                  ) : (
                                    <Grid item xs>
                                      {dataDetailCustomer?.industry?.name}
                                    </Grid>
                                  )}
                                </Grid>

                                {hiddenDetailCustomer && (
                                  <Box>
                                    <Grid
                                      container
                                      className={styles["contact-detail-row"]}
                                    >
                                      <Grid
                                        item
                                        md={4}
                                        xs
                                        className={
                                          styles["contact-detail-title"]
                                        }
                                        sx={{ color: "gray" }}
                                      >
                                        {trans.customer_detail.currency}
                                      </Grid>
                                      {openEditModal ? (
                                        <Grid item xs={6}>
                                          <SelectDefault
                                            keyword="currencyId"
                                            size="small"
                                            keyMenuItem="id"
                                            keyValue="name"
                                            value={initForm?.currencyId}
                                            data={dataCurrencyList}
                                            handleChange={handleChangeSelect}
                                          />
                                        </Grid>
                                      ) : (
                                        <Grid item xs>
                                          {dataDetailCustomer?.currency?.name}
                                        </Grid>
                                      )}
                                    </Grid>

                                    <Grid
                                      container
                                      className={styles["contact-detail-row"]}
                                    >
                                      <Grid
                                        item
                                        md={4}
                                        xs
                                        className={
                                          styles["contact-detail-title"]
                                        }
                                        sx={{ color: "gray" }}
                                      >
                                        {trans.customer_detail.capital}
                                      </Grid>
                                      {openEditModal ? (
                                        <Grid item xs={6}>
                                          <InputFormatNumber
                                            keyword="capital"
                                            size="small"
                                            value={initForm?.capital}
                                            handleChange={handleChangeInput}
                                          />
                                        </Grid>
                                      ) : (
                                        <Grid item xs>
                                          {dataDetailCustomer?.capital}
                                        </Grid>
                                      )}
                                    </Grid>

                                    <Grid
                                      container
                                      className={styles["contact-detail-row"]}
                                    >
                                      <Grid
                                        item
                                        md={4}
                                        xs
                                        className={
                                          styles["contact-detail-title"]
                                        }
                                        sx={{ color: "gray" }}
                                      >
                                        {trans.customer_detail.phone}
                                      </Grid>
                                      {openEditModal ? (
                                        <Grid item xs={6}>
                                          <InputBase
                                            keyword="phone"
                                            size="small"
                                            value={initForm?.phone}
                                            handleChange={handleChangeInput}
                                            errorText={getFirstValueInObject(
                                              errorForm?.phone
                                            )}
                                          />
                                        </Grid>
                                      ) : (
                                        <Grid item xs>
                                          {dataDetailCustomer?.phone}
                                        </Grid>
                                      )}
                                    </Grid>

                                    <Grid
                                      container
                                      className={styles["contact-detail-row"]}
                                    >
                                      <Grid
                                        item
                                        md={4}
                                        xs
                                        className={
                                          styles["contact-detail-title"]
                                        }
                                        sx={{ color: "gray" }}
                                      >
                                        {trans.customer_detail.employee}
                                      </Grid>
                                      {openEditModal ? (
                                        <Grid item xs={6}>
                                          <SelectDefault
                                            keyword="employeeId"
                                            keyMenuItem="id"
                                            keyValue="name"
                                            data={dataEmployeeList}
                                            value={initForm?.employeeId}
                                            handleChange={handleChangeSelect}
                                            size="small"
                                          />
                                        </Grid>
                                      ) : (
                                        <Grid item xs>
                                          {dataDetailCustomer?.employee
                                            ?.start_number
                                            ? dataDetailCustomer?.employee
                                                ?.start_number + " ~ "
                                            : ""}
                                          {dataDetailCustomer?.employee
                                            ?.end_number != 99999
                                            ? dataDetailCustomer?.employee
                                                ?.end_number
                                            : ""}
                                        </Grid>
                                      )}
                                    </Grid>

                                    <Grid
                                      container
                                      className={styles["contact-detail-row"]}
                                    >
                                      <Grid
                                        item
                                        md={4}
                                        xs
                                        className={
                                          styles["contact-detail-title"]
                                        }
                                        sx={{ color: "gray" }}
                                      >
                                        {trans.customer_detail.assigned}
                                      </Grid>
                                      {openEditModal ? (
                                        <Grid item xs={6}>
                                          <SelectDefault
                                            keyword="assignedId"
                                            keyMenuItem="id"
                                            keyValue="name"
                                            data={optionUser}
                                            value={initForm?.assignedId}
                                            handleChange={handleChangeSelect}
                                            size="small"
                                          />
                                        </Grid>
                                      ) : (
                                        <Grid item xs>
                                          {dataDetailCustomer?.userAssign
                                            ? dataDetailCustomer?.userAssign
                                                ?.profile?.first_name +
                                              dataDetailCustomer?.userAssign
                                                ?.profile?.last_name
                                            : " "}
                                        </Grid>
                                      )}
                                    </Grid>

                                    <Grid
                                      container
                                      className={styles["contact-detail-row"]}
                                    >
                                      <Grid
                                        item
                                        md={4}
                                        xs
                                        className={
                                          styles["contact-detail-title"]
                                        }
                                        sx={{ color: "gray" }}
                                      >
                                        {trans.customer_detail.priority}
                                      </Grid>
                                      {openEditModal ? (
                                        <Grid item xs={6}>
                                          <SelectDefault
                                            keyword="priorityId"
                                            keyMenuItem="id"
                                            keyValue="name"
                                            data={CUSTOMER_PRIORITY_LIST}
                                            value={initForm?.priorityId}
                                            handleChange={handleChangeSelect}
                                            size="small"
                                          />
                                        </Grid>
                                      ) : (
                                        <Grid item xs>
                                          <Chip
                                            label={
                                              initForm?.priorityId
                                                ? CUSTOMER_PRIORITY_LIST[
                                                    initForm?.priorityId - 1
                                                  ]?.label
                                                : ""
                                            }
                                            style={{
                                              background: initForm?.priorityId
                                                ? CUSTOMER_PRIORITY_LIST[
                                                    initForm?.priorityId - 1
                                                  ]?.backgroundcolor
                                                : "",
                                              color: initForm?.priorityId
                                                ? CUSTOMER_PRIORITY_LIST[
                                                    initForm?.priorityId - 1
                                                  ]?.color
                                                : "",
                                            }}
                                          />
                                        </Grid>
                                      )}
                                    </Grid>
                                  </Box>
                                )}
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                cursor: "pointer",
                                textAlign: "center",
                              }}
                              onClick={handleShowMoreDetail}
                            >
                              {!hiddenDetailCustomer ? (
                                <ExpandMoreIcon />
                              ) : (
                                <KeyboardArrowUpIcon />
                              )}
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={6}>
                          <Box
                            sx={{
                              padding: "20px",
                              borderRadius: "12px",
                              backgroundColor: "white",
                              height: hiddenInfoCustomer ? "700px" : "400px",
                            }}
                          >
                            <Box>
                              <Grid
                                container
                                className={styles["contact-detail-row"]}
                              >
                                <Grid
                                  container
                                  className={styles["contact-detail-row"]}
                                >
                                  <Box>
                                    <Typography
                                      sx={{
                                        padding: "2px",
                                        fontWeight: "700",
                                        paddingLeft: "10px",
                                        borderRadius: "5px",
                                        paddingBottom: "12px",
                                        paddingTop: "12px",
                                        background:
                                          "linear-gradient(93deg, rgba(232,232,232,1) 0%, rgba(245,240,240,0.41208202030812324) 43%, rgba(255,255,255,1) 100%)",
                                          width:'400%'
                                      }}
                                    >
                                      {trans.customer_detail.address_infomation}
                                    </Typography>
                                  </Box>
                                </Grid>

                                <Grid
                                  item
                                  md={4}
                                  xs
                                  className={styles["contact-detail-title"]}
                                  sx={{ color: "gray" }}
                                >
                                  {trans.customer_detail.country}
                                </Grid>
                                {openEditModal ? (
                                  <Grid item xs={6}>
                                    <SelectDefault
                                      keyword="countryId"
                                      keyMenuItem="id"
                                      keyValue="name"
                                      data={dataCountryList}
                                      value={initForm?.countryId}
                                      handleOpen={handleOpen}
                                      handleChange={handleChangeSelect}
                                      size="small"
                                    />
                                  </Grid>
                                ) : (
                                  <Grid item xs>
                                    {dataDetailCustomer?.country?.name}
                                  </Grid>
                                )}
                              </Grid>

                              <Grid
                                container
                                className={styles["contact-detail-row"]}
                              >
                                <Grid
                                  item
                                  md={4}
                                  xs
                                  className={styles["contact-detail-title"]}
                                  sx={{ color: "gray" }}
                                >
                                  {trans.customer_detail.cid}
                                </Grid>
                                {openEditModal ? (
                                  <Grid item xs={6}>
                                    <InputFormatNumber
                                      keyword="cidCode"
                                      size="small"
                                      value={initForm?.cidCode}
                                      handleChange={handleChangeInput}
                                      disable={true}
                                      errorText={getFirstValueInObject(
                                        errorForm?.cidCode
                                      )}
                                    />
                                  </Grid>
                                ) : (
                                  <Grid item xs>
                                    {dataDetailCustomer?.country?.name &&
                                      dataDetailCustomer?.cidCode &&
                                      dataDetailCustomer?.country?.name +
                                        "-" +
                                        dataDetailCustomer?.cidCode}
                                  </Grid>
                                )}
                              </Grid>

                              <Grid
                                container
                                className={styles["contact-detail-row"]}
                              >
                                <Grid
                                  item
                                  md={4}
                                  xs
                                  className={styles["contact-detail-title"]}
                                  sx={{ color: "gray" }}
                                >
                                  {trans.customer_detail.province}
                                </Grid>
                                {openEditModal ? (
                                  <Grid item xs={6}>
                                    <SelectDefault
                                      keyword="cityId"
                                      keyMenuItem="id"
                                      keyValue="name"
                                      disabled={
                                        (!dataDetailCustomer?.country?.id &&
                                          !initForm?.countryId) ||
                                        dataCityList?.length === 0
                                      }
                                      data={dataCityList}
                                      value={initForm?.cityId}
                                      handleChange={handleChangeSelect}
                                      size="small"
                                    />
                                  </Grid>
                                ) : (
                                  <Grid item xs>
                                    {dataDetailCustomer?.city?.name}
                                  </Grid>
                                )}
                              </Grid>

                              <Grid
                                container
                                className={styles["contact-detail-row"]}
                              >
                                <Grid
                                  item
                                  md={4}
                                  xs
                                  className={styles["contact-detail-title"]}
                                  sx={{ color: "gray" }}
                                >
                                  {trans.customer_detail.channel}
                                </Grid>
                                {openEditModal ? (
                                  <Grid item xs={6}>
                                    <SelectDefault
                                      keyword="channelId"
                                      keyMenuItem="id"
                                      keyValue="name"
                                      data={dataSaleChannelList}
                                      value={initForm?.channelId}
                                      handleChange={handleChangeSelect}
                                      size="small"
                                    />
                                  </Grid>
                                ) : (
                                  <Grid item xs>
                                    {dataDetailCustomer?.channel?.name}
                                  </Grid>
                                )}
                              </Grid>

                              <Grid
                                container
                                className={styles["contact-detail-row"]}
                              >
                                <Grid
                                  item
                                  md={4}
                                  xs
                                  className={styles["contact-detail-title"]}
                                  sx={{ color: "gray" }}
                                >
                                  {trans.customer_detail.postal_code}
                                </Grid>
                                {!openEditModal ? (
                                  <Grid item xs>
                                    {dataDetailCustomer?.postalCode}
                                  </Grid>
                                ) : (
                                  <Grid item xs={6}>
                                    <InputBase
                                      keyword="postalCode"
                                      size="small"
                                      value={initForm?.postalCode}
                                      handleChange={handleChangeInput}
                                    />
                                  </Grid>
                                )}
                              </Grid>

                              {hiddenInfoCustomer && (
                                <Box>
                                  <Grid
                                    container
                                    className={styles["contact-detail-row"]}
                                  >
                                    <Grid
                                      item
                                      md={4}
                                      xs
                                      className={styles["contact-detail-title"]}
                                      sx={{ color: "gray" }}
                                    >
                                      {trans.customer_detail.address}
                                    </Grid>
                                    {openEditModal ? (
                                      <Grid item xs={6}>
                                        <InputBase
                                          keyword="address"
                                          size="small"
                                          dataDetailCustomer
                                          value={initForm?.address}
                                          handleChange={handleChangeInput}
                                        />
                                      </Grid>
                                    ) : (
                                      <Grid item xs>
                                        {dataDetailCustomer?.address}
                                      </Grid>
                                    )}
                                  </Grid>

                                  <Grid
                                    container
                                    className={styles["contact-detail-row"]}
                                  >
                                    <Grid
                                      item
                                      md={4}
                                      xs
                                      className={styles["contact-detail-title"]}
                                      sx={{ color: "gray" }}
                                    >
                                      {trans.customer_detail.email}
                                    </Grid>
                                    {openEditModal ? (
                                      <Grid item xs={6}>
                                        <InputBase
                                          keyword="email"
                                          size="small"
                                          value={initForm?.email}
                                          handleChange={handleChangeInput}
                                          errorText={getFirstValueInObject(
                                            errorForm?.email
                                          )}
                                        />
                                      </Grid>
                                    ) : (
                                      <Grid item xs>
                                        {dataDetailCustomer?.email}
                                      </Grid>
                                    )}
                                  </Grid>

                                  <Grid
                                    container
                                    className={styles["contact-detail-row"]}
                                  >
                                    <Grid
                                      item
                                      md={4}
                                      xs
                                      className={styles["contact-detail-title"]}
                                      sx={{ color: "gray" }}
                                    >
                                      {trans.customer_detail.website}
                                    </Grid>
                                    {openEditModal ? (
                                      <Grid item xs={6}>
                                        <InputBase
                                          keyword="website"
                                          size="small"
                                          value={initForm?.website}
                                          handleChange={handleChangeInput}
                                        />
                                      </Grid>
                                    ) : (
                                      <Grid item xs>
                                        {dataDetailCustomer?.website && (
                                          <Link
                                            href={dataDetailCustomer?.website}
                                          >
                                            <a
                                              className="text-cursor"
                                              target="_blank"
                                            >
                                              {dataDetailCustomer?.website}
                                            </a>
                                          </Link>
                                        )}
                                      </Grid>
                                    )}
                                  </Grid>
                                </Box>
                              )}

                              <Box
                                sx={{
                                  cursor: "pointer",
                                  textAlign: "center",
                                  paddingTop: hiddenInfoCustomer ? "165px" : "",
                                }}
                                onClick={handleShowMoreInfo}
                              >
                                {!hiddenInfoCustomer ? (
                                  <ExpandMoreIcon />
                                ) : (
                                  <KeyboardArrowUpIcon />
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={6}>
                          <Box
                            sx={{
                              padding: "20px",
                              borderRadius: "12px",
                              backgroundColor: "white",
                              marginTop: 3,
                              height: "500px",
                            }}
                          >
                            <Box sx={{ height: "400px" }}>
                              <Typography
                                variant="body1"
                                color="initial"
                                sx={{
                                  padding: "2px",
                                  fontWeight: "700",
                                  paddingLeft: "10px",
                                  borderRadius: "5px",
                                  paddingBottom: "12px",
                                  paddingTop: "12px",
                                  background:
                                    "linear-gradient(93deg, rgba(232,232,232,1) 0%, rgba(245,240,240,0.41208202030812324) 43%, rgba(255,255,255,1) 100%)",
                                }}
                              >
                                {trans.menu.deal}
                              </Typography>
                              <Table aria-label="simple table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell width="5%">#</TableCell>
                                    <TableCell width="30%">
                                      {trans.customer.name}
                                    </TableCell>

                                    <TableCell width="30%">
                                      {trans.deal.forecast_close_date}
                                    </TableCell>
                                    <TableCell width="20%">Giá</TableCell>

                                    <TableCell width="15%">
                                      {newLineDeal
                                        ? trans.task.actions
                                        : trans.deal.status}
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {currentItemsDeal?.map(
                                    (item: any, index: any) => (
                                      <TableRow
                                        key={item?.title}
                                        sx={{
                                          "&:last-child td, &:last-child th": {
                                            border: 0,
                                          },
                                        }}
                                      >
                                        <TableCell>
                                          {(pageOrderItem - 1) * rowsPerPage +
                                            index +
                                            1}
                                        </TableCell>
                                        <TableCell
                                          className="text-cursor"
                                          component="th"
                                          scope="row"
                                        >
                                          <Link
                                            href={
                                              window.location.origin +
                                              "/deals/" +
                                              item?.id
                                            }
                                          >
                                            {item?.name}
                                          </Link>
                                        </TableCell>

                                        <TableCell>
                                          {fomatDate(item?.forecastCloseDate)}
                                        </TableCell>
                                        <TableCell>
                                          {formatCurrencyValue(item?.price) ??
                                            ""}{" "}
                                          {item?.price != null
                                            ? item?.currency?.sign
                                            : ""}
                                        </TableCell>

                                        <TableCell>
                                          {item?.status?.name && (
                                            <div
                                              style={{
                                                color: `${item?.status?.colorCode}`,
                                              }}
                                            >
                                              {item?.status?.name}
                                            </div>
                                          )}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: "700" }}>
                                          {item?.ratePoint > 0
                                            ? item?.ratePoint + " pt"
                                            : ""}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                  {newLineDeal}
                                </TableBody>
                              </Table>
                            </Box>
                            <Box>
                              {dataListDeals?.items.length > 5 && (
                                <Stack sx={{ textAlign: "center" }} spacing={2}>
                                  <Pagination
                                    count={Math.round(
                                      dataListDeals?.items.length / 5 + 1
                                    )}
                                    page={pageDeal}
                                    onChange={handleChangeDealPage}
                                  />
                                </Stack>
                              )}
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={6}>
                          <Box
                            sx={{
                              padding: "20px",
                              borderRadius: "12px",
                              backgroundColor: "white",
                              marginTop: 3,
                              height: "500px",
                            }}
                          >
                            <Box sx={{ height: "400px" }}>
                              <Typography
                                variant="body1"
                                color="initial"
                                sx={{
                                  padding: "2px",
                                  fontWeight: "700",
                                  paddingLeft: "10px",
                                  borderRadius: "5px",
                                  paddingBottom: "12px",
                                  paddingTop: "12px",
                                  background:
                                    "linear-gradient(93deg, rgba(232,232,232,1) 0%, rgba(245,240,240,0.41208202030812324) 43%, rgba(255,255,255,1) 100%)",
                                }}
                              >
                                {trans.menu.order}
                              </Typography>
                              <Table aria-label="simple table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell width="1%">#</TableCell>
                                    <TableCell width="5%">
                                      {trans.order.title}
                                    </TableCell>
                                    <TableCell width="20%">
                                      {trans.deal.order_manager}
                                    </TableCell>
                                    <TableCell width="15%">
                                      {trans.order.created_at}
                                    </TableCell>
                                    <TableCell width="15%">
                                      {trans.order.delivery_date}
                                    </TableCell>
                                    <TableCell width="17%">
                                      {trans.order.status}
                                    </TableCell>
                                  </TableRow>
                                </TableHead>

                                <TableBody>
                                  {currentItemsOrder?.map(
                                    (item: any, index: any) => (
                                      <TableRow
                                        key={item?.title}
                                        sx={{
                                          "&:last-child td, &:last-child th": {
                                            border: 0,
                                          },
                                        }}
                                      >
                                        <TableCell>
                                          {(pageOrderItem - 1) * rowsPerPage +
                                            index +
                                            1}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                          <Link
                                            href={
                                              window.location.origin +
                                              "/order/" +
                                              item?.id
                                            }
                                          >
                                            {item?.name}
                                          </Link>
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                          {item?.orderManager}
                                        </TableCell>
                                        <TableCell>
                                          {fomatDate(
                                            item?.createdAt.slice(0, 10)
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          {fomatDate(item?.deleveryDate)}
                                        </TableCell>
                                        <TableCell sx={{ width: 250 }}>
                                          {item?.status?.name && (
                                            <div
                                              className={`text-align-center ${styles["list-status"]} `}
                                              style={{
                                                color: `${item?.status?.colorCode}`,
                                                fontWeight: 700,
                                              }}
                                            >
                                              {item?.status?.name}
                                            </div>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </Box>
                            <Box>
                              {dataListOrders?.items.length > 5 && (
                                <Stack sx={{ textAlign: "center" }} spacing={2}>
                                  <Pagination
                                    count={Math.round(
                                      dataListOrders?.items.length / 5 + 1
                                    )}
                                    page={pageOrder}
                                    onChange={handleChangeOrderPage}
                                  />
                                </Stack>
                              )}
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={6}>
                          <Box
                            sx={{
                              padding: "20px",
                              borderRadius: "12px",
                              backgroundColor: "white",
                              height: "500px",
                              marginTop: 3,
                            }}
                          >
                            <Box>
                              <Grid container>
                                <Box>
                                  <Typography
                                    sx={{
                                      padding: "2px",
                                      fontWeight: "700",
                                      paddingLeft: "10px",
                                      borderRadius: "5px",
                                      paddingBottom: "12px",
                                      paddingTop: "12px",
                                      background:
                                        "linear-gradient(93deg, rgba(232,232,232,1) 0%, rgba(245,240,240,0.41208202030812324) 43%, rgba(255,255,255,1) 100%)",
                                        width:'300%'
                                    }}
                                  >
                                    {trans.partner.sale_partner_information}
                                  </Typography>
                                </Box>
                              </Grid>

                              <Grid
                                container
                                className={styles["contact-detail-row"]}
                              >
                                <Grid
                                  item
                                  md={4}
                                  xs
                                  className={styles["contact-detail-title"]}
                                  sx={{ color: "gray" }}
                                >
                                  {trans.partner.partner_name}
                                </Grid>
                                {openEditModal ? (
                                  <Grid item xs={6} sx={{ marginLeft: 7 }}>
                                    <SelectDefault
                                      keyword="partnerId"
                                      keyMenuItem="id"
                                      keyValue="name"
                                      data={optionPartner}
                                      value={initForm?.partnerId}
                                      handleChange={handleChangeSelect}
                                      size="small"
                                    />
                                  </Grid>
                                ) : (
                                  <Grid item xs sx={{ marginLeft: 7 }}>
                                    {
                                      dataDetailCustomer?.partners[0]?.partners
                                        ?.name
                                    }
                                  </Grid>
                                )}
                              </Grid>

                              <Grid
                                container
                                className={styles["contact-detail-row"]}
                              >
                                <Grid
                                  item
                                  md={4}
                                  xs
                                  className={styles["contact-detail-title"]}
                                  sx={{ color: "gray" }}
                                >
                                  {trans.partner.partner_payment_option}
                                </Grid>
                                {openEditModal ? (
                                  <Grid item xs={6} sx={{ marginLeft: 7 }}>
                                    <SelectDefault
                                      keyword="partnerSaleType"
                                      keyMenuItem="id"
                                      keyValue="name"
                                      data={CUSTOMER_PARTNER_LIST}
                                      value={initForm?.partnerSaleType}
                                      handleChange={handleChangeSelect}
                                      size="small"
                                      errorText={getFirstValueInObject(
                                        errorForm?.partnerSaleType
                                      )}
                                    />
                                  </Grid>
                                ) : (
                                  <Grid item xs sx={{ marginLeft: 7 }}>
                                    {convertSaleType(
                                      dataDetailCustomer?.partners[0]?.saleType
                                    )}
                                  </Grid>
                                )}
                              </Grid>

                              <Grid
                                container
                                className={styles["contact-detail-row"]}
                              >
                                <Grid
                                  item
                                  md={4}
                                  xs
                                  className={styles["contact-detail-title"]}
                                  sx={{ color: "gray" }}
                                >
                                  {trans.partner.payment_tern}
                                </Grid>
                                {openEditModal ? (
                                  <Grid item xs={6} sx={{ marginTop: "10px" }}>
                                    <Box
                                      sx={{
                                        width: "100%",
                                        marginLeft: 7,
                                      }}
                                    >
                                      <DatePickerDefault
                                        handleChange={handleChangeInput}
                                        value={initForm?.saleStartDate}
                                        keyword="saleStartDate"
                                        size="small"
                                        errorText={getFirstValueInObject(
                                          errorForm?.saleStartDate
                                        )}
                                        disabled={
                                          initForm?.partnerSaleType ===
                                          partnerSaleOption.TOTAL_PAYMENT_REVENUE
                                        }
                                      />
                                    </Box>
                                    <Box
                                      sx={{
                                        width: "100%",
                                        marginTop: "10px",
                                        marginLeft: 7,
                                      }}
                                    >
                                      <DatePickerDefault
                                        handleChange={handleChangeInput}
                                        value={initForm?.saleEndDate}
                                        keyword="saleEndDate"
                                        size="small"
                                        errorText={getFirstValueInObject(
                                          errorForm?.saleEndDate
                                        )}
                                        disabled={
                                          initForm?.partnerSaleType ===
                                          partnerSaleOption.TOTAL_PAYMENT_REVENUE
                                        }
                                      />
                                    </Box>
                                  </Grid>
                                ) : (
                                  <Grid
                                    item
                                    xs
                                    className={styles["contact-detail-title"]}
                                    sx={{ marginLeft: 7 }}
                                  >
                                    {dataDetailCustomer?.partners[0]?.startDate
                                      ? moment(
                                          dataDetailCustomer?.partners[0]
                                            ?.startDate
                                        ).format("YYYY-MM-DD")
                                      : ""}{" "}
                                    {dataDetailCustomer?.partners[0]?.startDate
                                      ? "-"
                                      : ""}{" "}
                                    {dataDetailCustomer?.partners[0]?.endDate
                                      ? moment(
                                          dataDetailCustomer?.partners[0]
                                            ?.endDate
                                        ).format("YYYY-MM-DD")
                                      : ""}
                                  </Grid>
                                )}
                              </Grid>

                              <Grid
                                container
                                className={styles["contact-detail-row"]}
                                sx={{ marginTop: "10px" }}
                              >
                                <Grid
                                  item
                                  md={4}
                                  xs
                                  className={styles["contact-detail-title"]}
                                  sx={{ color: "gray" }}
                                >
                                  {trans.partner.sale}
                                </Grid>
                                {openEditModal ? (
                                  <Grid item xs={6} sx={{ marginLeft: 7 }}>
                                    <InputFormatNumber
                                      keyword="partnerSalePercent"
                                      size="small"
                                      placeholder={trans.partner.sale}
                                      value={initForm?.partnerSalePercent}
                                      handleChange={handleChangeInput}
                                      errorText={getFirstValueInObject(
                                        errorForm?.partnerSalePercent
                                      )}
                                    />
                                  </Grid>
                                ) : (
                                  <Grid item xs sx={{ marginLeft: 7 }}>
                                    {
                                      dataDetailCustomer?.partners[0]
                                        ?.salePercent
                                    }{" "}
                                    {dataDetailCustomer?.partners[0]
                                      ?.salePercent
                                      ? "%"
                                      : ""}
                                  </Grid>
                                )}
                              </Grid>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={6}>
                          <Box
                            sx={{
                              padding: "20px",
                              borderRadius: "12px",
                              backgroundColor: "white",
                              marginTop: 3,
                              height: "500px",
                            }}
                          >
                            <Typography
                              variant="body1"
                              color="initial"
                              sx={{
                                padding: "2px",
                                fontWeight: "700",
                                paddingLeft: "10px",
                                borderRadius: "5px",
                                paddingBottom: "12px",
                                paddingTop: "12px",
                                background:
                                  "linear-gradient(93deg, rgba(232,232,232,1) 0%, rgba(245,240,240,0.41208202030812324) 43%, rgba(255,255,255,1) 100%)",
                              }}
                            >
                              {trans.menu.contact}
                            </Typography>
                            <Box sx={{ height: "370px" }}>
                              <TableContainer>
                                <Table
                                  sx={{ minWidth: 650 }}
                                  aria-label="simple table"
                                >
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>#</TableCell>
                                      <TableCell width="20%">
                                        {trans.customer.name}
                                      </TableCell>
                                      <TableCell width="20%">
                                        {trans.customer_detail.gender}
                                      </TableCell>
                                      <TableCell width="20%">
                                        {trans.customer_detail.position}
                                      </TableCell>
                                      <TableCell width="20%">
                                        {trans.customer_detail.phone_number}
                                      </TableCell>
                                      <TableCell width="20%">
                                        {trans.customer_detail.email}
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {currentItemsContact?.map(
                                      (item: any, index: any) => (
                                        <TableRow
                                          key={item?.title}
                                          sx={{
                                            "&:last-child td, &:last-child th":
                                              {
                                                border: 0,
                                              },
                                          }}
                                        >
                                          <TableCell>
                                            {(pageOrderItem - 1) * rowsPerPage +
                                              index +
                                              1}
                                          </TableCell>
                                          <TableCell
                                            className="text-cursor"
                                            component="th"
                                            scope="row"
                                          >
                                            <Link
                                              href={
                                                window.location.origin +
                                                "/contact/" +
                                                item?.id
                                              }
                                              className="text-overflow"
                                            >
                                              {item?.firstName
                                                ? `${item?.firstName}  ${item?.lastName}`
                                                : ""}
                                            </Link>
                                          </TableCell>
                                          <TableCell component="th" scope="row">
                                            {showGender(item?.gender)}
                                          </TableCell>
                                          <TableCell>{item?.sector}</TableCell>
                                          <TableCell>{item?.phone}</TableCell>
                                          <TableCell sx={{ width: 250 }}>
                                            {item?.email}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                    {newLineContact}
                                    {/* <TableRow>
                                    <TableCell
                                      style={{ borderBottom: "none" }}
                                    ></TableCell>
                                    <TableCell style={{ borderBottom: "none" }}>
                                      <Button onClick={handleOpenFormContact}>
                                        {trans.customer_detail.add_new_contact}
                                      </Button>
                                    </TableCell>
                                  </TableRow> */}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Box>
                            <Box>
                              {dataListContacts?.items.length > 5 && (
                                <Stack sx={{ textAlign: "center" }} spacing={2}>
                                  <Pagination
                                    count={Math.round(
                                      dataListContacts?.items.length / 5 + 1
                                    )}
                                    page={pageContact}
                                    onChange={handleChangeContactPage}
                                  />
                                </Stack>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Box
                          sx={{
                            padding: "20px",
                            borderRadius: "12px",
                            backgroundColor: "white",
                            height: "500px",
                            marginTop: 3,
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                padding: "2px",
                                fontWeight: "700",
                                paddingLeft: "10px",
                                borderRadius: "5px",
                                paddingBottom: "12px",
                                paddingTop: "12px",
                                background:
                                  "linear-gradient(93deg, rgba(232,232,232,1) 0%, rgba(245,240,240,0.41208202030812324) 43%, rgba(255,255,255,1) 100%)",
                              }}
                            >
                              {trans.customer_detail.description_information}
                              <IconButton
                                aria-label="edit"
                                onClick={handleEditDescription}
                                sx={{
                                  marginLeft: "20px",
                                  padding: 0,
                                }}
                              >
                                {!editDescriptionButton ? (
                                  <EditIcon className={styles["edit-icon"]} />
                                ) : (
                                  <SaveIcon className={styles["edit-icon"]} />
                                )}
                              </IconButton>
                            </Typography>
                          </Box>
                          <Box>
                            {!editDescriptionButton ? (
                              <Typography>
                                <span
                                  className="description-img"
                                  dangerouslySetInnerHTML={{
                                    __html: checkLinkComment(
                                      initForm.description
                                    ),
                                  }}
                                />
                              </Typography>
                            ) : (
                              <InputTiny
                                handleChange={handleChangeInput}
                                keyword="description"
                                value={initForm?.description}
                                object={dataDetailCustomer}
                                objectName={"customers"}
                                isLoggedInUserId={isLoggedInUserId}
                                onEdit={true}
                              />
                            )}
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sx={{ marginTop: 3 }}>
                        <LogNote
                          isLoggedInUserId={isLoggedInUserId}
                          title={trans.home.activity}
                          object={dataDetailCustomer}
                          logNotes={logNoteCustomer}
                          objectName="customers"
                          getObject={getDetailCustomer}
                        />
                      </Grid>
                    </TabPanel>
                  </Box>

                  <Box className={styles.boxTabPanel}>
                    <TabPanel value={value} index={TAB_CUSTOMER_CONTACT}>
                      <TableContainer component={Paper} className="p-24">
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell className="list-index">#</TableCell>
                              <TableCell width="30%">
                                {trans.customer.name}
                              </TableCell>
                              <TableCell>
                                {trans.customer_detail.gender}
                              </TableCell>
                              <TableCell>
                                {trans.customer_detail.position}
                              </TableCell>
                              <TableCell>
                                {trans.customer_detail.phone_number}
                              </TableCell>
                              <TableCell>
                                {trans.customer_detail.email}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {dataListContacts?.items.map(
                              (item: any, index: any) => (
                                <TableRow
                                  key={item?.title}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell>
                                    {(pageOrderItem - 1) * rowsPerPage +
                                      index +
                                      1}
                                  </TableCell>
                                  <TableCell
                                    className="text-cursor"
                                    component="th"
                                    scope="row"
                                  >
                                    <Link
                                      href={
                                        window.location.origin +
                                        "/contact/" +
                                        item?.id
                                      }
                                      className="text-overflow"
                                    >
                                      {item?.firstName
                                        ? `${item?.firstName}  ${item?.lastName}`
                                        : ""}
                                    </Link>
                                  </TableCell>
                                  <TableCell component="th" scope="row">
                                    {showGender(item?.gender)}
                                  </TableCell>
                                  <TableCell>{item?.sector}</TableCell>
                                  <TableCell>{item?.phone}</TableCell>
                                  <TableCell sx={{ width: 250 }}>
                                    {item?.email}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                            {newLineContact}
                            <TableRow>
                              <TableCell
                                style={{ borderBottom: "none" }}
                              ></TableCell>
                              <TableCell style={{ borderBottom: "none" }}>
                                <Button onClick={handleOpenFormContact}>
                                  {trans.customer_detail.add_new_contact}
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                      {dataListContacts?.total > rowsPerPage && (
                        <PaginationDefault
                          total={dataListContacts?.total}
                          setQuerySearch={setQuerySearch}
                          paginateByParamUrl={false}
                          setCustomPage={setPageOrderItem}
                          customPage={pageOrderItem}
                        />
                      )}
                    </TabPanel>
                  </Box>

                  <Box className={styles.boxTabPanel}>
                    <TabPanel value={value} index={TAB_CUSTOMER_DEAL}>
                      <TableContainer component={Paper} className="p-24">
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>#</TableCell>
                              <TableCell width="30%">
                                {trans.customer.name}
                              </TableCell>
                              <TableCell
                                className="text-align-center"
                                width="10%"
                              >
                                {trans.deal.category}
                              </TableCell>
                              <TableCell width="12%">
                                {trans.deal.forecast_close_date}
                              </TableCell>
                              <TableCell
                                width="10%"
                                className="text-align-right"
                              >
                                {trans.deal.deal_value}
                              </TableCell>
                              <TableCell
                                className="text-align-center"
                                width="25%"
                              >
                                {trans.deal.probability_of_winning}
                              </TableCell>
                              <TableCell className="text-align-center">
                                {newLineDeal
                                  ? trans.task.actions
                                  : trans.deal.status}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {dataListDeals?.items.map(
                              (item: any, index: any) => (
                                <TableRow
                                  key={item?.title}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell className="list-index">
                                    {(pageOrderItem - 1) * rowsPerPage +
                                      index +
                                      1}
                                  </TableCell>
                                  <TableCell
                                    className="text-cursor"
                                    component="th"
                                    scope="row"
                                  >
                                    <Link
                                      href={
                                        window.location.origin +
                                        "/deals/" +
                                        item?.id
                                      }
                                      className="text-overflow"
                                    >
                                      {item?.name}
                                    </Link>
                                  </TableCell>
                                  <TableCell
                                    component="th"
                                    scope="row"
                                    className="text-align-center"
                                  >
                                    {item?.category?.name}
                                  </TableCell>
                                  <TableCell>
                                    {fomatDate(item?.forecastCloseDate)}
                                  </TableCell>
                                  <TableCell className="text-align-right">
                                    {formatCurrencyValue(item?.price) ?? ""}{" "}
                                    {item?.price != null
                                      ? item?.currency?.sign
                                      : ""}
                                  </TableCell>
                                  <TableCell className="text-align-center">
                                    {!!newLineDeal ||
                                      (item?.probabilityWinning
                                        ? `${item?.probabilityWinning} %`
                                        : "")}
                                  </TableCell>
                                  <TableCell
                                    sx={{ width: 250, fontWeight: 700 }}
                                  >
                                    {item?.status?.name && (
                                      <div
                                        className={`text-align-center ${styles["list-status"]} `}
                                        style={{
                                          color: `${item?.status?.colorCode}`,
                                        }}
                                      >
                                        {item?.status?.name}
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell
                                    className="text-align-center"
                                    sx={{ fontWeight: "700" }}
                                  >
                                    {item?.ratePoint > 0
                                      ? item?.ratePoint + " pt"
                                      : ""}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                            {newLineDeal}
                            <TableRow>
                              <TableCell
                                style={{ borderBottom: "none" }}
                              ></TableCell>
                              <TableCell style={{ borderBottom: "none" }}>
                                <Button onClick={handleOpenForm}>
                                  {trans.deal.add_new_deal}
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                      {dataListDeals?.total > rowsPerPage && (
                        <PaginationDefault
                          total={dataListDeals?.total}
                          setQuerySearch={setQuerySearch}
                          paginateByParamUrl={false}
                          setCustomPage={setPageOrderItem}
                          customPage={pageOrderItem}
                        />
                      )}
                    </TabPanel>
                  </Box>

                  <Box className={styles.boxTabPanel}>
                    <TabPanel value={value} index={TAB_CUSTOMER_ORDER}>
                      <TableContainer component={Paper} className="p-24">
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>#</TableCell>
                              <TableCell width="30%">
                                {trans.order.title}
                              </TableCell>
                              <TableCell>{trans.deal.order_manager}</TableCell>
                              <TableCell>{trans.order.created_at}</TableCell>
                              <TableCell>{trans.order.delivery_date}</TableCell>
                              <TableCell className="text-align-center">
                                {trans.order.status}
                              </TableCell>
                              <TableCell className="text-align-center">
                                {trans.order.rate_point}
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {dataListOrders?.items.map(
                              (item: any, index: any) => (
                                <TableRow
                                  key={item?.title}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell className="list-index">
                                    {(pageOrderItem - 1) * rowsPerPage +
                                      index +
                                      1}
                                  </TableCell>
                                  <TableCell
                                    className="text-cursor"
                                    component="th"
                                    scope="row"
                                  >
                                    <Link
                                      href={
                                        window.location.origin +
                                        "/order/" +
                                        item?.id
                                      }
                                      className="text-overflow"
                                    >
                                      {item?.name}
                                    </Link>
                                  </TableCell>
                                  <TableCell component="th" scope="row">
                                    {item?.orderManager}
                                  </TableCell>
                                  <TableCell>
                                    {fomatDate(item?.createdAt.slice(0, 10))}
                                  </TableCell>
                                  <TableCell>
                                    {fomatDate(item?.deleveryDate)}
                                  </TableCell>
                                  <TableCell sx={{ width: 250 }}>
                                    {item?.status?.name && (
                                      <div
                                        className={`text-align-center ${styles["list-status"]} `}
                                        style={{
                                          color: `${item?.status?.colorCode}`,
                                          fontWeight: 700,
                                        }}
                                      >
                                        {item?.status?.name}
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell
                                    className="text-align-center"
                                    sx={{ fontWeight: "700" }}
                                  >
                                    {item?.ratePoint > 0
                                      ? item?.ratePoint + " pt"
                                      : ""}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      {dataListOrders?.total > rowsPerPage && (
                        <PaginationDefault
                          total={dataListOrders?.total}
                          setQuerySearch={setQuerySearch}
                          paginateByParamUrl={false}
                          setCustomPage={setPageOrderItem}
                          customPage={pageOrderItem}
                        />
                      )}
                    </TabPanel>
                  </Box>

                  <Box className={styles.boxTabPanel}>
                    <TabPanel value={value} index={TAB_CUSTOMER_INVOICE}>
                      <TableContainer component={Paper} className="p-24">
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>#</TableCell>
                              <TableCell
                                width="20%"
                                className="text-align-center"
                              >
                                {trans.invoice.invoiceID}
                              </TableCell>
                              <TableCell>{trans.order.order_name}</TableCell>
                              <TableCell>
                                {trans.customer_detail.payment_id}
                              </TableCell>
                              <TableCell className="text-align-right">
                                {trans.invoice.total_values}
                              </TableCell>
                              <TableCell>
                                {trans.invoice.invoice_date}
                              </TableCell>
                              <TableCell>{trans.order.due_date_}</TableCell>

                              <TableCell className="text-align-center">
                                {trans.order.status}
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {dataInvoicesByCustomerId?.data?.items?.map(
                              (item: any, index: any) => (
                                <TableRow
                                  key={item?.title}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell>
                                    {(pageOrderItem - 1) * rowsPerPage +
                                      index +
                                      1}
                                  </TableCell>
                                  <TableCell
                                    width="20%"
                                    className="text-align-center text-cursor"
                                  >
                                    <Link
                                      href={
                                        window.location.origin +
                                        "/invoices/" +
                                        item?.id
                                      }
                                      className="text-overflow"
                                    >
                                      {item?.code}
                                    </Link>
                                  </TableCell>
                                  <TableCell className="text-cursor">
                                    <Link
                                      href={
                                        window.location.origin +
                                        "/order/" +
                                        item?.order?.id
                                      }
                                      className="text-overflow"
                                    >
                                      {item?.order?.name}
                                    </Link>
                                  </TableCell>
                                  <TableCell>
                                    {item?.payment?.map(
                                      (pay: any, indexPay: any) => (
                                        <span
                                          key={pay?.id}
                                          className="text-cursor"
                                          onClick={() =>
                                            handleDetailpayment(pay?.id)
                                          }
                                        >
                                          #{pay.id}{" "}
                                          {indexPay + 1 < item?.payment?.length
                                            ? ", "
                                            : ""}
                                        </span>
                                      )
                                    )}
                                  </TableCell>
                                  <TableCell className="text-align-right">
                                    {convertTotal(
                                      item?.total_value,
                                      item?.currency_sign
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {fomatDate(item?.start_date)}
                                  </TableCell>
                                  <TableCell>
                                    {fomatDate(item?.due_date)}
                                  </TableCell>

                                  <TableCell
                                    className={`text-align-center ${styles["list-status"]} `}
                                    style={{
                                      color: `${item?.status?.colorCode}`,
                                      fontWeight: 700,
                                    }}
                                  >
                                    {item?.statusName
                                      ? item?.statusName.toUpperCase()
                                      : ""}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      {dataInvoicesByCustomerId?.data?.total > rowsPerPage && (
                        <PaginationDefault
                          total={dataInvoicesByCustomerId?.data?.total}
                          setQuerySearch={setQuerySearch}
                          paginateByParamUrl={false}
                          setCustomPage={setPageOrderItem}
                          customPage={pageOrderItem}
                        />
                      )}
                    </TabPanel>
                  </Box>

                  <Box className={styles.boxTabPanel}>
                    <TabPanel value={value} index={TAB_CUSTOMER_PAYMENT}>
                      <TabPanelPaymentListCustomer
                        dataListPayment={dataListPayment}
                        currency={dataDetailCustomer?.currency?.sign}
                        dataInvoice={dataInvoicesByCustomerId}
                      />
                    </TabPanel>
                  </Box>

                  <Box className={styles.boxTabPanel}>
                    <TabPanel value={value} index={TAB_CUSTOMER_TASK}>
                      <TabPanelTaskList
                        paramObject="customerId"
                        idObject={id}
                        dataTaskObject={dataTaskObject}
                        setPageOrderItem={setPageOrderItem}
                        pageOrderItem={pageOrderItem}
                        handleOpenFormTask={handleOpenFormTask}
                      />
                    </TabPanel>
                  </Box>

                  <Box className={styles.boxTabPanel}>
                    <TabPanel value={value} index={TAB_CUSTOMER_NOTE}>
                      <LogNote
                        isLoggedInUserId={isLoggedInUserId}
                        title={trans.home.activity}
                        object={dataDetailCustomer}
                        logNotes={logNoteCustomer}
                        objectName="customers"
                        getObject={getDetailCustomer}
                      />
                    </TabPanel>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Modal
          open={openModalMerge}
          onClose={handleCloseModalMerger}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              height: 200,
              bgcolor: "background.paper",
              borderRadius: "10px",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={customerOptions}
              onChange={handleAutocompleteChange}
              sx={{ marginTop: 5 }}
              renderInput={renderInput}
              value={""}
            />
          </Box>
        </Modal>

        <ModalDetailCustomer
          openModal={showDetalCustomer}
          setOpenModal={setShowDetailCustomer}
          title={"Merge Customer"}
          idCustomer={dataDetailCustomer?.id}
          customerMerge={idCustomerMerge}
        />

        <FormCreateDealFromCustomerDetail
          openModal={openDealFormModal}
          setOpenModal={setOpenDealFormModal}
          customer={dataDetailCustomer}
          listContact={dataListContacts}
        />
        <FormCreateTask
          openFormModal={openTaskFormModal}
          setOpenFormModal={setOpenTaskModal}
          dataCustomer={dataDetailCustomer}
          onScreen={true}
        />
        <FormCreateOrUpdateContact
          openEditModal={openContactFormModal}
          setOpenEditModal={setOpenContactFormModal}
          dataCustomer={dataDetailCustomer}
        />
        <ModalDelete
          openModal={openDeleteModal}
          setOpenModal={setOpenDeleteModal}
          action={handleModalDeleteCustomer}
          title={trans.customer_detail.you_re_about_to_delete_your_customer}
          content={
            trans.customer_detail
              .this_customer_will_be_permenently_removed_and_you_won_t_be_able_to_see_them_again
          }
        />
        <ModalDeleteNotification
          openModalDeleteNotification={openModalDeleteNotification}
          setOpenModalDeleteNotification={setOpenModalDeleteNotification}
          title={trans.customer_detail.you_re_about_to_delete_your_customer}
          content={trans.customer_detail.cannot_delete_customer}
        />
        <ModalUpdateCountry
          openModalUpdateCountry={openModalUpdateCountry}
          setOpenModalUpdateCountry={setOpenModalUpdateCountry}
          title={trans.customer_detail.you_re_about_to_change_country_cid}
          content={
            trans.customer_detail
              .if_you_change_cid_in_here_invoice_id_won_t_be_changed_you_can_change_invoice_id_from_detail_invoice
          }
        />
        <FormShowDetailPayment
          openModalDetail={openModalDetailPayment}
          setOpenModalDetail={setOpenModalDetailPayment}
          dataPayment={dataPayment?.data}
          edit={false}
        />
        {onOpenModalCustomer && (
          <ModalUpdateCountry
            openModalUpdateCountry={openModalUpdateCustomerName}
            setOpenModalUpdateCountry={setOpenModalUpdateCustomerName}
            setOnOpenModalCustomer={setOnOpenModalCustomer}
            title={trans.customer_detail.you_re_about_to_change_customer_name}
            content={
              trans.customer_detail
                .after_changing_customer_name_if_this_customer_has_existed_an_invoice_the_customer_name_on_the_invoice_won_t_be_changed
            }
          />
        )}
      </div>
    );
  }

  return <></>;
};

const mapStateToProps = (state: any) => ({
  customer: state.customer,
  contact: state.contact,
  invoice: state.invoice,
  industry: state?.industry,
  employee: state?.employee,
  country: state?.country,
  city: state?.city,
  category: state?.category,
  currency: state?.currency,
  payment: state?.payment,
  status: state.status,
  deal: state.deal,
  errors: state.customer?.error?.response?.data,
  task: state?.task,
  profile: state?.profile,
  level: state.customerLevel,
  user: state.user,
  saleChannel: state.saleChannel,
  partner: state.partner,
});

const mapDispatchToProps = {
  clearData,
  getDetailCustomer,
  getListContactByCustomerId,
  getListDealByCustomerId,
  getListOrderByCustomerId,
  getInvoicesByCustomerId,
  getEmployee,
  updateCustomer,
  getCountries,
  getCities,
  getCid,
  getCurrencyList,
  getStatusList,
  getIndustry,
  getListPaymentByCustomerId,
  getObjectTask,
  searchPayment,
  searchInvoices,
  getDetailProfile,
  searchCustomerLevel,
  deleteCustomer,
  searchUser,
  searchCustomer,
  getSaleChannel,
  getPayment,
  uploadFileRaw,
  listPartner,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetail);
