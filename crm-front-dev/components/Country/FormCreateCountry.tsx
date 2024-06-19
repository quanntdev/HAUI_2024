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
import SelectDefault from "../Input/SelectDefault";
import { createCountry, clearData } from "../../redux/actions/countries";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useTrans from "../../utils/useTran";

const FormCreateCountry = (props: any) => {
  const trans = useTrans();
  const { openModal, setOpenModal, createCountry, clearData, countries } =
    props;
  const initData = {
    name: "",
    full_name: "",
  };
  const [dataForm, setDataForm] = useState<any>(initData);
  const { dataCreateCountry } = props.country;
  const router = useRouter();

  const handleChangeSelect = function (key: any, value: any) {
    setDataForm({ ...dataForm, [key]: value });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setDataForm(initData);
    clearData("dataCreateCountry");
  };

  const handleCreateCountry = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    createCountry(dataForm);
  };

  useEffect(() => {
    if (dataCreateCountry) {
      handleCloseModal();
    }
  }, [dataCreateCountry]);

  useEffect(() => {
    if (dataCreateCountry) {
      router.push(router.route);
    }
  }, [dataCreateCountry]);

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
            {trans.country.add_country}
          </Typography>
          <Button onClick={handleCloseModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box className={styles["box-title"]}>
            <Typography>{trans.country.country}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item md={6} mt={2}>
              <SelectDefault
                labelText={trans.country.country}
                keyword="name"
                keyMenuItem="cca2"
                keyValue="name"
                keyValuePropertyOne="common"
                data={countries}
                value={dataForm?.name}
                handleChange={handleChangeSelect}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={styles["dialog-actions"]}>
          <Button className="btn-save" onClick={handleCreateCountry}>
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
  country: state.country,
});

const mapDispatchToProps = {
  createCountry,
  clearData,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormCreateCountry);
