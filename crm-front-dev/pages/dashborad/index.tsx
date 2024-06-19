import { IconDashboard } from "@tabler/icons";
import { connect } from "react-redux";
import Breadcrumb from "../../components/Breadcumb";
import HeadMeta from "../../components/HeadMeta";
import styles from "./styles.module.scss";
import { getLogNote } from "../../redux/actions/lognote";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import LognoteDashBoard from "../../components/LogNote/LognoteDashBoard";
import { EMOJI, REQUEST_METHOD, keyPage, rowsPerPage } from "../../constants";
import { getPageFromParams } from "../../helpers";
import { Box, Button, FormControl, MenuItem, Select } from "@mui/material";
import LazyLoad from "react-lazyload";
import { SlackSelectorHeader } from "@charkour/react-reactions";
import { getDetailProfile } from "../../redux/actions/profile";
import useTrans from "../../utils/useTran";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { searchPayment, searchPaymentNew } from "../../redux/actions/payment";
import { baseAxios } from "../../BaseAxios/axiosBase";
import formatCurrencyValue from "../../utility/formatCurrencyValue";
import {CardElement, Elements, useElements, useStripe} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {PaymentElement} from '@stripe/react-stripe-js';

const Loading = () => (
  <div className="post loading">
    <h5>Loading...</h5>
  </div>
);

const DashBoard = (props: any) => {
  const trans = useTrans();

  const [findBy, setFindBy] = useState<number | null>(null);
  const [filter, setFilter] = useState("comment");

  const router = useRouter();
  const [lazyLoad, setLazyLoad] = useState<boolean>(false);
  const { dataDetailProfile } = props?.profile;
  const { getLogNote, getDetailProfile } = props;
  const { dataLognoteList } = props.lognote;
  const { dataPostComment } = props?.comment;
  const [dataCheck, setDataCheck] = useState<any>([])
  useEffect(() => {
    const page = getPageFromParams(router.query[keyPage]);
    const querySearch =
      `limit=${rowsPerPage}&offset=${page * rowsPerPage}` +
      (router.query?.findBy ? `&findBy=${router.query?.findBy}` : "") +
      (router.query?.show ? `&show=${router.query?.show}` : "");
    getLogNote(querySearch);
  }, [
    getLogNote,
    router.query,
    dataPostComment,
    localStorage.getItem("languages"),
  ]);

  useEffect(() => {
    if (!dataDetailProfile) {
      getDetailProfile();
    }
  }, [dataDetailProfile]);

  useEffect(() => {
    if (router.query?.levelId) {
      setFindBy(Number(router.query?.findBy));
    }

    if (router.query?.show) {
      setLazyLoad(true);
    } else {
      setLazyLoad(false);
    }
  }, [router.query]);

  const showAll = useCallback(() => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        show: "all",
      },
    });
  }, [router]);

  SlackSelectorHeader.defaultProps = {
    tabs: [
      {
        icon: EMOJI.MINE,
        id: "mine",
      },
      {
        icon: EMOJI.PEOPLE,
        id: "people",
      },
      {
        icon: EMOJI.NATURE,
        id: "nature",
      },
      {
        icon: EMOJI.FOOD_AND_DRINK,
        id: "food-and-drink",
      },
      {
        icon: EMOJI.ACTIVITY,
        id: "activity",
      },
      {
        icon: EMOJI.TRAVEL_AND_PLACES,
        id: "travel-and-places",
      },
      {
        icon: EMOJI.OBJECTS,
        id: "objects",
      },
      {
        icon: EMOJI.SYMBOLS,
        id: "symbols",
      },
      {
        icon: EMOJI.FLAGS,
        id: "flags",
      },
    ],
  };

  const handleChangeFilter = useCallback((event: any) => {
    setFilter(event.target.value);
  }, []);

  const handelGetDataPay = async () => {
    const apiResponse: any = await baseAxios.publicRequest({
      url: process.env.NEXT_PUBLIC_API_ADDRESS + `/payments/by-date?`,
      method: REQUEST_METHOD.GET,
    });

    setDataCheck(apiResponse)
  }

  useEffect(() => {
    handelGetDataPay()
    if (filter) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          findBy: filter,
        },
      });
    } else {
      router.push({
        pathname: router.pathname,
        query: "",
      });
    }
  }, [filter]);

  const options = {
    chart: {
      type: 'line'
    },
    title: {
      text: 'Biểu đồ Line'
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%d-%m-%Y' 
      },
      title: {
        text: 'Ngày'
      }
    },
    series: [{
      name: 'Dữ liệu',
      data: 
      dataCheck
      ?.sort((a:any, b:any) => new Date(a?.payment_date) - new Date(b?.payment_date))
      .map((item: any) => {
          const date = new Date(item?.payment_date);
          const totalAmount = parseInt(item?.totalAmount);
          return [date.getTime(), totalAmount];
      })
      
    }]
  };

  console.log(dataCheck)

  const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const handleSubmit = async (event: any) => {
      event.preventDefault();
      if (!stripe || !elements) {
        return;
      }
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: "https://www.linkedin.com/feed/",
        },
      });

      console.log(result)
    };
    return (
      <form onSubmit={handleSubmit}>
        <PaymentElement/>
        <button type="submit" disabled={!stripe}>Submit</button>
      </form>
    );
  };

  return (
    <>
      <HeadMeta title="Customer" />
      <Breadcrumb
        title={trans.home.activity}
        prevPage={null}
        icon={<IconDashboard className={styles["icons"]} />}
      />

      {/* <Box sx={{ marginTop: 3 }}>
        <FormControl sx={{ width: "15%", backgroundColor: "white" }}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filter}
            onChange={handleChangeFilter}
          >
            <MenuItem value={"comment"}>{trans.order.comment}</MenuItem>
            <MenuItem value={"activity"}>{trans.home.activity}</MenuItem>
            <MenuItem value={"lognote"}>{trans.home.show_all_lognote}</MenuItem>
          </Select>
        </FormControl>
      </Box> */}

      {/* <div className={styles["page-content"]}>
        {dataLognoteList?.map((item: any) => (
          <>
            {lazyLoad ? (
              <LazyLoad
                key={item.id}
                height={0}
                offset={[-100, 100]}
                placeholder={<Loading />}
              >
                <LognoteDashBoard
                  key={item.id}
                  dataLog={item}
                  isLoggedInUserId={dataDetailProfile}
                />
              </LazyLoad>
            ) : (
              <LognoteDashBoard
                key={item?.id}
                dataLog={item}
                isLoggedInUserId={dataDetailProfile}
              />
            )}
          </>
        ))}
      </div>
      <div className={styles["show-all"]}>
        {!lazyLoad ? (
          <Button onClick={showAll} variant="contained">
            {trans.home.show_all_lognote}
          </Button>
        ) : (
          ""
        )}
      </div> */}

    <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
      {/* <Elements stripe={stripePromise} options={optionStripe}>
        <CheckoutForm />
      </Elements> */}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  lognote: state.lognote,
  profile: state?.profile,
  comment: state?.comment,
});

const mapDispatchToProps = {
  getLogNote,
  getDetailProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
