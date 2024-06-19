import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

const SortByDateBtn = (props: any) => {
  const {
    keyword,
    setIsSorting,
    isSorting
  } = props;
  const router = useRouter();

  const [sortASC, setSortASC] = useState<boolean>(false);
  const [isHere , sortIsHerer] = useState<boolean>(false);
  const handleSetValue = (value: any) => {
    setSortASC(!sortASC);
    router.push({
      pathname: router.pathname,
      query: {...router.query, ["sortBy"] : keyword, ["typeSort"] : value },
    });
    setIsSorting(false)
  };

  useEffect(() => {
    if(router.query.sortBy === keyword) {
      sortIsHerer(true)
      setIsSorting(false)
    } else {
      sortIsHerer(false)
    }
  }, [router.query])

  useEffect(() => {
    if(router.query.sortBy) {
      setIsSorting(false)
    } else {
      setIsSorting(true)
    }
  }, [router.query])

  useEffect(() => {
    if (router.query.typeSort == "DESC") {
      setSortASC(true);
    } else {
      setSortASC(false);
    }
  }, [router.query]);

  return (
    <>
      <Button
        onClick={(e) => handleSetValue("ASC")}
        className={styles["button-icon"]}
      >
        <NorthIcon
          style={(!sortASC && isHere || isSorting )? { color: "black" } : {}}
          className={styles["button-icon-ic"]}
        />
      </Button>
      <Button
        onClick={(e) => handleSetValue("DESC")}
        className={styles["button-icon"]}
      >
        <SouthIcon
          style={(sortASC && isHere)? { color: "black" } : {}}
          className={styles["button-icon-ic"]}
        />
      </Button>
    </>
  );
};

export default SortByDateBtn;
