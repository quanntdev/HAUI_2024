import { Box, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import useTrans from "../../utils/useTran";
import styles from "./styles.module.scss";

const BoxCustomerInformation = (props: any) => {
  const { customer, country, hasBorder = true } = props;
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const router = useRouter();

  const redirectToCustomerDetail = useCallback(() => {
    router.push(`/customer/${customer?.id}`);
  }, [customer, router]);

  const trans = useTrans();
  return (
    <Box
      sx={{
        padding: hasBorder ? "30px 20px" : "0px 0px",
        height: "auto",
        borderRight: hasBorder ? "2px dashed lightgray" : "none",
        background: !hasBorder ? "none" : "",
      }}
    >
      <Typography
        sx={{
          padding: "2px",
          fontWeight: "700",
          paddingLeft: "10px",
          borderRadius: "5px",
          paddingBottom: "12px",
          paddingTop: "12px",
          background:
            "linear-gradient(93deg, rgba(232,232,232,1) 0%, rgba(245,240,240,0.41208202030812324) 43%, rgba(255,255,255,1) 100%)",
        }}
      >
        {trans.deal.customer_information}
      </Typography>
      <Grid container className={styles["customer-detail-row"]}>
        <Grid item md={5} xs sx={{ marginTop: "15px" }}>
          <span style={{ color: "gray", marginLeft: "13px" }}>
            {trans.customer.name}
          </span>
        </Grid>

        <Grid item xs>
          <Typography
            onClick={redirectToCustomerDetail}
            sx={{ cursor: "pointer" }}
            className="text-cursor"
          >
            {customer?.name}
          </Typography>
        </Grid>
      </Grid>
      <Grid container className={styles["customer-detail-row"]}>
        <Grid item md={5} xs>
          <span style={{ color: "gray", marginLeft: "13px" }}>
            {trans.customer.cid}
          </span>
        </Grid>

        <Grid item xs>
          <Typography>
            {customer?.country?.name &&
              customer?.cidCode &&
              customer?.country?.name + "-" + customer?.cidCode}
          </Typography>
        </Grid>
      </Grid>
      {!showDetail && (
        <p
          style={{ marginLeft: "25px" }}
          className="text-cursor"
          onClick={() => setShowDetail(true)}
        >
          {trans.task.show_detail}
        </p>
      )}
      {showDetail && (
        <>
          {!!country ? (
            <Grid container className={styles["customer-detail-row"]}>
              <Grid item md={5} xs>
                {trans.customer_detail.cid}
              </Grid>
              <Grid item xs>
                {country + "-" + customer?.cidCode}
              </Grid>
            </Grid>
          ) : (
            ""
          )}
          <Grid container className={styles["customer-detail-row"]}>
            <Grid item md={5} xs>
              <span style={{ color: "gray", marginLeft: "13px" }}>
                {" "}
                {trans.customer_detail.industry}
              </span>
            </Grid>
            <Grid item xs>
              {customer?.industry?.name}
            </Grid>
          </Grid>
          <Grid container className={styles["customer-detail-row"]}>
            <Grid item md={5} xs>
              <span style={{ color: "gray", marginLeft: "13px" }}>
                {" "}
                {trans.customer_detail.address}
              </span>
            </Grid>
            <Grid item xs>
              {customer?.address}
            </Grid>
          </Grid>
          <Grid container className={styles["customer-detail-row"]}>
            <Grid item md={5} xs>
              <span style={{ color: "gray", marginLeft: "13px" }}>
                {" "}
                {trans.customer_detail.phone}
              </span>
            </Grid>
            <Grid item xs>
              {customer?.phone}
            </Grid>
          </Grid>
          <Grid container className={styles["customer-detail-row"]}>
            <Grid item md={5} xs>
              <span style={{ color: "gray", marginLeft: "13px" }}>
                {" "}
                {trans.customer_detail.fax}
              </span>
            </Grid>
            <Grid item xs>
              {customer?.fax}
            </Grid>
          </Grid>
          <Grid container className={styles["customer-detail-row"]}>
            <Grid item md={5} xs>
              <span style={{ color: "gray", marginLeft: "13px" }}>
                {" "}
                {trans.customer_detail.email}
              </span>
            </Grid>
            <Grid item xs>
              {customer?.email}
            </Grid>
          </Grid>
          <Grid container className={styles["customer-detail-row"]}>
            <Grid item md={5} xs>
              <span style={{ color: "gray", marginLeft: "13px" }}>
                {" "}
                {trans.customer_detail.website}
              </span>
            </Grid>
            <Grid item xs>
              <Link href={customer?.website ?? ""}>
                <a className="text-cursor" target="_blank">
                  {customer?.website}
                </a>
              </Link>
            </Grid>
          </Grid>
          {showDetail && (
            <p
              style={{ marginLeft: "25px" }}
              className="text-cursor"
              onClick={() => setShowDetail(false)}
            >
              {trans.task.hide_details}
            </p>
          )}
        </>
      )}
    </Box>
  );
};

export default BoxCustomerInformation;
