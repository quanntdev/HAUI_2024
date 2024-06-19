import { Typography } from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import Select from "react-select";
import styles from "./styles.module.scss";

export default function MutiSelectInForm(props: any) {
  const {
    selectOption,
    placeholder,
    setDataForm,
    keyword,
    dataForm,
    labelText,
  } = props;

  const colourStyles = {
    control: (styles: any) => ({
      ...styles,
      backgroundColor: "white",
      minHeight: `56px`,
      width: `100%`,
    }),
  };

  const [defaultValue, setDefatultValue] = useState<any>();

  const defautOption: any = selectOption?.map(
    (key: { id: any; name: any; code: any }) => ({
      id: key?.id.toString(),
      label: keyword == `invoiceId` ? key?.code : key?.name,
      value: key?.id.toString(),
    })
  );

  const handleChange = React.useCallback((newValue: any) => {
    let listValue: any = [];
    newValue.forEach(function (value: any) {
      listValue.push(Number(value?.value));
    });
    setDataForm((prevDataForm:any) => ({ ...prevDataForm, [keyword]: listValue.join() }));
  }, [keyword]);

  useEffect(() => {
    if (selectOption && selectOption.length > 0) {
      let listItems: any = [];
      listItems = dataForm[`${keyword}`]?.toString().split(",");
      let result = defautOption.filter((obj: any) =>
        listItems?.includes(obj.id)
      );
      setDefatultValue(result);
    }
  }, [selectOption, dataForm]);


  return (
    <>
      <Typography>{labelText}</Typography>
      <Select
        isDisabled={selectOption.length > 0 ? false : true}
        closeMenuOnSelect={false}
        isMulti
        options={defautOption}
        placeholder={placeholder}
        styles={colourStyles}
        className={styles["form-muti-filter"]}
        onChange={handleChange}
        defaultValue={defaultValue}
        value={defaultValue}
        classNamePrefix="select"
      />
    </>
  );
}
