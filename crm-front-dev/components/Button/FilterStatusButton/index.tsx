import { Grid } from "@mui/material";
import { useEffect } from "react";
import styles from "./styles.module.scss";
import SelectDefault from "../../Input/SelectDefault";
import { useRouter } from "next/router";

const FilterStatusButton = (props: any) => {
  const {
    dataStatusList,
    setStatusId = () => {},
    statusId,
    setPage = () => {},
    labelKey,
  } = props;
  const router = useRouter();

  useEffect(() => {
    if (router.query["statusId"]) {
      setStatusId(router.query["statusId"]);
    }
  }, [router.query]);

  const handleChangeSelect = function (
    key: any,
    value: any,
    lable: any,
    lableValue: any
  ) {
    setStatusId(value);
    const q = router.query;
    if (value !== 0) {
      delete q[`page`];
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          [key]: value,
          [lable]: lableValue,
        },
      });
    } else {
      delete q[`${key}`];
      delete q[`${lable}`];
      router.push({
        pathname: router.pathname,
        query: {
          ...q,
        },
      });
    }
    setPage(1);
  };

  return (
    <Grid className={styles["btn-filter-user"]} style={{ width: 200 }}>
      <SelectDefault
        fillterAll={true}
        placeholder={"Not done yet"}
        keyword="statusId"
        keyMenuItem="id"
        keyValue="name"
        size="small"
        padding="3px 0 3px"
        data={dataStatusList}
        value={statusId ?? ""}
        handleChange={handleChangeSelect}
        labelKey={labelKey}
      />
    </Grid>
  );
};

export default FilterStatusButton;
