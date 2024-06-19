import styles from "./styles.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Pagination, PaginationItem } from "@mui/material";
import { keyPage, rowsPerPage } from "../../constants";
import { getParamsToURL } from "../../helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PaginationDefault = (props: any) => {
  const {
    total,
    paginateByParamUrl = true,
    setQuerySearch,
    setCustomPage = () => {},
    customPage,
    setNewLineOrderItem = () => {},
    statusId,
    currencyId,
  } = props;
  const router = useRouter();
  const params = router.query;
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (paginateByParamUrl && !statusId)
      setPage(Number(router.query[keyPage] ?? 1));
  }, [router.query]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown> | null,
    newPage: number
  ) => {
    if (paginateByParamUrl && !statusId && !currencyId) {
      router.push({
        pathname: router.route,
        query: getParamsToURL({ ...params, [keyPage]: newPage }),
      });
    } else {
      setNewLineOrderItem(null);
      setCustomPage(newPage);
      setPage(newPage);
      const querySearch = `limit=${rowsPerPage}&offset=${
        (newPage - 1) * rowsPerPage
      }${statusId ? `&statusId=${statusId}` : ""}${
        currencyId ? `&currencyId=${currencyId}` : ""
      }`;
      router.push({
        pathname: router.route,
        query: {
          ...router.query,
          page: newPage,
        },
      });
      setQuerySearch(querySearch);
    }
  };

  return (
    <>
      <div className={styles["pagination"]}>
        <Pagination
          count={Math.ceil(total / rowsPerPage)}
          page={paginateByParamUrl && !statusId ? page : customPage}
          onChange={handleChangePage}
          color="primary"
          size="large"
          renderItem={(item) => (
            <PaginationItem
              components={{
                previous: ArrowBackIcon,
                next: ArrowForwardIcon,
              }}
              {...item}
            />
          )}
        />
      </div>
    </>
  );
};

export default PaginationDefault;
