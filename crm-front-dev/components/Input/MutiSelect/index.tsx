import { useRouter } from "next/router";
import * as React from "react";
import { useEffect, useState } from "react";
import Select, { StylesConfig } from "react-select";
import styles from "./styles.module.scss";

export default function MutiSelect(props: any) {
  const { selectOption, placeholder, object, filterBox = false } = props;

  const colorStyles: StylesConfig<typeof selectOption, true> = {
    control: (styles: any) => ({
      ...styles,
      backgroundColor: "white",
      minHeight: `${filterBox ? "56px" : "46px"}`,
      width: `${filterBox ? "100%" : "250px"}`,
    }),
    option: (styles: any, { data }) => {
      return {
        ...styles,
        color: data.color,
        border: `3px solid ${data.backgroundcolor}`,
        backgroundColor: data.backgroundcolor,
      };
    },
    multiValueLabel: (styles: any, { data }) => ({
      ...styles,
      color: data.color,
      backgroundColor: data.backgroundcolor,
    }),
    placeholder: (styles: any) => ({
      ...styles,
      fontStyle: "italic",
    }),
  };

  const [defaultValue, setDefatultValue] = useState<any>();
  const router = useRouter();

  const convertString = (str: any) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const defautOption: any = selectOption?.map(
    (key: { id: any; name: any; backgroundcolor: any; color: any }) => ({
      label: convertString(key?.name),
      value: key?.id.toString(),
      backgroundcolor: key?.backgroundcolor,
      color: key?.color,
    })
  );

  const option = [{ label: placeholder, value: "all" }].concat(defautOption);

  const handleChange = (newValue: any) => {
    if (newValue[newValue?.length - 1]?.value === "all") {
      let listValue: any = [];
      defautOption.forEach(function (value: any) {
        listValue.push(Number(value?.value));
      });

      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          [object]: listValue.join(),
        },
      });
    } else {
      let listValue: any = [];
      newValue.forEach(function (value: any) {
        listValue.push(Number(value?.value));
      });

      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          [object]: listValue.join(),
        },
      });
    }
  };

  useEffect(() => {
    if (selectOption && selectOption.length > 0) {
      let listItems: any = [];
      if (object === "listPriority") {
        listItems = router.query.listPriority?.toString().split(",");
      } else {
        listItems = router.query.listStatus?.toString().split(",");
      }
      let filteredArray = option?.filter((item: any) =>
        listItems?.includes(item.value)
      );
      setDefatultValue(filteredArray);
    }
  }, [selectOption, router.query]);

  return (
    <>
      {defaultValue && (
        <Select
          closeMenuOnSelect={false}
          isMulti
          options={option}
          placeholder={placeholder}
          styles={colorStyles}
          className={
            filterBox
              ? styles["default-mutiSelect-box"]
              : styles["default-mutiSelect-css"]
          }
          onChange={(e: any) => handleChange(e)}
          defaultValue={defaultValue}
          value={defaultValue}
          classNamePrefix="select"
        />
      )}
    </>
  );
}
