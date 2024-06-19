import {useRouter } from "next/router";
import styles from "./style.module.scss";
import useTrans from "../../utils/useTran";
import { useEffect } from "react";

const QueryListBar = (props: any) => {
  const trans = useTrans();

  const router = useRouter();
  const output: any = {};
  for (const key in router.query) {
    if (key.endsWith("Label")) {
      output[key] = router.query[key];
    }
  }
  const listKey: {}[] = [];

  for (const [key, value] of Object.entries(output)) {
    listKey.push({ key, value });
  }

  const fomatKeylabel = (label: any) => {
    switch (label) {
      case "levelIdLabel":
        return trans.customer.level;
      case "countryIdLabel":
        return trans.customer.country;
      case "provinceIdLabel":
        return trans.customer.province;
      case "userAssignLabel":
        return trans.customer.user_assigned;
      case "valueFromLabel":
        return trans.deal.value_form;
      case "currencyIdLabel":
        return trans.customer_detail.currency;
      case "valueToLabel":
        return trans.deal.value_to;
      case "statusIdLabel":
        return trans.deal.status;
      case "startTimeLabel":
        return trans.deal.start_time;
      case "endTimeLabel":
        return trans.deal.end_time;
      case "customerIdLabel":
        return trans.customer.customer_name;
      case "categoryIdLabel":
        return trans.deal.category;
      case "genderIdLabel":
        return trans.customer_detail.gender;
      case "phoneNumberLabel":
        return trans.customer_detail.phone_number;
      case "emailLabel":
        return trans.customer_detail.email;
      case "cidLabel":
        return trans.customer_detail.cid;
      case "contactNameLabel":
        return trans.menu.contact;
      case "taskNameLabel":
        return trans.task.task_name;
      case "methodIdLabel":
        return trans.customer_detail.method;
      default:
        return label;
    }
  };

  const handleDeleteRoute = (item: any) => {
    const re = item.replace("Label", "");
    const q = router.query;
    delete q[`${item}`];
    delete q[`${re}`];
    router.push({
      pathname: router.pathname,
      query: {
        ...q,
      },
    });
  };

  const clearRouter = () => {
    router.push({
      pathname: router.pathname,
    });
  };

  useEffect(() => {
    if (router.query.genderIdLabel) {
      const q = router.query;
      delete q[`${router.query.genderIdLabel}`];

      const query = router.query.genderId
        ? {
            genderIdLabel:
              router.query.genderId === "1"
                ? trans.contact.male
                : trans.contact.female,
          }
        : q;

      router.push({
        pathname: router.pathname,
        query: query,
      });
    }
  }, [localStorage.getItem("languages")]);

  return (
    <>
      {listKey.map((item: any) => (
        <>
          <div className={styles["list-query-bar"]}>
            <div className={styles["list-query-bar-item"]}>
              <span className={styles["list-query-label"]}>
                {fomatKeylabel(item.key)}
              </span>
              : <span className={styles["list-query-value"]}>{item.value}</span>
              <span
                className={styles["list-query-bar-delete"]}
                onClick={() => handleDeleteRoute(item.key)}
              >
                x
              </span>
            </div>
          </div>
        </>
      ))}
      {listKey?.length > 0 && (
        <div className={styles["list-query-bar-remove"]} onClick={clearRouter}>
          {trans.contact.clear}
        </div>
      )}
    </>
  );
};

export default QueryListBar;
