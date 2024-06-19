import { Box, Card, Grid, IconButton, Rating, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import InputTiny from "../../components/Input/InputTiny";
import {
  getDetailOrder,
  updateOrder,
  clearData,
} from "../../redux/actions/order";
import checkChangeDataBeforeUpdate from "../../utility/checkChangeDataBeforeUpdate";
import useTrans from "../../utils/useTran";

const BoxCustomerReview = (props: any) => {
  const trans = useTrans();
  const { updateOrder, dataOrderDetail, dataForm, setDataForm } = props;
  const { dataUpdateOrder, dataUpdateOrderStatus } = props.order;
  const router = useRouter();
  const q: any = useMemo(() => router.query, [router]);
  const id = dataOrderDetail?.id || q?.id;
  const [editCommentButton, setEditCommentButton] = useState<boolean>(false);


  const handleChangeEditCommentButton = useCallback(() => {
    setEditCommentButton(prevState => !prevState);
    if (editCommentButton && checkChangeDataBeforeUpdate(dataForm, dataOrderDetail)) {
      updateOrder(dataForm, id);
    }
  }, [editCommentButton, dataForm, dataOrderDetail, id, updateOrder]);

  const handleChangeRatingPoint = useCallback((value: any) => {
    setDataForm((prevDataForm: any) => ({ ...prevDataForm, ratePoint: value }));
  }, [dataForm]);

  const handleChangeInput = useCallback((key: any, value: any) => {
    setDataForm((prevDataForm: any) => ({ ...prevDataForm, review: value }));
  }, [dataForm]);

  useEffect(() => {
    if (dataUpdateOrder) {
      getDetailOrder(id);
    }
  }, [dataUpdateOrder, dataUpdateOrderStatus]);
  


  return (
    <Card
      sx={{ padding: "20px", height: "100%", boxShadow: "0px 0px 10px white" }}
      className={editCommentButton ? styles["custom-height"] : ""}
    >
      <Grid container className={styles["grid-title-box"]}>
        <Grid item>
          <Typography
            sx={{ fontSize: "1rem", padding: "8px", fontWeight: "700" }}
          >
            {trans.order.customer_review}
            <IconButton onClick={handleChangeEditCommentButton} sx={{ padding: 0, marginLeft: "20px"}}>
            {editCommentButton ? <SaveIcon /> : <EditIcon />}
          </IconButton>
          </Typography>
        </Grid>
      </Grid>
      <Box>
        <Grid container sx={{ alignItems: "center", marginLeft: "-20px" }}>
          <Grid item xs={3}>
            <Typography>{trans.order.rate_point}</Typography>
          </Grid>
          <Grid item xs>
            <Rating
              name="simple-controlled"
              value={Number(dataForm?.ratePoint)}
              max={10}
              onChange={(event, newValue) => {
                handleChangeRatingPoint(newValue);
              }}
              readOnly={editCommentButton ? false : true}
            />
          </Grid>
          <Grid item>
            <Typography sx={{ fontWeight: "700", paddingRight: "12px" }}>{`${
              dataOrderDetail?.ratePoint ?? 0
            } pt`}</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box className={styles["comment-box"]} sx={{marginLeft : "-20px", width: "100%"}}>
        {editCommentButton ? (
          <InputTiny
            handleChange={handleChangeInput}
            keyword="review"
            value={dataForm?.review}
          />
        ) : (
          <Box>
            <Typography>{trans.order.comment}</Typography>
            <Typography>
              <span
                dangerouslySetInnerHTML={{ __html: dataOrderDetail?.review }}
              />
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
};

const mapStateToProps = (state: any) => ({
  order: state?.order,
});

const mapDispatchToProps = {
  updateOrder,
  clearData,
};

export default connect(mapStateToProps, mapDispatchToProps)(BoxCustomerReview);
