import { TableRow, TableCell, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import { connect } from "react-redux";
import InputBase from "../Input/InputBase";
import { createOrderItem, clearData } from "../../redux/actions/orderItem";
import InputFormatNumber from "../Input/InputFormatNumber";

const FormUpdateDetailInvoice = (props: any) => {
  const { setNewLineOrderItem, indexOrderItem } = props;

  const INIT_DATA_IVOICE_ORDER_ITEMS = {
    name: "",
    tax_rate: "",
    value: "",
  };

  const [dataFormData, setDataFormData] = useState(
    INIT_DATA_IVOICE_ORDER_ITEMS
  );

  const handleChangeInput = (key: any, value: any) => {
    setDataFormData({ ...dataFormData, [key]: value ?? "" });
  };

  const handleChangeInputad = (key: any, value: any) => {
    if (key === "value") {
      setDataFormData({ ...dataFormData, [key]: value ?? "" });
      return;
    }
    setDataFormData({ ...dataFormData, [key]: +value ?? "" });
  };

  const handleSubmitForm = () => {
    props.orderItemList.push({
      ...dataFormData,
      value: dataFormData.value.split(",").join(""),
    });
    setNewLineOrderItem(null);
  };

  const handleSubmitFormByEnter = (e: { key: string; keyCode: number }) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      handleSubmitForm();
    }
  };

  const handleCloseForm = () => {
    setNewLineOrderItem(null);
  };

  return (
    <>
      <TableRow>
        <TableCell>{indexOrderItem + 1}</TableCell>
        <TableCell>
          <InputBase
            keyword="name"
            placeholder="Name"
            size="small"
            value={dataFormData?.name}
            displayErrorText={false}
            onKeyUp={handleSubmitFormByEnter}
            handleChange={handleChangeInput}
            // errorText={getFirstValueInObject(dataError?.title)}
          />
        </TableCell>
        <TableCell>
          <InputFormatNumber
            size="small"
            keyword="value"
            placeholder="Value"
            value={dataFormData?.value}
            onKeyUp={handleSubmitFormByEnter}
            handleChange={handleChangeInputad}
          />
        </TableCell>
        <TableCell>
          <InputFormatNumber
            keyword="tax_rate"
            size="small"
            placeholder="Tax Rate"
            displayErrorText={false}
            value={dataFormData?.tax_rate}
            onKeyUp={handleSubmitFormByEnter}
            handleChange={handleChangeInputad}
            // errorText={getFirstValueInObject(dataError?.value)}
          />
        </TableCell>
        <TableCell className="text-align-right">
          <IconButton size="small" onClick={handleSubmitForm}>
            <SaveIcon />
          </IconButton>
          <IconButton size="small" onClick={handleCloseForm}>
            <ClearIcon />
          </IconButton>
        </TableCell>
        <TableCell></TableCell>
      </TableRow>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  errors: state.orderItem?.error?.response?.data?.properties ?? {},
});

const mapDispatchToProps = {
  createOrderItem,
  clearData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormUpdateDetailInvoice);
