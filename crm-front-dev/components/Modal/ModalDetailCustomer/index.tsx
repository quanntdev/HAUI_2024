import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import styles from "./styles.module.scss";
import { connect } from "react-redux";
import { clearData, mergeCustomer } from "../../../redux/actions/customer";
import { useCallback, useEffect } from "react";
import { successToast } from "../../../BaseAxios/toast";
import useTrans from "../../../utils/useTran";

const ModalDetailCustomer = (props: any) => {
  const trans = useTrans();
  const { mergeCustomer, clearData } = props;
  const { dataMergeCustomer } = props.customer;
  const { openModal, setOpenModal, title, idCustomer, customerMerge } = props;

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  const handleMergeCustomer = useCallback(() => {
    mergeCustomer(idCustomer, customerMerge);
  }, [idCustomer, customerMerge]);

  useEffect(() => {
    if (dataMergeCustomer) {
      clearData("dataMergeCustomer");
      setOpenModal(false);
      successToast("Merge success");
    }
  }, [dataMergeCustomer]);

  return (
    <Dialog
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          width: "30%",
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center" }} id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {customerMerge?.name && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1" color="initial">
                {trans.customer.name}
              </Typography>
              <TextField
                disabled
                variant="outlined"
                style={{ width: "100%" }}
                value={customerMerge?.name}
              />
            </Box>
          )}

          {customerMerge?.subName && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1" color="initial">
                {trans.customer.sub_name}
              </Typography>
              <TextField
                disabled
                variant="outlined"
                value={customerMerge?.subName}
                style={{ width: "100%" }}
              />
            </Box>
          )}

          {customerMerge?.phone && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1" color="initial">
                {"Phone"}
              </Typography>
              <TextField
                disabled
                variant="outlined"
                value={customerMerge?.phone}
                style={{ width: "100%" }}
              />
            </Box>
          )}

          {customerMerge?.level && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1" color="initial">
                {trans.customer_detail.customer_level}
              </Typography>
              <TextField
                disabled
                variant="outlined"
                value={customerMerge?.level}
                style={{ width: "100%" }}
              />
            </Box>
          )}

          {customerMerge?.address && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1" color="initial">
                {trans.customer_detail.address}
              </Typography>
              <TextField
                disabled
                variant="outlined"
                style={{ width: "100%" }}
                value={customerMerge?.address}
              />
            </Box>
          )}

          {customerMerge?.capital && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1" color="initial">
                {trans.customer_detail.capital}
              </Typography>
              <TextField
                disabled
                variant="outlined"
                style={{ width: "100%" }}
                value={customerMerge?.capital}
              />
            </Box>
          )}

          {customerMerge?.cidCode && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1" color="initial">
                {trans.customer_detail.cid}
              </Typography>
              <TextField
                disabled
                variant="outlined"
                style={{ width: "100%" }}
                value={customerMerge?.cidCode}
              />
            </Box>
          )}

          {customerMerge?.city && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1" color="initial">
                {trans.customer_detail.city}
              </Typography>
              <TextField
                disabled
                variant="outlined"
                style={{ width: "100%" }}
                value={customerMerge?.city}
              />
            </Box>
          )}

          {customerMerge?.description && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1" color="initial">
                {trans.customer_detail.description_information}
              </Typography>
              <TextField
                disabled
                variant="outlined"
                style={{ width: "100%" }}
                value={customerMerge?.description
                  .replace("<p>", "")
                  .replace("</p>", "")}
              />
            </Box>
          )}

          {customerMerge?.email && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1" color="initial">
                {trans.customer_detail.email}
              </Typography>
              <TextField
                disabled
                variant="outlined"
                style={{ width: "100%" }}
                value={customerMerge?.email}
              />
            </Box>
          )}

          {customerMerge?.country && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1" color="initial">
                {trans.country.country}
              </Typography>
              <TextField
                disabled
                variant="outlined"
                style={{ width: "100%" }}
                value={customerMerge?.country}
              />
            </Box>
          )}

          {customerMerge?.website && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1" color="initial">
                {trans.customer_detail.website}
              </Typography>
              <TextField
                disabled
                variant="outlined"
                style={{ width: "100%" }}
                value={customerMerge?.website}
              />
            </Box>
          )}

          {customerMerge?.fax && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1" color="initial">
                {trans.customer_detail.fax}
              </Typography>
              <TextField
                disabled
                variant="outlined"
                style={{ width: "100%" }}
                value={customerMerge?.fax}
              />
            </Box>
          )}

          {customerMerge?.postalCode && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1" color="initial">
                {trans.customer_detail.postal_code}
              </Typography>
              <TextField
                disabled
                variant="outlined"
                style={{ width: "100%" }}
                value={customerMerge?.postalCode}
              />
            </Box>
          )}

          {customerMerge?.priority && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1" color="initial">
                {trans.customer_detail.priority}
              </Typography>
              <TextField
                disabled
                variant="outlined"
                style={{ width: "100%" }}
                value={customerMerge?.priority}
              />
            </Box>
          )}
        </DialogContentText>
        <Button className={styles["btn-merge"]} onClick={handleMergeCustomer}>
          Merge Customer
        </Button>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state: any) => ({
  customer: state.customer,
});

const mapDispatchToProps = {
  mergeCustomer,
  clearData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalDetailCustomer);
