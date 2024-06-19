import { Close } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import styles from "./styles.module.scss";
import { connect } from "react-redux";
import { FOMAT_DATE } from "../../constants";
import useTrans from "../../utils/useTran";
import { useCallback, useEffect, useState } from "react";
import {
  clearData as clearDataPayment,
  getDetailPaymentPartner,
} from "../../redux/actions/partnerPayment";
import { useRouter } from "next/router";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import Link from "next/link";
import FormCreateOrUpdatePayment from "./FormCreateOrUpdatePayment";
import { getDetailProfile } from "../../redux/actions/profile";
import LogNote from "../LogNote";
import LogoCraw from "../../assets/images/logoCraw.png";

const FormDetailPaymentPartner = (props: any) => {
  //use Hook
  const trans = useTrans();
  const router = useRouter();

  //varriable (if default)

  //props
  const { openModal, setOpenModal, getDetailPaymentPartner, clearDataPayment, getDetailProfile } = props;
  const { dataDetailPaymentPartner, dataUpdatePaymentPartner } =
    props.partnerPayment;
  const { dataDetailProfile } = props?.profile;

  //useState
  const [changeSwitch, setChangeSwitch] = useState<boolean>(false);
  const [editPayment, setEditPayment] = useState<boolean>(false);
  const [isLoggedInUserId, setIsLoggedInUserId] = useState<any>();

  //list handle open/close modal
  const handleCloseModal = useCallback(() => {
    clearDataPayment("dataDetailPaymentPartner");
    router.push({
      pathname: router.pathname
    });
    setOpenModal((prevOpenModal:any )=> !prevOpenModal);
  }, [clearDataPayment, router]);

  const handleEditPayment = useCallback(() => {
    setEditPayment(true);
  }, []);

  const handleChangePaymentType = useCallback(() => {
    setChangeSwitch((prevState) => !prevState);
  }, []);

  // list handle Change data

  //useEfffect
  useEffect(() => {
    clearDataPayment("dataDetailPaymentPartner")
    if (router.query?.paymentId) {
      getDetailPaymentPartner(router.query?.paymentId);
    }
  }, [router.query]);

  useEffect(() => {
    if(dataUpdatePaymentPartner) {
      setEditPayment(false)
      setOpenModal(false)
      setChangeSwitch(false)
    }
  }, [dataUpdatePaymentPartner])

  useEffect(() => {
    if (!dataDetailProfile) {
      getDetailProfile();
    } else {
      setIsLoggedInUserId(dataDetailProfile?.id);
    }
  }, [dataDetailProfile]);

  // other (like const, varriable, ...)

  const handleShowPartner = (id : number) => router.push(`/partner/partner-list/${id}`)
  const handleShowOrder = (id : number) => router.push(`/order/${id}`)

  if(dataDetailPaymentPartner){
    return (
      <>
       <Dialog
        open={openModal && !editPayment}
        onClose={handleCloseModal}
        className={styles["dialog"]}
        fullWidth
        disableEnforceFocus={true}
        disableAutoFocus={true}
        maxWidth={changeSwitch ? "lg" : "sm"}
      >
        <DialogTitle className={styles["dialog-title"]} id="scroll-dialog-title">
          <Typography variant="h6">
            {trans.payment.payment_details}{" "}
            <Switch defaultChecked onChange={handleChangePaymentType} />{" "}
          </Typography>
          <Button onClick={handleCloseModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        {changeSwitch ? (
          <>
            <DialogContent className="">
              <Box className={styles["box-detail"]}>
                <Box className={styles["form-box"]}>
                  <Grid container>
                    <Grid className={styles["form-title"]} item xs={4}>
                      <Typography className={styles["form-typography"]}>
                        {trans.partner.payment_partner_ID}
                      </Typography>
                    </Grid>
                    <Grid
                      className={`${styles["form-title-text"]} ${styles["flex-payment"]}`}
                      item
                      xs={8}
                    >
                      <Typography className={`${styles["box-text-total"]} ml-8`}>
                        #{dataDetailPaymentPartner?.data?.id}
                      </Typography>
                      <span
                        className="text-cursor mr-8"
                        onClick={handleEditPayment}
                      >
                        <EditIcon />
                      </span>
                    </Grid>
                  </Grid>
                </Box>
                <Box className={styles["form-box"]}>
                  <Grid container>
                    <Grid className={styles["form-title"]} item xs={4}>
                      <Typography className={styles["form-typography"]}>
                        {trans.partner.invoice_partner_id}
                      </Typography>
                    </Grid>
                    <Grid className={styles["form-title-text"]} item xs={8}>
                      <Typography
                        className={`${styles["box-text-total-push"]} ml-8`}
                      >
                         {dataDetailPaymentPartner?.data?.invoicePartner?.code}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box className={styles["form-box"]}>
                  <Grid container>
                    <Grid className={styles["form-title"]} item xs={4}>
                      <Typography className={styles["form-typography"]}>
                        {trans.payment.amount_}
                      </Typography>
                    </Grid>
                    <Grid className={styles["form-title-text"]} item xs={8}>
                      <Typography className={`${styles["box-text-total"]} ml-8`}>
                        {formatCurrencyValue(dataDetailPaymentPartner?.data?.amount) ?? ""}{" "}
                           {dataDetailPaymentPartner?.data?.invoicePartner?.currency_sign}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box className={styles["form-box"]}>
                  <Grid container>
                    <Grid className={styles["form-title"]} item xs={4}>
                      <Typography className={styles["form-typography"]}>
                        {trans.menu.partner}
                      </Typography>
                    </Grid>
                    <Grid className={styles["form-title-text"]} item xs={8}>
                      <Typography
                        className={`${styles["box-text-total-push"]} ml-8 text-cursor`}
                      >
                        {dataDetailPaymentPartner?.data?.partner?.name  ? (
                              <Link
                                href={
                                  window.location.origin +
                                  "/partner/partner-list/" +
                                  dataDetailPaymentPartner?.data?.partner?.id
                                }
                                className="text-overflow"
                              >
                                {dataDetailPaymentPartner?.data?.partner?.name}
                              </Link>
                            ) : (
                              ""
                            )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box className={styles["form-box"]}>
                  <Grid container>
                    <Grid className={styles["form-title"]} item xs={4}>
                      <Typography className={styles["form-typography"]}>
                        {trans.menu.order}
                      </Typography>
                    </Grid>
                    <Grid className={styles["form-title-text"]} item xs={8}>
                      <Typography
                        className={`${styles["box-text-total-push"]} ml-8 text-cursor`}
                      >
                        {dataDetailPaymentPartner?.data?.order?.name ? (
                              <Link
                                href={
                                  window.location.origin +
                                  "/order/" +
                                  dataDetailPaymentPartner?.data?.order?.id
                                }
                                className="text-overflow"
                              >
                                {dataDetailPaymentPartner?.data?.order?.name}
                              </Link>
                            ) : (
                              ""
                            )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box className={styles["form-box"]}>
                  <Grid container>
                    <Grid className={styles["form-title"]} item xs={4}>
                      <Typography className={styles["form-typography"]}>
                        {trans.payment.transaction_id}
                      </Typography>
                    </Grid>
                    <Grid className={styles["form-title-text"]} item xs={8}>
                      <Typography className={`${styles["box-text-total"]} ml-8`}>
                        {dataDetailPaymentPartner?.data?.transactionId}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box className={styles["form-box"]}>
                  <Grid container>
                    <Grid className={styles["form-title"]} item xs={4}>
                      <Typography className={styles["form-typography"]}>
                        {trans.customer_detail.date}
                      </Typography>
                    </Grid>
                    <Grid className={styles["form-title-text"]} item xs={8}>
                      <Typography className={`${styles["box-text-total"]} ml-8`}>
                        {moment(dataDetailPaymentPartner?.data?.paymentDate).format(FOMAT_DATE)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box className={styles["form-box"]}>
                  <Grid container>
                    <Grid className={styles["form-title"]} item xs={4}>
                      <Typography className={styles["form-typography"]}>
                        {trans.payment.payment_method_}
                      </Typography>
                    </Grid>
                    <Grid className={styles["form-title-text"]} item xs={8}>
                      <Typography className={`${styles["box-text-total"]} ml-8`}>
                        {dataDetailPaymentPartner?.data?.method?.name}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box className={styles["form-box"]}>
                  <Grid container>
                    <Grid className={styles["form-title"]} item xs={4}>
                      <Typography className={styles["form-typography"]}>
                        {trans.payment.notes}
                      </Typography>
                    </Grid>
                    <Grid className={styles["form-title-text"]} item xs={8}>
                      <Typography className={`${styles["box-text-total"]} ml-8`}>
                        <span className="description-img"
                              dangerouslySetInnerHTML={{
                                __html: dataDetailPaymentPartner?.data?.notes
                              }}
                            />
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box style={{ padding: 16 }}>
                      <LogNote
                        isLoggedInUserId={isLoggedInUserId}
                        title={trans.home.activity}
                        object={dataDetailPaymentPartner?.data}
                        logNotes={dataDetailPaymentPartner?.logNotes}
                        objectName="payment_partner"
                        getObject={getDetailPaymentPartner}
                      />
                    </Box>
              </Box>
            </DialogContent>
          </>
        ) : (
          <>
            <DialogContent>
              <Box sx={{ width: "100%" }}>
                <div className={styles["sample"]}>
                  <div className={styles["main-block"]}>
                    <div className={styles["content"]}>
                      <Avatar
                        src={LogoCraw?.src}
                        alt="HapoSoft VN"
                        sx={{
                          width: 50,
                          height: 50,
                          marginTop: "10px",
                          marginLeft: "10px",
                          background: "white"
                        }}
                      />
                      <div className={styles["company-name"]}>HAPOSOFT VN</div>
                    </div>
                  </div>
                  <div className={styles["triangle"]}></div>
                </div>
                <div className={styles["right-title"]}></div>
                <div className="clear"></div>
                <div className={styles["sample"]}>
                  <div className={styles["triangle4"]}></div>
                  <div className={styles["triangle2"]}></div>
                  <div className={styles["triangle3"]}></div>
                  <div className={styles["main-block2"]}>
                    <div className={styles["content"]}>
                      <div></div>
                      <div className={styles["partner-name-center"]}>
                        <div className={styles["partner-name"]} onClick={() => handleShowPartner(dataDetailPaymentPartner?.data?.partner?.id)}>
                          {dataDetailPaymentPartner?.data?.partner?.name}
                        </div>
                        <div className="clear"></div>
                        <div className={styles["order-name"]} onClick={() => handleShowOrder(dataDetailPaymentPartner?.data?.order?.id)} >
                          <span className={styles["order-span"]}>{trans.menu.order}: </span>{" "}
                          {dataDetailPaymentPartner?.data?.order?.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Box sx={{ marginTop: "20px" }} className={styles["content-box"]}>
                  <div className={styles["content-title"]}>
                    {trans.payment.amount_}
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "10px",
                    }}
                  >
                    <div>{formatCurrencyValue(dataDetailPaymentPartner?.data?.amount)}</div>
                    <div>{dataDetailPaymentPartner?.data?.currency?.sign}</div>
                  </Box>
                </Box>
                <Box sx={{ marginTop: "20px" }} className={styles["content-box"]}>
                  <div className={styles["content-title"]}>
                    {trans.partner.invoice_partner_id}
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "10px",
                    }}
                  >
                    <div>{dataDetailPaymentPartner?.data?.invoicePartner?.code}</div>
                  </Box>
                </Box>
                <Box sx={{ marginTop: "20px" }} className={styles["content-box"]}>
                  <div className={styles["content-title"]}>
                    {trans.payment.transaction_id}
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "10px",
                    }}
                  >
                    <div>{dataDetailPaymentPartner?.data?.transactionId}</div>
                  </Box>
                </Box>
                <Box sx={{ marginTop: "20px" }} className={styles["content-box"]}>
                  <div className={styles["content-title"]}>
                    {trans.payment.payment_method_}
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "10px",
                    }}
                  >
                    <div>{dataDetailPaymentPartner?.data?.method?.name}</div>
                    <div>{moment(dataDetailPaymentPartner?.data?.paymentDate).format(FOMAT_DATE)}</div>
                  </Box>
                </Box>
                <Box sx={{ marginTop: "20px" }} className={styles["content-box"]}>
                  <div className={styles["content-title"]}>
                    {trans.payment.notes}
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "10px",
                    }}
                  >
                    <div>
                      <span
                        className="description-img"
                        dangerouslySetInnerHTML={{
                          __html:
                          dataDetailPaymentPartner?.data?.notes
                        }}
                      />
                    </div>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions className={styles["dialog-actions"]}>
              <Button className="btn-save" onClick={handleEditPayment}>
                {trans.task.edit}
              </Button>
            </DialogActions>
          </>
        )}
       </Dialog>
       {editPayment &&  (
        <FormCreateOrUpdatePayment
          openModal={editPayment}
          setOpenModal={setEditPayment}
          dataDetail={dataDetailPaymentPartner}
          updated={true}
          isLoggedInUserId={isLoggedInUserId}
        />
       )}
      </>
    );
  }

  return <></>
};

const mapStateToProps = (state: any) => ({
  partnerPayment: state?.partnerPayment,
  errors: state.partnerPayment?.error?.response?.data?.properties ?? {},
  profile: state?.profile,
});

const mapDispatchToProps = {
  getDetailPaymentPartner,
  clearDataPayment,
  getDetailProfile
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormDetailPaymentPartner);
