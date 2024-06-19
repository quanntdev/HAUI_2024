
import { TableRow, TableCell, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import InputBase from "../Input/InputBase";
import { createOrderItem, clearData } from "../../redux/actions/orderItem";
import InputFormatNumber from "../Input/InputFormatNumber";
import { getFirstValueInObject } from "../../helpers";
import useTrans from "../../utils/useTran";

type DataFormType = {
  title: string;
  estimateHour: string;
  statusId: number | null;
  completedDate: Date | null;
  unitPrice: string;
  value: string;
  orderId: number | null;
  currencyId: number | null;
};

const INIT_DATA = {
  title: "",
  estimateHour: "",
  statusId: null,
  completedDate: null,
  unitPrice: "",
  value: "",
  orderId: null,
  currencyId: null,
};

const INIT_ERROR = {
  title: "",
  unitPrice: "",
  value: "",
};

const FormTableRowCreateOrderItem = (props: any) => {

  const trans = useTrans();

  const {
    dataOrderStatusList,
    currencyId,
    orderId,
    setNewLine,
    createOrderItem,
    indexOrderItem,
    getFormDataFromOrderItem,
    newLineOrderItem,
    errors,
  } = props;
  const [dataForm, setDataForm] = useState<DataFormType>(INIT_DATA);
  const [dataError, setDataError] = useState(INIT_ERROR);
  const [totalValue, setTotalValue] = useState<any>();

  useEffect(() => {
    setDataForm({
      ...dataForm,
      orderId: Number(orderId),
      statusId: Number(dataOrderStatusList[0]?.id),
      currencyId: Number(currencyId),
    });
    if (newLineOrderItem) {
      setDataForm({
        ...INIT_DATA,
        orderId: Number(orderId),
        statusId: Number(dataOrderStatusList[0]?.id),
        currencyId: Number(currencyId),
      });
    }
  }, [orderId, newLineOrderItem]);

  const handleChangeInput = (key: any, value: any) => {
    setDataForm({ ...dataForm, [key]: value ?? "" });
    getFormDataFromOrderItem({ ...dataForm, [key]: value ?? "" });
  };

  useEffect(() => {
    if (dataForm?.estimateHour && dataForm?.unitPrice) {
      setTotalValue(
        (
          Number(dataForm?.estimateHour.replace(/,/g, "")) *
          Number(dataForm?.unitPrice.replace(/,/g, ""))
        ).toLocaleString()
      );
    }
  }, [dataForm]);

  useEffect(() => {
    if (totalValue) {
      setDataForm({ ...dataForm, value: totalValue });
    }
  }, [totalValue]);

  const handleSubmitForm = () => {
    createOrderItem({...dataForm , unitPrice: dataForm.unitPrice.replace(/,/g, '')});
    setDataError(INIT_ERROR);
    setNewLine(null);
  };

  const handleSubmitFormByEnter = useCallback((e: { key: string; keyCode: number }) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      handleSubmitForm();
    }
  }, [handleSubmitForm]);

  useEffect(() => {
    setDataError({ ...INIT_ERROR, ...errors });
  }, [errors]);

  const handleCloseForm = () => {
    setNewLine(null);
  };

  return (
    <>
      <TableRow>
        <TableCell>{indexOrderItem}</TableCell>
        <TableCell>
          <InputBase
            keyword="title"
            placeholder={trans.order.title}
            size="small"
            value={dataForm?.title}
            displayErrorText={false}
            onKeyUp={handleSubmitFormByEnter}
            handleChange={handleChangeInput}
            errorText={getFirstValueInObject(dataError?.title)}
          />
        </TableCell>
        <TableCell>
          <InputFormatNumber
            keyword="estimateHour"
            placeholder={trans.order.estimate_hours}
            size="small"
            value={dataForm?.estimateHour}
            onKeyUp={handleSubmitFormByEnter}
            handleChange={handleChangeInput}
          />
        </TableCell>
        <TableCell>
          <InputFormatNumber
            keyword="unitPrice"
            size="small"
            placeholder={trans.order.unit_price}
            displayErrorText={false}
            value={dataForm?.unitPrice}
            onKeyUp={handleSubmitFormByEnter}
            handleChange={handleChangeInput}
            errorText={getFirstValueInObject(dataError?.unitPrice)}
          />
        </TableCell>
        <TableCell>
          <IconButton size="small" onClick={handleSubmitForm}>
            <SaveIcon />
          </IconButton>
          <IconButton size="small" onClick={handleCloseForm}>
            <ClearIcon />
          </IconButton>
        </TableCell>
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
)(FormTableRowCreateOrderItem);
