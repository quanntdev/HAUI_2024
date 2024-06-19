import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import SelectDefault from "../../Input/SelectDefault";
import { useRouter } from "next/router";
import useTrans from "../../../utils/useTran";

const FilterUserAssignedButton = (props: any) => {
  const trans = useTrans();
  const {
    dataUserList,
    setPage = () => {},
    setUserAssignedId = () => {},
    userAssignedId,
    labelKey,
  } = props;
  const [disabled, setDisabled] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const q = Object.entries(router.query);
    if (q.length > 0 && q.find((item: any) => item.includes("mytask"))) {
      setDisabled(true);
      setUserAssignedId(null);
    } else {
      setDisabled(false);
    }
  }, [router.query]);

  useEffect(() => {
    if (router?.query?.userAssign) {
      setUserAssignedId(Number(router?.query?.userAssign));
    }
  }, [router.query]);

  const handleChangeSelect = function (
    key: any,
    value: any,
    lable: any,
    lableValue: any
  ) {
    setUserAssignedId(value);
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
    <Grid className={styles["bth-filter-user"]} style={{ width: 200 }}>
      <SelectDefault
        disabled={disabled}
        fillterAll={true}
        data={dataUserList?.items}
        placeholder={trans.customer.all_user_assigned}
        padding="3px 0 3px"
        handleChange={handleChangeSelect}
        fullWidth
        value={userAssignedId ?? null}
        size="small"
        keyword="userAssign"
        keyMenuItem="id"
        keyValue="profile"
        keyValuePropertyOne="first_name"
        keyValuePropertyTwo="last_name"
        labelKey={labelKey}
      />
    </Grid>
  );
};

export default FilterUserAssignedButton;
