import {
  Avatar,
  Box,
  Card,
  Grid,
  Hidden,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import styled from "styled-components";
import InputBase from "../Input/InputBase";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import SelectDefault from "../Input/SelectDefault";
import DatePickerDefault from "../Input/DatePickerDefault";
import {
  updateOrderStatus,
  updateOrder,
  clearData,
} from "../../redux/actions/order";
import checkChangeDataBeforeUpdate from "../../utility/checkChangeDataBeforeUpdate";
import InputFormatNumber from "../Input/InputFormatNumber";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import getLinkAvatar from "../../utility/getLinkAvatar";
import { getFirstValueInObject } from "../../helpers";
import useTrans from "../../utils/useTran";
import moment from "moment";
import { partnerSaleOption } from "../../constants";
import fomatDate from "../../utility/fomatDate";

const OrderStatusTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    "&.Mui-selected": {
      clipPath: "polygon(8% 50%, 0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
      backgroundColor: "rgb(216, 247, 213)",
    },
  })
);

const BoxOrderInformation = (props: any) => {
  const trans = useTrans();
  const {
    dataForm,
    setDataForm,
    updateOrder,
    updateOrderStatus,
    dataOrderDetail,
    dataOrderStatusList,
    dataCategoryList,
    dataBillingList,
    dataCurrencyList,
    dataContactListByCustomerId,
    dataUserList,
    dataError,
    customer,
  } = props;
  const router = useRouter();
  const q: any = useMemo(() => router.query, [router]);
  const id = q?.id || "";
  const [orderStatusId, setOrderStatusId] = useState<number | null>(0);
  const [editDescriptionButton, setEditDescriptionButton] =
    useState<boolean>(false);
  const [editOrderDetail, setEditOrderDetail] = useState<boolean>(false);
  useEffect(() => {
    if (dataOrderDetail)
      setOrderStatusId(Number(dataOrderDetail?.status?.id) - 1);
  }, [dataOrderDetail]);

  const handleChangeInput = function (key: any, value: any) {
    setDataForm({ ...dataForm, [key]: value ?? "" });
  };

  const handleChangeSelect = function (key: any, value: any) {
    setDataForm({ ...dataForm, [key]: Number(value) });
  };

  useEffect(() => {
    if (editDescriptionButton) {
      setDataForm({ ...dataForm });
    }
  }, [editDescriptionButton]);

  const handleChangeOrderStatus = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      updateOrderStatus({ ...dataForm, ["statusId"]: newValue + 1 }, id);
      setOrderStatusId(newValue);
    },
    [dataForm, id, updateOrderStatus, setOrderStatusId]
  );

  const handleChangeEditOrderDetail = useCallback(() => {
    setEditOrderDetail((prevState) => !prevState);
    if (
      editOrderDetail &&
      (checkChangeDataBeforeUpdate(dataForm, dataOrderDetail) ||
        dataForm?.contactId !== Number(dataOrderDetail?.contact?.id) ||
        dataForm?.billingTypeId !== Number(dataOrderDetail?.billingType?.id) ||
        dataForm?.categoryId !== Number(dataOrderDetail?.category?.id) ||
        dataForm?.currencyId !== Number(dataOrderDetail?.currency?.id) ||
        dataForm?.userAssignId !== Number(dataOrderDetail?.userAssign?.id))
    ) {
      updateOrder(dataForm, id);
    }
  }, [editOrderDetail, dataForm, dataOrderDetail, id, updateOrder]);

  const handleChangeEditPartnerSaleButton = useCallback(() => {
    setEditDescriptionButton((prevState) => !prevState);
    if (editDescriptionButton) {
      updateOrder(dataForm, id);
    }
  }, [editDescriptionButton, dataForm, id, updateOrder]);

  const handleToShowContact = function (id: number) {
    return router.push(`/contact/${id}`);
  };

  const handleChangeInputNumber = useCallback((key: any, value: any) => {
    setDataForm((prevDataForm: any) => ({
      ...prevDataForm,
      [key]: Number(value) ?? null,
    }));
  }, []);

  const paymentInfo =
    {
      1: trans.partner?.TOTAL_PAYMENT_REVENUE,
      2: trans.partner?.TOTAL_PAYMENT_BY_PERIOD,
    }[Number(dataOrderDetail?.partners[0]?.saleType)] || "";

  return (
    <>
      <Card sx={{ margin: "20px 0" }}>
        <Grid container spacing={2} className={styles["grid-order-detail"]}>
          <Grid item md={6}></Grid>
          <Grid item md={6} className={styles["box-right"]}>
            <Box
              sx={{
                maxWidth: { xs: 320, sm: 500, md: 850 },
                bgcolor: "background.paper",
                marginLeft: "15px",
              }}
            >
              <Tabs
                value={orderStatusId}
                onChange={handleChangeOrderStatus}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
                TabIndicatorProps={{
                  style: { display: "none" },
                }}
              >
                {dataOrderStatusList &&
                  dataOrderStatusList?.map((orderStatus: any) => (
                    <OrderStatusTab
                      key={orderStatus?.id}
                      label={orderStatus?.name}
                    />
                  ))}
              </Tabs>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2} className={styles["grid-order-detail"]}>
          <Grid item md={6} xs={12}>
            <Box className={styles["box-order-detail"]}>
              <Grid container className={styles["grid-title-box"]}>
                <Grid item>
                  <Typography
                    className={styles["header-title"]}
                    sx={{ fontSize: "1rem", padding: "8px", fontWeight: "700" }}
                  >
                    {trans.order.order_detail}
                    <IconButton
                      onClick={handleChangeEditOrderDetail}
                      sx={{ padding: 0, marginLeft: "20px" }}
                    >
                      {editOrderDetail ? <SaveIcon /> : <EditIcon />}
                    </IconButton>
                  </Typography>
                </Grid>
              </Grid>
              {editOrderDetail ? (
                <Grid container className={styles["box-order-detail-form"]}>
                  <Grid item md={5} xs>
                    {trans.invoice.title}
                  </Grid>
                  <Grid item xs>
                    {editOrderDetail ? (
                      <InputBase
                        keyword="name"
                        size="small"
                        value={dataForm?.name}
                        handleChange={handleChangeInput}
                      />
                    ) : (
                      dataOrderDetail?.category?.name
                    )}
                  </Grid>
                </Grid>
              ) : (
                <Hidden />
              )}
              <Grid
                container
                className={
                  styles[
                    editOrderDetail
                      ? "box-order-detail-form"
                      : "box-order-detail-row"
                  ]
                }
              >
                <Grid item md={5} xs>
                  {trans.deal.category}
                </Grid>
                <Grid item xs>
                  {editOrderDetail ? (
                    <SelectDefault
                      keyword="categoryId"
                      keyMenuItem="id"
                      keyValue="name"
                      size="small"
                      data={dataCategoryList?.items ?? []}
                      value={dataForm?.categoryId}
                      handleChange={handleChangeSelect}
                    />
                  ) : (
                    dataOrderDetail?.category?.name
                  )}
                </Grid>
              </Grid>
              <Grid
                container
                className={
                  styles[
                    editOrderDetail
                      ? "box-order-detail-form"
                      : "box-order-detail-row"
                  ]
                }
              >
                <Grid item md={5} xs>
                  {trans.order.billing_type}
                </Grid>
                <Grid item xs>
                  {editOrderDetail ? (
                    <SelectDefault
                      keyword="billingTypeId"
                      keyMenuItem="id"
                      keyValue="name"
                      size="small"
                      data={dataBillingList ?? []}
                      value={dataForm?.billingTypeId}
                      handleChange={handleChangeSelect}
                    />
                  ) : (
                    dataOrderDetail?.billingType?.name
                  )}
                </Grid>
              </Grid>
              <Grid
                container
                className={
                  styles[
                    editOrderDetail
                      ? "box-order-detail-form"
                      : "box-order-detail-row"
                  ]
                }
              >
                <Grid item md={5} xs>
                  {trans.order.order_value}
                </Grid>
                <Grid item xs>
                  {editOrderDetail ? (
                    <Grid container spacing={2}>
                      <Grid item xs md={4}>
                        <SelectDefault
                          keyword="currencyId"
                          size="small"
                          keyMenuItem="id"
                          disabled={customer?.currency ? true : false}
                          keyValue="name"
                          value={dataForm?.currencyId}
                          data={dataCurrencyList}
                          handleChange={handleChangeSelect}
                        />
                      </Grid>
                      <Grid item xs>
                        <InputFormatNumber
                          keyword="orderValue"
                          size="small"
                          value={dataForm?.orderValue}
                          handleChange={handleChangeInput}
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    `${
                      dataOrderDetail?.orderValue
                        ? formatCurrencyValue(dataOrderDetail?.orderValue)
                        : ""
                    } ${dataOrderDetail?.customer?.currency?.sign ?? ""}`
                  )}
                </Grid>
              </Grid>
              <Grid
                container
                className={
                  styles[
                    editOrderDetail
                      ? "box-order-detail-form"
                      : "box-order-detail-row"
                  ]
                }
              >
                <Grid item md={5} xs>
                  {trans.order.start_date}
                </Grid>
                <Grid item xs>
                  {editOrderDetail ? (
                    <DatePickerDefault
                      keyword="startDate"
                      size="small"
                      value={dataForm?.startDate}
                      handleChange={handleChangeInput}
                      errorText={getFirstValueInObject(
                        dataError?.properties?.startDate
                      )}
                    />
                  ) : (
                    fomatDate(dataOrderDetail?.startDate)
                  )}
                </Grid>
              </Grid>
              <Grid
                container
                className={
                  styles[
                    editOrderDetail
                      ? "box-order-detail-form"
                      : "box-order-detail-row"
                  ]
                }
              >
                <Grid item md={5} xs>
                  {trans.order.due_date_}
                </Grid>
                <Grid item xs>
                  {editOrderDetail ? (
                    <DatePickerDefault
                      keyword="dueDate"
                      size="small"
                      value={dataForm?.dueDate}
                      handleChange={handleChangeInput}
                      errorText={getFirstValueInObject(
                        dataError?.properties?.dueDate
                      )}
                    />
                  ) : (
                    fomatDate(dataOrderDetail?.dueDate)
                  )}
                </Grid>
              </Grid>
              <Grid
                container
                className={
                  styles[
                    editOrderDetail
                      ? "box-order-detail-form"
                      : "box-order-detail-row"
                  ]
                }
              >
                <Grid item md={5} xs>
                  {trans.order.delivery_date}
                </Grid>
                <Grid item xs>
                  {editOrderDetail ? (
                    <DatePickerDefault
                      keyword="deleveryDate"
                      size="small"
                      value={dataForm?.deleveryDate}
                      handleChange={handleChangeInput}
                      errorText={getFirstValueInObject(
                        dataError?.properties?.deleveryDate
                      )}
                    />
                  ) : (
                    dataOrderDetail?.deleveryDate
                  )}
                </Grid>
              </Grid>
              <Grid
                container
                className={
                  styles[
                    editOrderDetail
                      ? "box-order-detail-form"
                      : "box-order-detail-row"
                  ]
                }
              >
                <Grid item md={5} xs>
                  {trans.menu.contact}
                </Grid>
                <Grid item xs>
                  {editOrderDetail ? (
                    <SelectDefault
                      keyword="contactId"
                      keyMenuItem="id"
                      keyValue="firstName"
                      keyValueTwo="lastName"
                      size="small"
                      value={dataForm?.contactId}
                      data={dataContactListByCustomerId?.items ?? []}
                      handleChange={handleChangeSelect}
                    />
                  ) : (
                    <span
                      className="text-cursor"
                      onClick={() =>
                        handleToShowContact(dataOrderDetail?.contact?.id)
                      }
                    >
                      {`${dataOrderDetail?.contact?.firstName ?? ""} ${
                        dataOrderDetail?.contact?.lastName ?? ""
                      }`}
                    </span>
                  )}
                </Grid>
              </Grid>
              <Grid
                container
                className={
                  styles[
                    editOrderDetail
                      ? "box-order-detail-form"
                      : "box-order-detail-row"
                  ]
                }
              >
                <Grid item md={5} xs>
                  {trans.order.manager}
                </Grid>
                <Grid item xs>
                  {editOrderDetail ? (
                    <InputBase
                      keyword="orderManager"
                      size="small"
                      value={dataForm?.orderManager}
                      handleChange={handleChangeInput}
                    />
                  ) : (
                    dataOrderDetail?.orderManager
                  )}
                </Grid>
              </Grid>
              <Grid
                container
                className={
                  styles[
                    editOrderDetail
                      ? "box-order-detail-form"
                      : "box-order-detail-row"
                  ]
                }
              >
                <Grid item md={5} xs>
                  {trans.customer.assigned}
                </Grid>
                <Grid item xs>
                  {editOrderDetail ? (
                    <SelectDefault
                      keyword="userAssignId"
                      keyMenuItem="id"
                      keyValue="profile"
                      keyValuePropertyOne="first_name"
                      keyValuePropertyTwo="last_name"
                      size="small"
                      value={dataForm?.userAssignId}
                      data={dataUserList?.items ?? []}
                      handleChange={handleChangeSelect}
                    />
                  ) : (
                    <>
                      {dataOrderDetail?.userAssign?.profile && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            src={
                              dataOrderDetail?.userAssign?.profile?.profileImg
                                ? getLinkAvatar(
                                    dataOrderDetail?.userAssign?.profile
                                      ?.profileImg
                                  )
                                : ""
                            }
                            alt="Picture of the author"
                            sx={{ width: 24, height: 24 }}
                          />
                          <div style={{ marginLeft: "5px" }}>
                            {`${dataOrderDetail?.userAssign?.profile?.first_name} ${dataOrderDetail?.userAssign?.profile?.last_name}`}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item md={6} xs={12}>
            <Box className={styles["description-box"]}>
              <Grid container className={styles["grid-title-box"]}>
                <Grid item>
                  <Typography
                    sx={{ fontSize: "1rem", padding: "8px", fontWeight: "700" }}
                  >
                    {trans.partner.partner_name}
                    {Number(dataOrderDetail?.partners[0]?.saleType) ===
                      partnerSaleOption.TOTAL_PAYMENT_REVENUE && (
                      <IconButton
                        onClick={handleChangeEditPartnerSaleButton}
                        sx={{ marginLeft: "20px", padding: 0 }}
                      >
                        {editDescriptionButton ? <SaveIcon /> : <EditIcon />}
                      </IconButton>
                    )}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                className={
                  styles[
                    editOrderDetail
                      ? "box-order-detail-form"
                      : "box-order-detail-row"
                  ]
                }
              >
                <Grid item md={4} xs className={styles["contact-detail-title"]}>
                  {trans.partner.partner_name}
                </Grid>
                {editDescriptionButton ? (
                  <>{dataOrderDetail?.partners[0]?.partners?.name}</>
                ) : (
                  <Grid item xs>
                    {dataOrderDetail?.partners[0]?.partners?.name}
                  </Grid>
                )}
              </Grid>
              <Grid
                container
                className={
                  styles[
                    editOrderDetail
                      ? "box-order-detail-form"
                      : "box-order-detail-row"
                  ]
                }
              >
                <Grid item md={4} xs className={styles["contact-detail-title"]}>
                  {trans.partner.partner_payment_option}
                </Grid>
                {editDescriptionButton ? (
                  <>{paymentInfo}</>
                ) : (
                  <Grid item xs>
                    {paymentInfo}
                  </Grid>
                )}
              </Grid>
              <Grid
                container
                className={
                  styles[
                    editOrderDetail
                      ? "box-order-detail-form"
                      : "box-order-detail-row"
                  ]
                }
              >
                <Grid item md={4} xs className={styles["contact-detail-title"]}>
                  {trans.partner.payment_tern}
                </Grid>
                <Grid item xs>
                  {dataOrderDetail?.partners[0]?.startDate
                    ? moment(dataOrderDetail?.partners[0]?.startDate).format(
                        "YYYY-MM-DD"
                      )
                    : ""}{" "}
                  {dataOrderDetail?.partners[0]?.startDate ? "-" : ""}{" "}
                  {dataOrderDetail?.partners[0]?.endDate
                    ? moment(dataOrderDetail?.partners[0]?.endDate).format(
                        "YYYY-MM-DD"
                      )
                    : ""}
                </Grid>
              </Grid>

              <Grid
                container
                className={
                  styles[
                    editOrderDetail
                      ? "box-order-detail-form"
                      : "box-order-detail-row"
                  ]
                }
                sx={{ marginTop: "10px" }}
              >
                <Grid item md={4} xs className={styles["contact-detail-title"]}>
                  {trans.partner.sale}
                </Grid>
                {editDescriptionButton ? (
                  <Grid item xs={6}>
                    <InputFormatNumber
                      keyword="partnerSalePercent"
                      size="small"
                      placeholder={trans.partner.sale}
                      value={dataForm?.partnerSalePercent}
                      handleChange={handleChangeInputNumber}
                      errorText={getFirstValueInObject(
                        dataForm?.partnerSalePercent
                      )}
                    />
                  </Grid>
                ) : (
                  <Grid item xs>
                    {dataOrderDetail?.partners[0]?.salePercent}{" "}
                    {dataOrderDetail?.partners[0]?.salePercent ? "%" : ""}
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  order: state?.order,
});

const mapDispatchToProps = {
  updateOrderStatus,
  updateOrder,
  clearData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BoxOrderInformation);
