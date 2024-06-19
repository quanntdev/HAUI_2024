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
import styles from "./styles.module.scss";
import { Close } from "@mui/icons-material";
import { connect } from "react-redux";
import InputBase from "../Input/InputBase";
import { createSaleChannel, clearData } from "../../redux/actions/saleChannel";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useTrans from "../../utils/useTran";

const FormCreateSaleChannel = (props: any) => {
  const trans = useTrans();
  const { openModal, setOpenModal, createSaleChannel, clearData } = props;
  const initData = {
    name: "",
  };
  const [dataForm, setDataForm] = useState<any>(initData);
  const { dataCreateSaleChannel } = props.saleChannel;
  const router = useRouter();

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setDataForm(initData);
    clearData("dataCreateSaleChannel");
  }, [setOpenModal, setDataForm, clearData]);

  const handleChangeInput = useCallback((key: any, value: any) => {
    if (value === "") value = "";
    setDataForm((prevDataForm:any) => ({
      ...prevDataForm,
      [key]: value,
    }));
  }, [setDataForm]);

  const handleCreateSaleChannel = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      createSaleChannel(dataForm);
    },
    [createSaleChannel, dataForm]
  );

  useEffect(() => {
    if (dataCreateSaleChannel) {
      handleCloseModal();
    }
  }, [dataCreateSaleChannel]);

  useEffect(() => {
    if (dataCreateSaleChannel) {
      router.push(router.route);
    }
  }, [dataCreateSaleChannel]);

  return (
    <>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        className="dialog-edit"
        classes={{
          container: "form-dialog-container",
          paper: "form-dialog-paper",
        }}
      >
        <DialogTitle
          className={styles["dialog-title"]}
          id="scroll-dialog-title"
        >
          <Typography variant="h6">
            {trans.sale_channel.create_sale_channel}
          </Typography>
          <Button onClick={handleCloseModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box className={styles["box-title"]}>
            <Typography>{trans.sale_channel.sale_channel}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <InputBase
                labelText={trans.sale_channel.channel_name}
                keyword="name"
                placeholder={trans.sale_channel.channel_name}
                type="text"
                value={dataForm?.name}
                handleChange={handleChangeInput}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={styles["dialog-actions"]}>
          <Button className="btn-save" onClick={handleCreateSaleChannel}>
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
  saleChannel: state.saleChannel,
});

const mapDispatchToProps = {
  createSaleChannel,
  clearData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormCreateSaleChannel);
