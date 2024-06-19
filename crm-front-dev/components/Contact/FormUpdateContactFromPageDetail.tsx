import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Divider,
  Grid,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import SelectDefault from "../Input/SelectDefault";
import { getContactListByCustomerId } from "../../redux/actions/contact";
import { updateDeal, clearData } from "../../redux/actions/deal";
import useTrans from "../../utils/useTran";

const FormUpdateContactFromPageDetail = (props: any) => {
  const {
    clearData,
    dealId,
    defaultContactId,
    customer = null,
    openEditModal,
    setOpenEditModal,
  } = props;
  const trans = useTrans();

  const { dataContactListByCustomerId } = props.contact;
  const { dataUpdateDeal } = props.deal;
  const { getContactListByCustomerId, updateDeal } = props;

  const INIT_DATA = {
    contactId: defaultContactId || null,
  };

  const [dataForm, setDataForm] = useState<any>(INIT_DATA);

  useEffect(() => {
    if (customer) getContactListByCustomerId(customer?.id);
  }, [customer, getContactListByCustomerId]);

  useEffect(() => {
    if (defaultContactId) setDataForm({ contactId: defaultContactId });
  }, [defaultContactId]);

  const handleChangeSelect = function (key: any, value: any) {
    setDataForm({ ...dataForm, [key]: Number(value) ?? "" });
  };

  const handleCloseEditModal = function () {
    if (dataUpdateDeal) clearData("dataUpdateDeal");
    setOpenEditModal(false);
  };

  const handleSubmitForm = async function (e: { preventDefault: () => void }) {
    updateDeal(dataForm, dealId);
    handleCloseEditModal();
  };

  return (
    <>
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        className="dialog-form"
      >
        <DialogTitle
          className="dialog-title"
          id="scroll-dialog-title"
          variant="h6"
        >
          {defaultContactId ? trans.contact.change_contact : trans.contact.add_contact}
          <Button onClick={handleCloseEditModal}>
            <Close />
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">{customer && customer.name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <SelectDefault
                labelText={trans.menu.contact}
                keyword="contactId"
                keyValue="firstName"
                keyValueTwo="lastName"
                keyMenuItem="id"
                data={dataContactListByCustomerId?.items ?? []}
                handleChange={handleChangeSelect}
                value={dataForm?.contactId}
              />
            </Grid>
          </Grid>
          <DialogActions className="dialog-actions">
            <Button onClick={handleSubmitForm} className="btn-save">
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
  contact: state?.contact,
  deal: state?.deal,
});

const mapDispatchToProps = {
  clearData,
  getContactListByCustomerId,
  updateDeal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormUpdateContactFromPageDetail);
