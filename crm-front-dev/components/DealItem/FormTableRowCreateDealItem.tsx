import { TableRow, TableCell, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import InputBase from "../Input/InputBase";
import DatePickerDefault from "../Input/DatePickerDefault";
import SelectDefault from "../Input/SelectDefault";
import { getFirstValueInObject } from "../../helpers";
import InputFormatNumber from "../Input/InputFormatNumber";
import {
  createDeal,
  clearData,
} from "../../redux/actions/deal";
import useTrans from "../../utils/useTran";

type DataFormType = {
  name: string;
  categoryId: number | null;
  forecastCloseDate: Date | null;
  currencyId: number | null;
  probabilityWinning: number | null;
  customerId: number | null;
  price: string | null;
}

const INIT_DATA = {
  name: "",
  categoryId: null,
  forecastCloseDate: null,
  currencyId: null,
  probabilityWinning: null,
  customerId: null,
  price: "",
}

const INIT_ERROR = {
  name: "",
}

const FormTableRowCreateDealItem = (props: any) => {
  const trans = useTrans();
  const {
    dataCategoryList,
    dataCurrencyList,
    customerId,
    setNewLineDeal,
    createDeal,
    errors,
    indexDealItem,
  } = props

  const [dataForm, setDataForm] = useState<DataFormType>(INIT_DATA);
  const [dataErr, setDataErr] = useState(INIT_ERROR);

  useEffect(() => {
    setDataForm({
      ...dataForm,
      customerId: Number(customerId),
    });
  }, [customerId]);

  const handleChangeInput = (key: any, value: any) => {
    setDataForm({ ...dataForm, [key]: value ?? "" });
  };

  const handleChangeSelect = (key: any, value: any) => {
    setDataForm({ ...dataForm, [key]: Number(value) ?? "" });
  };

  const handleCloseForm = () => {
    setNewLineDeal(null);
  };

  const handleSubmitForm = () => {
    createDeal(dataForm);
    setDataErr(INIT_ERROR);
  };

  const handleSubmitFormByEnter = (e: { key: string; keyCode: number }) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      createDeal(dataForm);
      setDataErr(INIT_ERROR);
    }
  };

  useEffect(() => {
    setDataErr({ ...INIT_ERROR, ...errors });
  }, [errors]);

  return (
    <>
      <TableRow>
        <TableCell>{indexDealItem}</TableCell>
        <TableCell>
          <InputBase
            keyword="name"
            placeholder={trans.deal.deal_name}
            size="small"
            displayErrorText={false}
            handleChange={handleChangeInput}
            onKeyUp={handleSubmitFormByEnter}
            value={dataForm?.name}
            errorText={getFirstValueInObject(dataErr?.name)}
          />
        </TableCell>
        <TableCell sx={{ width: 30 }}>
          <SelectDefault
            keyword="categoryId"
            keyMenuItem="id"
            keyValue="name"
            size="small"
            data={dataCategoryList?.items ?? []}
            value={dataForm?.categoryId}
            handleChange={handleChangeSelect}
            onKeyUp={handleSubmitFormByEnter}
          />
        </TableCell>
        <TableCell>
          <DatePickerDefault
            keyword="forecastCloseDate"
            size="small"
            minDate={new Date()}
            value={dataForm?.forecastCloseDate}
            handleChange={handleChangeInput}
            onKeyUp={handleSubmitFormByEnter}
          />
        </TableCell>
        <TableCell>
          <SelectDefault
            keyword="currencyId"
            keyMenuItem="id"
            keyValue="name"
            size="small"
            data={dataCurrencyList ?? []}
            value={dataForm?.currencyId}
            handleChange={handleChangeSelect}
            onKeyUp={handleSubmitFormByEnter}
          />
        </TableCell>
        <TableCell width="20%">
          <InputFormatNumber
            keyword="price"
            placeholder="Price"
            size="small"
            displayErrorText={false}
            handleChange={handleChangeInput}
            onKeyUp={handleSubmitFormByEnter}
            value={dataForm?.price}
          />
        </TableCell>
        <TableCell className="text-align-center">
          <IconButton size="small" onClick={handleSubmitForm}>
            <SaveIcon />
          </IconButton>
          <IconButton size="small" onClick={handleCloseForm}>
            <ClearIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  )
}

const mapStateToProps = (state: any) => ({
  errors: state.deal?.error?.response?.data?.properties ?? {},
});

const mapDispatchToProps = {
  createDeal,
  clearData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormTableRowCreateDealItem);
