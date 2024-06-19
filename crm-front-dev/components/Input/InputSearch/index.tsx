import {
  Box,
  ButtonBase,
  InputAdornment,
  OutlinedInput,
  Avatar,
  Tooltip,
} from "@mui/material";
import { IconAdjustmentsHorizontal, IconSearch } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";
import { getParamsToURL } from "../../../helpers";
import { keyPage, pageDefault } from "../../../constants";
import FormFilterDeal from "../../FormFilter/FormFilterDeal";
import useTrans from "../../../utils/useTran";

const OutlineInputStyle = styled(OutlinedInput)(({ theme }) => ({}));

const HeaderAvatarStyle = styled(Avatar, {})(({ theme }) => ({}));

const InputSearch = (props: any) => {
  const trans = useTrans();
  const {
    name = "keyword",
    notOnlySearch = false,
    dataFilter,
    customNameStatus,
    getCategory,
    filter = true,
    type,
    placeholder,
    dataLevel,
    dataChanel,
    dataCountry,
    dataUserList,
  } = props;
  const router = useRouter();
  const params = router.query;
  const [value, setValue] = useState<string | string[]>("");
  const [openFilter, setOpenFilter] = useState<boolean>(false);

  useEffect(() => {
    setValue(router.query[name] ?? "");
  }, [router.query]);

  const handleChangeKeyword = (e: { target: { value: any } }) => {
    setValue(e.target.value ?? "");
  };

  const handleSearchByEnter = (e: { key: string; keyCode: number }) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      handleSearch();
    }
  };

  const handleFilter = () => {
    if (notOnlySearch) {
      setOpenFilter(true);
    } else {
      handleSearch();
    }
  };

  const handleSearch = () => {
    router.push({
      pathname: router.route,
      query: getParamsToURL({
        ...params,
        [name]: value,
        [keyPage]: pageDefault,
      }),
    });
  };
  return (
    <>
      <Box
        className={styles["input-outline"]}
        sx={{ display: { xs: "none", md: "block" } }}
      >
        <OutlineInputStyle
          className={
            filter ? styles["input-outline"] : styles["input-customer"]
          }
          id="input-search-header"
          placeholder={placeholder}
          value={value}
          onChange={handleChangeKeyword}
          onKeyUp={handleSearchByEnter}
          startAdornment={
            <InputAdornment position="start">
              <IconSearch stroke={1.5} size="1rem" />
            </InputAdornment>
          }
          endAdornment={
            filter ? (
              <InputAdornment position="end" onClick={handleFilter}>
                <Tooltip
                  title="Filter Search"
                  style={{
                    display: "inline-block",
                    marginRight: "4px",
                  }}
                >
                  <ButtonBase sx={{ borderRadius: "12px" }}>
                    <HeaderAvatarStyle
                      className={styles["input-avatar"]}
                      variant="rounded"
                    >
                      <IconAdjustmentsHorizontal stroke={1.5} size="1.3rem" />
                    </HeaderAvatarStyle>
                  </ButtonBase>
                </Tooltip>
              </InputAdornment>
            ) : (
              ""
            )
          }
          aria-describedby="search-helper-text"
          inputProps={{ "aria-label": "weight" }}
        />
        <FormFilterDeal
          openModal={openFilter}
          setOpenModal={setOpenFilter}
          title={trans.deal.filter}
          keyword={value}
          isCreateNew={false}
          dataFilter={dataFilter}
          customNameStatus={customNameStatus}
          getCategory={getCategory}
          type={type}
          dataLevel={dataLevel}
          dataChanel={dataChanel}
          dataCountry={dataCountry}
          dataUserList={dataUserList}
        />
      </Box>
    </>
  );
};

export default InputSearch;
