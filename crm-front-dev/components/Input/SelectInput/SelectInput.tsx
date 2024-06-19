import Select from "react-select";
import { Typography, Button } from "@mui/material";
import CreatableSelect from "react-select/creatable";
import CachedIcon from "@mui/icons-material/Cached";

const customStyles = {
  control: (base: any, state: { isFocused: any }) => ({
    ...base,
    height: "56px",
  }),
};

const customStylesValidate = {
  control: (base: any, state: { isFocused: any }) => ({
    ...base,
    height: "56px",
    border: "1px solid red",
  }),
}

const SelectInput = (props: any) => {
  const {
    options,
    labelText,
    value,
    handleChange,
    keyword,
    require = false,
    disabled = false,
    createCustomer,
    dataCreateCustomer,
    isCreateNew,
    formFilter,
    errorText,
    labelKey,
  } = props;

  const defaults = options?.filter((key: { id: any }) => {
    return key?.id == value;
  });

  const handleClick = (e: any) => {
    if (e && !e.hasOwnProperty("id")) {
      createCustomer({ name: e.value, description: "" });
      keyword
        ? handleChange(keyword, dataCreateCustomer?.data?.id)
        : handleChange(dataCreateCustomer?.data?.id);
    } else {
      keyword ? handleChange(keyword, e?.value, labelKey,  e?.label) : handleChange(e?.value);
    }
  };

  const handleChangeData = () => {
    keyword ? handleChange(keyword, null) : handleChange(null);
  };

  return (
    <>
      <Typography className={require ? "require" : "" + "arrow-icon"}>
        {labelText}
        {formFilter && (
          <Button onClick={handleChangeData}>
            <CachedIcon />
          </Button>
        )}
      </Typography>
      {isCreateNew && (
        <CreatableSelect
          styles={
            (errorText) ? customStylesValidate : customStyles
          }
          options={options}
          isDisabled={disabled}
          value={{ label: defaults[0]?.label, value: defaults[0]?.id }}
          onChange={handleClick}
          required={require}
          // error="This field is required"
        />
      )}
      {!isCreateNew && (
        <Select
          styles={
            (errorText) ? customStylesValidate : customStyles
          }
          options={options}
          isDisabled={disabled}
          required={require}
          value={
            defaults
              ? { label: defaults[0]?.label, value: defaults[0]?.id }
              : ""
          }
          onChange={(e: any) => 
            {
              keyword ? handleChange(keyword, e?.value, labelKey,  e?.label) : handleChange(e?.value)
            }
          }
        />
      )}
      <span className="text-fail-validate">
        {errorText ? errorText : ""}
      </span>
    </>
  );
};

export default SelectInput;
