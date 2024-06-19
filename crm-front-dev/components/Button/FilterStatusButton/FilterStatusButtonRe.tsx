import { Grid } from "@mui/material";
import { SELECT_ALL_INDEX } from "../../../constants";
import SelectDefault from "../../Input/SelectDefault";
import { useRouter } from "next/router";
import useTrans from "../../../utils/useTran";

const FilterStatusButtonRe = (props: any) => {
  const trans = useTrans();
  const {
    dataStatusList,
    setStatusId = () => {},
    statusId = SELECT_ALL_INDEX,
    setPage = () => {},

    keyword,
    placeholder = trans.home.select_status,
    disable = false,
    keywordReset,
    labelReset,
    labelKey
  } = props;

  const router = useRouter();

  const handleChangeSelect = function (key: any, value: any , lable: any , lableValue: any) {

    setStatusId(value);
    const q = router.query;
    if(key === 'countryId'){
      delete q[`provinceId`];
    }
    if(lable === "countryIdLabel") {
      delete q[`provinceIdLabel`];
    }
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
      if(q[`${keywordReset}`]) {
        delete q[`${keywordReset}`];
      }
      if(q[`${labelReset}`]) {
        delete q[`${labelReset}`];
      }
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
    <Grid style={{ width: 200, marginRight: 20 }}>
      <SelectDefault
        fillterAll={true}
        placeholder={placeholder}
        keyword={keyword}
        keyMenuItem="id"
        keyValue="name"
        size="small"
        padding="3px 0 3px"
        data={dataStatusList}
        value={statusId}
        handleChange={handleChangeSelect}
        disabled={disable}
        // handleChangeLable={handleChangeLable}
        labelKey={labelKey}
      />
    </Grid>
  );
};

export default FilterStatusButtonRe;
