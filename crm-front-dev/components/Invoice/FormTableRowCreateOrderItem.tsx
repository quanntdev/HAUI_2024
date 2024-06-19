import { IconButton, Stack, TableCell, TableRow } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import InputBase from "../Input/InputBase";
import { useState } from "react";
import InputFormatNumber from "../Input/InputFormatNumber";
import { REGEX_NUMBER } from "../../constants";

const INIT_DATA = {
  uid: "",
  name: "",
  value: "",
  tax_rate: "",
  total_value: "",
};

const FormTableRowCreateOrderItem = (props: any) => {
  const { setNewLine } = props;
  const [dataForm, setDataForm] = useState<any>(INIT_DATA);
  const [taxRateFormError, setTaxRateFormError] = useState<boolean>(false);

  const handleChangeInput = (key: any, value: any) => {
    setDataForm({
      ...dataForm,
      [key]: value,
      ["total_value"]: "0",
    });
  };

  const handleSubmitForm = () => {
    if (REGEX_NUMBER.test(dataForm?.tax_rate)) {
      setTaxRateFormError(false);
      if (dataForm?.name != "" && dataForm?.value != "") {
        dataForm["uid"] = Date.now().toString();
        props.orderItemList?.push(dataForm);
        handleCloseForm();
      }
    } else setTaxRateFormError(true);
  };

  const handleCloseForm = () => {
    setNewLine(null);
  };

  return (
    <TableRow role="checkbox" hover sx={{ "& > *": { height: "10%" } }}>
      <TableCell></TableCell>
      <TableCell>#</TableCell>
      <TableCell>
        <InputBase
          keyword="name"
          size="small"
          value={dataForm?.name}
          handleChange={handleChangeInput}
        />
      </TableCell>
      <TableCell>
        <InputFormatNumber
          keyword="value"
          size="small"
          value={dataForm?.value}
          handleChange={handleChangeInput}
        />
      </TableCell>
      <TableCell>
        <InputBase
          keyword="tax_rate"
          size="small"
          displayErrorText={false}
          errorText={taxRateFormError}
          value={dataForm?.tax_rate}
          handleChange={handleChangeInput}
        />
      </TableCell>
      <TableCell></TableCell>
      <TableCell>
        <Stack flexDirection="row">
          <IconButton onClick={handleSubmitForm}>
            <SaveIcon />
          </IconButton>
          <IconButton onClick={handleCloseForm}>
            <ClearIcon />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default FormTableRowCreateOrderItem;
