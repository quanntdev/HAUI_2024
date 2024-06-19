import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  Paper,
  IconButton,
  Button,
  TableHead,
  TableCell,
  TableRow,
  TableContainer,
  Avatar,
  MenuItem,
  Menu,
  ListItemIcon,
} from "@mui/material";
import type { NextPage } from "next";
import styles from "./styles.module.scss";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import {
  getDetailDeal,
  clearData,
  updateDealStatus,
  updateDeal,
  deleteDeal,
} from "../../redux/actions/deal";
import { searchUser } from "../../redux/actions/user";
import { getOrderListByDealId } from "../../redux/actions/order";
import { getCategoryList } from "../../redux/actions/category";
import { getCurrencyList } from "../../redux/actions/currency";
import Breadcrumb from "../../components/Breadcumb";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import styled from "styled-components";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import InputBase from "../../components/Input/InputBase";
import { getStatusList } from "../../redux/actions/status";
import { getDetailProfile } from "../../redux/actions/profile";
import {
  CONVERTED_ORDER_STATUS,
  rowsPerPage,
  statusCode,
} from "../../constants";
import SelectDefault from "../../components/Input/SelectDefault";
import InputFormatNumber from "../../components/Input/InputFormatNumber";
import BoxCustomerInformation from "../../components/BoxCustomerInformation";
import PaginationDefault from "../../components/Pagination";
import DatePickerDefault from "../../components/Input/DatePickerDefault";
import checkChangeDataBeforeUpdate from "../../utility/checkChangeDataBeforeUpdate";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import FormUpdateContactFromPageDetail from "../../components/Contact/FormUpdateContactFromPageDetail";
import FormCreateOrderFromDealDetail from "../../components/Order/FormCreateOrderFromDealDetail";
import FormCreateTask from "../../components/Task/FormCreateTask";
import getLinkAvatar from "../../utility/getLinkAvatar";
import { getObjectTask } from "../../redux/actions/task";
import InputTiny from "../../components/Input/InputTiny";
import TabPanelTaskList from "../../components/TabList/TabPanelTaskList";
import HeadMeta from "../../components/HeadMeta";
import { IconReceipt } from "@tabler/icons";
import LogNote from "../../components/LogNote";
import ModalDelete from "../../components/Modal/ModalDelete";
import ModalDeleteNotification from "../../components/Modal/ModalDeleteNotification";
import removeQueryParam from "../../utility/removeQueryParam";
import useTrans from "../../utils/useTran";
import fomatDate from "../../utility/fomatDate";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const AntTabs = styled(Tabs)({});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    "&.Mui-selected": {
      clipPath: "polygon(8% 50%, 0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
      backgroundColor: "rgb(216, 247, 213)",
    },
  })
);
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

type DataFormDealType = {
  name: string;
  url: string;
  probabilityWinning: string;
  forecastCloseDate: Date | null;
  price: string;
  description: string;
  categoryId: number | null;
  currencyId: number | null;
  customerId: number | null;
  contactId: number | null;
  statusId: number | null;
  userAssignId: number | null;
};

const INIT_DEAL = {
  name: "",
  url: "",
  probabilityWinning: "",
  forecastCloseDate: null,
  price: "",
  description: "",
  categoryId: null,
  currencyId: null,
  customerId: null,
  contactId: null,
  statusId: null,
  userAssignId: null,
};

const DealDetail: NextPage = (props: any) => {
  const {
    getDetailDeal,
    getCategoryList,
    getCurrencyList,
    clearData,
    getStatusList,
    updateDealStatus,
    updateDeal,
    searchUser,
    getOrderListByDealId,
    errors,
    getObjectTask,
    getDetailProfile,
    deleteDeal,
  } = props;
  const { dataDetailProfile } = props?.profile;
  const { dataDealDetail, dataUpdateDeal, dataLogNote, dataDeleteDeal } =
    props.deal;
  const { dataStatusList } = props.status;
  const { dataOrderListByDealId } = props.order;
  const { dataCategoryList } = props.category;
  const { dataCurrencyList } = props.currency;
  const { dataUserList } = props.user;
  const { dataTaskObject, dataCreateTask, dataTaskDelete } = props.task;
  const router = useRouter();
  const q: any = useMemo(() => router.query, [router]);
  const id = q?.id || "";
  const [value, setValue] = useState(0);
  const [values, setValues] = useState<any>(0);
  const [formDataDeal, setFormDataDeal] = useState<DataFormDealType>(INIT_DEAL);
  const [disableEditDescriptionButton, setDisableEditDescriptionButton] =
    useState<boolean>(false);
  const [editDealDetail, setEditDealDetail] = useState<boolean>(false);
  const [disableCreateOrderButton, setDisableCreateOrderButton] =
    useState<boolean>(false);
  const [openFormModal, setOpenFormModal] = useState<boolean>(false);
  const [openUpdateContactFormModal, setOpenUpdateContactFormModal] =
    useState<boolean>(false);
  const [querySearch, setQuerySearch] = useState<string>("");
  const [pageOrderItem, setPageOrderItem] = useState<number>(1);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [openTaskFormModal, setOpenTaskModal] = useState<boolean>(false);
  const [isLoggedInUserId, setIsLoggedInUserId] = useState<any>();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openModalDeleteNotification, setOpenModalDeleteNotification] =
    useState<boolean>(false);
  const [applyData, setApplyData] = useState<boolean>(true);
  const trans = useTrans();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (id && applyData) getDetailDeal(id, querySearch);
  }, [id, querySearch]);

  useEffect(() => {
    if (dataDealDetail) {
      getCurrencyList();
      getCategoryList();
      searchUser("");
      setQuerySearch(`limit=${rowsPerPage}&offset=${0 * rowsPerPage}`);
    }
  }, [dataDealDetail]);

  const handleChange = (event: any, newValue: any) => {
    setApplyData(false);
    removeQueryParam(router, ["view", "tab"]);
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        tab: newValue,
      },
    });
  };

  useEffect(() => {
    if (!dataDetailProfile) {
      getDetailProfile();
    } else {
      setIsLoggedInUserId(dataDetailProfile?.id);
    }
  }, [dataDetailProfile]);

  useEffect(() => {
    if (router?.query?.tab) {
      if (router?.query?.tab == "lognote") {
        setValue(3);
      } else {
        setValue(Number(router?.query?.tab));
      }
    }
  }, [router?.query]);

  useEffect(() => {
    if (dataUpdateDeal || dataDeleteDeal || (value && value != 3)) {
      removeQueryParam(router, ["view"]);
    }
  }, [dataUpdateDeal, dataDeleteDeal, value]);

  useEffect(() => {
    if (router.query?.taskId) {
      setValue(2);
    }
  }, [router.query]);

  useEffect(() => {
    if (id) {
      switch (value) {
        case 2: {
          getObjectTask(
            `limit=${rowsPerPage}&offset=${
              (pageOrderItem - 1) * rowsPerPage
            }&dealId=${id}`
          );
          break;
        }
        default: {
          break;
        }
      }
    }
  }, [value, id]);

  useEffect(() => {
    if (dataCreateTask || dataTaskDelete) {
      getObjectTask(
        `limit=${rowsPerPage}&offset=${
          (pageOrderItem - 1) * rowsPerPage
        }&dealId=${id}`
      );
    }
  }, [dataCreateTask, dataTaskDelete]);

  useEffect(() => {
    if (dataDealDetail) {
      delete dataDealDetail["tags"];
    }
    setFormDataDeal({
      ...INIT_DEAL,
      ...dataDealDetail,
      customerId: Number(dataDealDetail?.customer?.id),
      categoryId: Number(dataDealDetail?.category?.id),
      userAssignId: Number(dataDealDetail?.userAssign?.id),
      statusId: Number(dataDealDetail?.status?.id),
      contactId: Number(dataDealDetail?.contact?.id),
      currencyId: Number(dataDealDetail?.customer?.currency?.id),
    });
  }, [dataDealDetail, disableEditDescriptionButton]);

  useEffect(() => {
    if (querySearch) getOrderListByDealId(id, querySearch);
  }, [querySearch]);

  useEffect(() => {
    if (dataDeleteDeal && !openDeleteModal) {
      router.push(`/deals`);
    }
  }, [dataDeleteDeal, openDeleteModal]);

  useEffect(() => {
    if (dataDeleteDeal) {
      clearData("dataDeleteDeal");
    }
  }, [dataDeleteDeal]);

  const handleChangeValue = (event: any, newValue: any) => {
    setValues(newValue);
    updateDealStatus({ ...formDataDeal, ["statusId"]: newValue + 1 }, id);
    if (newValue === CONVERTED_ORDER_STATUS) {
      setDisableCreateOrderButton(true);
    } else {
      setDisableCreateOrderButton(false);
    }
  };
  const handleEditDescription = () => {
    setDisableEditDescriptionButton(!disableEditDescriptionButton);
    if (
      disableEditDescriptionButton &&
      formDataDeal?.description != dataDealDetail?.description
    ) {
      updateDeal(formDataDeal, id);
    }
    handleInlineEditClose(
      disableEditDescriptionButton,
      setDisableEditDescriptionButton
    );
  };

  const handleInlineEditClose = (action: boolean, setAction: any) => {
    setAction(!action);
    clearData("dataUpdateDeal");
  };

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleDeleteDeal = useCallback(() => {
    handleClose();

    if (dataOrderListByDealId?.items.length || dataTaskObject?.items?.length) {
      setOpenModalDeleteNotification(true);
    } else {
      setOpenDeleteModal(true);
    }
  }, [handleClose, dataOrderListByDealId, dataTaskObject]);

  const handleEditDeal = useCallback(() => {
    handleClose();

    if (
      editDealDetail &&
      (checkChangeDataBeforeUpdate(formDataDeal, dataDealDetail) ||
        formDataDeal?.contactId?.toString() !==
          Number(dataDealDetail?.contact?.id).toString() ||
        formDataDeal?.categoryId?.toString() !==
          Number(dataDealDetail?.category?.id).toString() ||
        formDataDeal?.userAssignId?.toString() !==
          Number(dataDealDetail?.userAssign?.id).toString() ||
        formDataDeal?.customerId?.toString() !==
          Number(dataDealDetail?.customer?.id).toString() ||
        formDataDeal?.statusId?.toString() !==
          Number(dataDealDetail?.status?.id).toString() ||
        formDataDeal?.currencyId?.toString() !==
          Number(dataDealDetail?.currency?.id).toString())
    ) {
      updateDeal(formDataDeal, id);
    }

    handleInlineEditClose(editDealDetail, setEditDealDetail);
  }, [
    handleClose,
    editDealDetail,
    formDataDeal,
    dataDealDetail,
    id,
    handleInlineEditClose,
    updateDeal,
  ]);

  const handleToShowContact = () =>
    router.push(`/contact/${dataDealDetail?.contact?.id}`);
  const handleToShowOrder = (id: number) => router.push(`/order/${id}`);

  const handleOpenForm = (action: boolean) => {
    setOpenFormModal(action);
  };

  const handleOpenUpdateContactForm = useCallback(() => {
    setOpenUpdateContactFormModal(true);
  }, []);

  const handleChangeInput = (key: any, value: any) => {
    setFormDataDeal({ ...formDataDeal, [key]: value ?? "" });
  };

  const handleChangeSelect = (key: any, value: any) => {
    setFormDataDeal({ ...formDataDeal, [key]: Number(value) });
  };

  useEffect(() => {
    if (id || (id && localStorage.getItem("languages"))) {
      getDetailDeal(id);
    }
  }, [dataUpdateDeal, localStorage.getItem("languages"), dataCreateTask]);

  useEffect(() => {
    getStatusList(null);
    setValues(Number(dataDealDetail?.status?.id) - 1);
    if (dataDealDetail?.status?.name === "WON") {
      setDisableCreateOrderButton(true);
    }
  }, [dataDealDetail]);

  useEffect(() => {
    if (errors != undefined && errors?.statusCode == statusCode.NOT_FOUND)
      router.push("/404");
  }, [errors]);

  const handleOpenFormTask = (action: boolean) => {
    setOpenTaskModal(action);
  };

  const handleClick = useCallback((event: any) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleCreateOrder = useCallback(() => {
    handleClose();
    handleOpenForm(true);
  }, [handleClose, handleOpenForm]);

  return (
    <div>
      <HeadMeta title={trans.menu.deal} param={dataDealDetail?.name} />

      <Breadcrumb
        title={dataDealDetail?.name}
        icon={<IconReceipt className={styles["icons"]} />}
      />

      <Box
        sx={{
          marginTop: 3,
          paddingBottom: "50px",
          padding: "20px",
          borderRadius: "12px",
          backgroundColor: "white",
        }}
      >
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            TabIndicatorProps={{
              style: { display: "none" },
            }}
          >
            <Tab label={trans.deal.deal_detail} id="simple-tab-0" />
            <Tab label={trans.menu.order} id="simple-tab-1" />
            <Tab label={trans.menu.task} id="simple-tab-2" />
          </Tabs>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "30px",
          }}
        >
          <Box sx={{ marginLeft: "25%" }}>
            <AntTabs
              TabIndicatorProps={{
                style: {
                  backgroundColor: "white",
                },
              }}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
              value={values}
              onChange={handleChangeValue}
              className={styles["box-tab"]}
            >
              {dataStatusList?.map((deal: any, index: number) => (
                <StyledTab
                  key={index}
                  className={styles["tab-panels"]}
                  label={deal?.name}
                  id={deal?.id}
                />
              ))}
            </AntTabs>
          </Box>

          {!editDealDetail && (
            <span
              style={{
                color: "gray",
                marginTop: "-65px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            >
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
            </span>
          )}

          {editDealDetail ? (
            <span
              style={{
                color: "gray",
                marginTop: "-60px",
                marginRight: "15px",
                cursor: "pointer",
              }}
              onClick={handleEditDeal}
            >
              <SaveIcon />
            </span>
          ) : (
            <Menu
              sx={{ marginLeft: -8, borderRadius: 10 }}
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                onClick={handleCreateOrder}
                className={
                  disableCreateOrderButton
                    ? styles["text-detail-create"]
                    : styles["text-detail-create-disable"]
                }
                disabled={disableCreateOrderButton ? false : true}
              >
                <ListItemIcon>
                  <AddIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">CREATE ORDER</Typography>
              </MenuItem>
              {(router?.query.tab === "0" || !router?.query.tab) && (
                <MenuItem onClick={handleEditDeal}>
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">EDIT</Typography>
                </MenuItem>
              )}

              <MenuItem sx={{ color: "#e74c3c" }} onClick={handleDeleteDeal}>
                <ListItemIcon sx={{ color: "#e74c3c" }}>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                  DELETE
                </Typography>
              </MenuItem>
            </Menu>
          )}
        </Box>
      </Box>

      <TabPanel value={value} index={0}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Box
              sx={{
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "white",
                height: editDealDetail ? "auto" : "335px",
                marginTop: 3,
              }}
            >
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
                {trans.deal.deal_detail}
              </Typography>

              {editDealDetail && (
                <Grid container sx={{ marginTop: 2 }}>
                  <Grid item xs={4}>
                    <span style={{ color: "gray", marginLeft: "20px" }}>
                      {trans.customer.name}
                    </span>
                  </Grid>
                  <Grid item xs={6}>
                    <InputBase
                      keyword="name"
                      size="small"
                      value={formDataDeal?.name}
                      handleChange={handleChangeInput}
                    />
                  </Grid>
                </Grid>
              )}

              <Grid item xs={12}>
                <Grid container sx={{ marginTop: 2 }}>
                  <Grid item xs={4}>
                    <span
                      style={{
                        display: "inline-block",
                        color: "gray",
                        marginLeft: "20px",
                      }}
                    >
                      {trans.deal.category}
                    </span>
                  </Grid>
                  <Grid item xs={6}>
                    {editDealDetail ? (
                      <SelectDefault
                        keyword="categoryId"
                        keyMenuItem="id"
                        keyValue="name"
                        size="small"
                        data={dataCategoryList?.items ?? []}
                        value={formDataDeal?.categoryId}
                        handleChange={handleChangeSelect}
                      />
                    ) : (
                      dataDealDetail?.category?.name
                    )}
                  </Grid>
                </Grid>

                <Grid container sx={{ marginTop: 2 }}>
                  <Grid item xs={4}>
                    <span
                      style={{
                        display: "inline-block",
                        color: "gray",
                        marginLeft: "20px",
                        marginTop: "10px",
                      }}
                    >
                      {trans.deal.deal_value}
                    </span>
                  </Grid>
                  <Grid item xs={6}>
                    {editDealDetail ? (
                      <Grid container>
                        <Grid item xs={3}>
                          <SelectDefault
                            keyword="currencyId"
                            keyMenuItem="id"
                            keyValue="name"
                            size="small"
                            data={dataCurrencyList}
                            value={formDataDeal?.currencyId}
                            handleChange={handleChangeSelect}
                            disabled={
                              dataDealDetail?.customer?.currency ? true : false
                            }
                          />
                        </Grid>
                        <Grid item xs={7} sx={{ marginLeft: "54px" }}>
                          <InputFormatNumber
                            keyword="price"
                            size="small"
                            placeholder={trans.invoice.value}
                            value={formDataDeal?.price}
                            handleChange={handleChangeInput}
                          />
                        </Grid>
                      </Grid>
                    ) : (
                      dataDealDetail?.price &&
                      `${formatCurrencyValue(dataDealDetail?.price)} ${
                        dataDealDetail?.currency?.sign
                          ? dataDealDetail?.currency?.sign
                          : ""
                      }`
                    )}
                  </Grid>
                </Grid>

                <Grid container sx={{ marginTop: 2 }}>
                  <Grid item xs={4}>
                    <span
                      style={{
                        display: "inline-block",
                        color: "gray",
                        marginLeft: "20px",
                        marginTop: "10px",
                      }}
                    >
                      {trans.deal.probability_of_winning}
                    </span>
                  </Grid>
                  <Grid item xs={6}>
                    {editDealDetail ? (
                      <InputFormatNumber
                        keyword="probabilityWinning"
                        size="small"
                        placeholder={trans.deal.probability_of_winning}
                        value={dataDealDetail?.probabilityWinning}
                        handleChange={handleChangeInput}
                      />
                    ) : (
                      dataDealDetail?.probabilityWinning &&
                      `${dataDealDetail?.probabilityWinning} %`
                    )}
                  </Grid>
                </Grid>

                <Grid container sx={{ marginTop: 2 }}>
                  <Grid item xs={4}>
                    <span
                      style={{
                        display: "inline-block",
                        color: "gray",
                        marginLeft: "20px",
                        marginTop: "10px",
                      }}
                    >
                      {trans.deal.forecast_close_date}
                    </span>
                  </Grid>
                  <Grid item xs={6}>
                    {editDealDetail ? (
                      <DatePickerDefault
                        keyword="forecastCloseDate"
                        size="small"
                        value={dataDealDetail?.forecastCloseDate}
                        handleChange={handleChangeInput}
                      />
                    ) : (
                      fomatDate(dataDealDetail?.forecastCloseDate)
                    )}
                  </Grid>
                </Grid>

                <Grid container sx={{ marginTop: 1 }}>
                  <Grid item xs={4}>
                    <span
                      style={{
                        display: "inline-block",
                        color: "gray",
                        marginLeft: "20px",
                        marginTop: "10px",
                      }}
                    >
                      {trans.customer.assigned}
                    </span>
                  </Grid>
                  <Grid item xs={6}>
                    {editDealDetail ? (
                      <SelectDefault
                        keyword="userAssignId"
                        keyMenuItem="id"
                        keyValue="profile"
                        keyValuePropertyOne="first_name"
                        keyValuePropertyTwo="last_name"
                        size="small"
                        data={dataUserList?.items}
                        value={formDataDeal.userAssignId}
                        handleChange={handleChangeSelect}
                      />
                    ) : (
                      <>
                        {dataDealDetail?.userAssign?.profile && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Avatar
                              src={
                                dataDealDetail?.userAssign?.profile?.profileImg
                                  ? getLinkAvatar(
                                      dataDealDetail?.userAssign?.profile
                                        ?.profileImg
                                    )
                                  : ""
                              }
                              alt="Picture of the author"
                              sx={{ width: 24, height: 24 }}
                            />
                            <div style={{ marginLeft: "5px" }}>
                              {`${dataDealDetail?.userAssign?.profile?.first_name} ${dataDealDetail?.userAssign?.profile?.last_name}`}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "white",
                height: "auto",
                marginTop: 3,
              }}
            >
              <BoxCustomerInformation
                country={dataDealDetail?.customer?.country?.name}
                customer={dataDealDetail?.customer}
                hasBorder={false}
              />

              <div>
                <span style={{ marginLeft: 30 }}>
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {trans.deal.contact_information}
                  </span>
                </span>
                <Button onClick={handleOpenUpdateContactForm}>
                  {!dataDealDetail?.contact ? (
                    <AddCircleIcon sx={{ color: "gray" }} />
                  ) : (
                    <EditIcon sx={{ color: "gray" }} />
                  )}
                </Button>
                {dataDealDetail?.contact ? (
                  <>
                    <Box>
                      <Grid item xs={6}>
                        <span
                          style={{
                            display: "inline-block",
                            marginLeft: "25px",
                            color: "gray",
                            marginTop: "15px",
                          }}
                        >
                          {trans.customer.name}
                        </span>
                        <span
                          style={{
                            marginLeft: "20px",
                            marginTop: "5px",
                          }}
                          onClick={() => handleToShowContact()}
                        >
                          {dataDealDetail?.contact?.firstName}{" "}
                          {dataDealDetail?.contact?.lastName}
                        </span>
                      </Grid>
                    </Box>
                    {dataDealDetail?.contact && !showDetail && (
                      <p
                        style={{
                          cursor: "pointer",
                          color: "rgb(135, 135, 255)",
                          opacity: 0.9,
                          marginLeft: "25px",
                        }}
                        onClick={() => setShowDetail(true)}
                      >
                        {trans.task.show_detail}
                      </p>
                    )}
                    {showDetail && (
                      <>
                        <Box>
                          <Grid item xs={5}>
                            <Typography
                              style={{
                                display: "inline-block",
                                marginLeft: "25px",
                                color: "gray",
                                marginTop: "15px",
                              }}
                            >
                              {trans.contact._position}
                            </Typography>
                          </Grid>
                          <Grid item xs={5}>
                            <Typography>
                              {dataDealDetail?.contact?.sector}
                            </Typography>
                          </Grid>
                        </Box>
                        <Box>
                          <Grid item xs={5}>
                            <Typography
                              style={{
                                display: "inline-block",
                                marginLeft: "25px",
                                color: "gray",
                                marginTop: "15px",
                              }}
                            >
                              {trans.contact.phone}
                            </Typography>
                          </Grid>
                          <Grid item xs={5}>
                            <Typography>
                              {dataDealDetail?.contact?.phone}
                            </Typography>
                          </Grid>
                        </Box>
                        <Box>
                          <Grid item xs={5}>
                            <Typography
                              style={{
                                display: "inline-block",
                                marginLeft: "25px",
                                color: "gray",
                                marginTop: "15px",
                              }}
                            >
                              {trans.contact.email}
                            </Typography>
                          </Grid>
                          <Grid item xs={5}>
                            <Typography>
                              {dataDealDetail?.contact?.email}
                            </Typography>
                          </Grid>
                        </Box>
                        {showDetail && (
                          <p
                            style={{
                              cursor: "pointer",
                              color: "rgb(135, 135, 255)",
                              opacity: 0.9,
                              marginLeft: "20px",
                            }}
                            onClick={() => setShowDetail(false)}
                          >
                            {trans.task.hide_details}
                          </p>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <p style={{ marginLeft: 30 }}>
                    <span
                      style={{
                        color: "gray",
                      }}
                    >
                      {trans.deal.no_contact_information}
                    </span>
                  </p>
                )}
              </div>
            </Box>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={1}
          sx={{
            marginTop: "22px",
            padding: "20px",
            borderRadius: "12px",
            backgroundColor: "white",
            marginLeft: "1px",
            width: "99.8%",
          }}
        >
          <Box
            sx={{ width: "100%", height: "auto !important" }}
            className={styles["deal-left"]}
          >
            <Box className={styles.boxTabPanel}>
              <TabPanel value={values} index={0}></TabPanel>
            </Box>
            <Box className={styles.boxTabPanel}>
              <TabPanel value={values} index={1}></TabPanel>
            </Box>
            <Box className={styles["box-description"]}>
              <Typography
                sx={{
                  width: "100%",
                  padding: "10px",
                  fontWeight: "700",
                  paddingLeft: "10px",
                  borderRadius: "5px",
                  background:
                    "linear-gradient(93deg, rgba(232,232,232,1) 0%, rgba(245,240,240,0.41208202030812324) 43%, rgba(255,255,255,1) 100%)",
                }}
              >
                {trans.customer_detail.description_information}
                <IconButton
                  aria-label="edit"
                  onClick={handleEditDescription}
                  sx={{
                    padding: 0,
                    marginLeft: "20px",
                  }}
                >
                  {!disableEditDescriptionButton ? (
                    <EditIcon className={styles["edit-icon"]} />
                  ) : (
                    <SaveIcon className={styles["edit-icon"]} />
                  )}
                </IconButton>
              </Typography>
            </Box>

            <Box className={styles["box-content"]}>
              {!disableEditDescriptionButton ? (
                <Typography>
                  <span
                    className="description-img"
                    dangerouslySetInnerHTML={{
                      __html: dataDealDetail?.description,
                    }}
                  />
                </Typography>
              ) : (
                <Box sx={{ marginTop: 2 }}>
                  <InputTiny
                    handleChange={handleChangeInput}
                    keyword="description"
                    value={formDataDeal?.description}
                    object={dataDealDetail}
                    objectName={"deals"}
                    isLoggedInUserId={isLoggedInUserId}
                    onEdit={true}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <TableContainer
          sx={{ marginTop: 5 }}
          component={Paper}
          className="p-24"
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell width="30%">{trans.order.title}</TableCell>
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
              {dataOrderListByDealId?.items.map((item: any, index: any) => (
                <TableRow
                  key={item?.title}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell className="list-index">
                    {(pageOrderItem - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell
                    onClick={() => handleToShowOrder(item?.id)}
                    className="text-cursor"
                    component="th"
                    scope="row"
                  >
                    {item?.name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {item?.orderManager}
                  </TableCell>
                  <TableCell>
                    {fomatDate(item?.createdAt?.slice(0, 10))}
                  </TableCell>
                  <TableCell>{fomatDate(item?.deleveryDate)}</TableCell>
                  <TableCell sx={{ width: 250 }}>
                    {item?.status?.name && (
                      <div
                        className={`text-align-center ${styles["deal-status"]}
                            ${styles["bold"]}`}
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
                    {item?.ratePoint > 0 ? item?.ratePoint + " pt" : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {dataOrderListByDealId?.total > rowsPerPage && (
          <PaginationDefault
            total={dataOrderListByDealId?.total}
            setQuerySearch={setQuerySearch}
            paginateByParamUrl={false}
            setCustomPage={setPageOrderItem}
            customPage={pageOrderItem}
          />
        )}
      </TabPanel>

      <TabPanel value={value} index={2}>
        <TabPanelTaskList
          paramObject="dealId"
          idObject={id}
          dataTaskObject={dataTaskObject}
          setPageOrderItem={setPageOrderItem}
          pageOrderItem={pageOrderItem}
          handleOpenFormTask={handleOpenFormTask}
        />
      </TabPanel>

      <Box sx={{ marginTop: "40px" }}>
        <LogNote
          isLoggedInUserId={isLoggedInUserId}
          title={trans.home.activity}
          object={dataDealDetail}
          logNotes={dataLogNote}
          objectName="deals"
          getObject={getDetailDeal}
        />
      </Box>

      <FormCreateOrderFromDealDetail
        dataDealDetail={dataDealDetail}
        openEditModal={openFormModal}
        setOpenEditModal={setOpenFormModal}
      />
      <FormUpdateContactFromPageDetail
        dealId={dataDealDetail?.id}
        customer={dataDealDetail?.customer || null}
        defaultContactId={dataDealDetail?.contact?.id}
        openEditModal={openUpdateContactFormModal}
        setOpenEditModal={setOpenUpdateContactFormModal}
      />
      <ModalDelete
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        action={() => deleteDeal(id)}
        title={trans.deal.you_re_about_to_delete_your_deal}
        content={
          trans.deal
            .this_deal_will_be_permenently_removed_and_you_won_t_be_able_to_see_them_again_
        }
      />
      <ModalDeleteNotification
        openModalDeleteNotification={openModalDeleteNotification}
        setOpenModalDeleteNotification={setOpenModalDeleteNotification}
        title={trans.deal.you_re_about_to_delete_your_deal}
        content={trans.order.about_delete_content_deals}
      />
      <FormCreateTask
        openFormModal={openTaskFormModal}
        setOpenFormModal={setOpenTaskModal}
        dataDeal={dataDealDetail}
        onScreen={true}
      />
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  deal: state?.deal,
  status: state?.status,
  order: state?.order,
  category: state?.category,
  currency: state?.currency,
  user: state?.user,
  errors: state.deal?.error?.response?.data,
  task: state?.task,
  comment: state?.comment,
  profile: state?.profile,
});

const mapDispatchToProps = {
  getDetailDeal,
  clearData,
  getStatusList,
  updateDealStatus,
  getCategoryList,
  getCurrencyList,
  getOrderListByDealId,
  updateDeal,
  searchUser,
  getObjectTask,
  getDetailProfile,
  deleteDeal,
};

export default connect(mapStateToProps, mapDispatchToProps)(DealDetail);
